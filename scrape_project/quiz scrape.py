import time
import json
from dataclasses import dataclass
from typing import Optional, Dict, List
from urllib.parse import urljoin
from difflib import SequenceMatcher
import requests
from bs4 import BeautifulSoup

INTRO_URL = "https://www.cambstsd.co.uk/impingtontsd/bbtermquiz.php"
QUIZ_URL = "https://www.cambstsd.co.uk/impingtontsd/bb_quiz.php"
BASE = "https://www.cambstsd.co.uk"

OUTFILE = "bb_quiz_capture.json"

REQUEST_DELAY_SECONDS = 1.5 # be polite
MAX_STEPS = 500 #500  # plenty for ~300 questions


def sleep_polite():
    time.sleep(REQUEST_DELAY_SECONDS)


def text_normalise(s: str) -> str:
    return " ".join(s.split()).strip()

@dataclass
class QuestionPage:
    question: str
    options: List[Dict[str, str]]  # [{"value":"a","text":"..."}, ...]
    post_url: str


def parse_question_page(html: str) -> Optional[QuestionPage]:
    soup = BeautifulSoup(html, "html.parser")

    h2 = soup.find("h2")
    if not h2:
        return None

    question = text_normalise(h2.get_text(" ", strip=True))
    if not question:
        print("Didn't get question" + h2.get_text(" ", strip=True))
        return None

    form = soup.find("form", attrs={"method": "post"})
    if not form:
        print("Didn't find form")
        return None

    action = form.get("action") or ""
    post_url = urljoin(BASE, action)

    buttons = form.find_all("button", attrs={"name": "response"})
    if not buttons:
        print ("didn't find buttons")
        return None

    options = []
    for b in buttons:
        val = b.get("value")
        txt = text_normalise(b.get_text(" ", strip=True))
        if val and txt:
            options.append({"value": val, "text": txt})

    if not options:
        return None

    return QuestionPage(question=question, options=options, post_url=post_url)


def parse_feedback(html: str) -> list[str]:
    """
    Best-effort parsing of a feedback page. We don't know the exact markup,
    so this looks for common words. You can customise once you paste a sample.
    """
    soup = BeautifulSoup(html, "html.parser")
    feedback_div = soup.find("div", id="feedback")
    if feedback_div is None:
        return ["", ""]
    feedback_ps = feedback_div.find_all("p")
    feedback_string = feedback_ps[0].get_text(" ", strip=True).lower()
    count = feedback_ps[1].get_text(" ", strip=True).split("/")[1]
    if feedback_string.startswith("correct"):
        answer = feedback_string.split('"')[1]
        return [answer, count]
    else:
        answer = feedback_string.split('"')[3]
        return [answer, count]


def choose_answer_to_advance(q: QuestionPage) -> str:
    """
    Pick an answer to submit so the quiz advances.
    If there's a 'Don't know' option (often 'd'), choose that.
    Otherwise, choose the first option.
    """
    for o in q.options:
        if o["value"].lower() == "d" and "don't know" in o["text"].lower():
            return o["value"]
    return q.options[0]["value"]


def similarity(a: str, b: str) -> float:
    a_norm = text_normalise(a)
    b_norm = text_normalise(b)
    return SequenceMatcher(None, a_norm, b_norm).ratio()


def find_correct_letter(options, correct_meaning):
    best_score = 0
    best_letter = None
    best_text = None

    for letter, text in options.items():
        score = similarity(text_normalise(text), correct_meaning)
        if score > best_score:
            best_score = score
            best_letter = letter
            best_text = text

    if best_score < 0.01:
        print(f"no match found for {options}: {correct_meaning}")
    elif best_score <= 0.6:
        print(f"score was low ({best_score}) for {best_letter} - {best_text}.\nCorrect meaning: {correct_meaning}.")
    elif best_score < 1:
        print(f"score was less than 1 ({best_score}) for {best_letter} - {best_text}.\nCorrect meaning: {correct_meaning}.")
    return best_letter


def main():
    session = requests.Session()
    session.headers.update({
        "User-Agent": "for learning"
    })

    captured: List[Dict] = []
    seen_questions = set()

    # Start quiz
    r = session.get(INTRO_URL, timeout=30)
    r.raise_for_status()
    sleep_polite()

    r = session.get(QUIZ_URL, timeout=30)
    r.raise_for_status()
    sleep_polite()

    for step in range(MAX_STEPS):
        question_page = parse_question_page(r.text)

        if question_page is None:
            # Might be timeout or feedback page; try to continue by restarting
            print("Question page was none: Might be timeout or feedback page; try to continue by restarting")
            # Step 1: hit intro page to initialise session
            r = session.get(INTRO_URL, timeout=30)
            r.raise_for_status()
            sleep_polite()

            # Step 2: now start quiz properly
            r = session.get(QUIZ_URL, timeout=30)
            r.raise_for_status()
            sleep_polite()
            continue

        # Stop condition: repeated question means we looped / finished
        if question_page.question in seen_questions:
            print(f"Stopping: repeated question encountered: {question_page.question!r}")
            break

        seen_questions.add(question_page.question)
        record = {
            "a": question_page.options[0]["text"],
            "b": question_page.options[1]["text"],
            "c": question_page.options[2]["text"],
        }
        captured.append(record)
        captured_count = len(captured)
        print(f"{captured_count:03d}: {question_page.question}")

        # Submit an answer to advance
        choice = choose_answer_to_advance(question_page)
        r2 = session.post(question_page.post_url, data={"response": choice}, timeout=30)
        r2.raise_for_status()
        sleep_polite()

        # If the quiz shows a feedback page in between, you can optionally store it
        feedback = parse_feedback(r2.text)
        answer = find_correct_letter(record, feedback[0])
        record["question"] = question_page.question
        record["correct"] = answer
        if int(feedback[1]) is not captured_count:
            print(f"we're out of sync fb:{0}, cc:{1}", feedback[1], captured_count)
            break
        # After feedback, the server may already return the next question
        # OR may require another GET/POST. Often, the feedback page auto-redirects.
        # We handle both by: try parsing r2 as question; if not, fetch START_URL again.
        #test_for_question_result = "Testing page by parsing as question: "
        qp2 = parse_question_page(r2.text)
        if qp2 is not None:
            r = r2
            #test_for_question_result += "it was a question"
        else:
            r = session.get(QUIZ_URL, timeout=30)
            r.raise_for_status()
            sleep_polite()
        #print (test_for_question_result)

    json_text = json.dumps(captured, ensure_ascii=False, indent=4)
    with open(OUTFILE, "w", encoding="utf-8") as f:
        f.write("const quizData = ")
        f.write(json_text)
        f.write(";")

    print(f"Saved {len(captured)} questions to {OUTFILE}")


def test_cases():
    with open("correct_answer.html", "r", encoding="utf-8") as html:
        parse_feedback(html.read())
    with open("incorrect_answer.html", "r", encoding="utf-8") as html:
        parse_feedback(html.read())


if __name__ == "__main__":
    main()
    #test_cases()
