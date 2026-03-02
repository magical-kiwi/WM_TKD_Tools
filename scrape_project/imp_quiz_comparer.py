import json
from dataclasses import dataclass, asdict
from difflib import SequenceMatcher

translations = {}
def text_normalise(s: str) -> str:
    return " ".join(s.split()).strip()


def similarity(a: str, b: str) -> float:
    a_norm = text_normalise(a)
    b_norm = text_normalise(b)
    return SequenceMatcher(None, a_norm, b_norm).ratio()

@dataclass
class TranslationResult:
    in_val: str
    out_val: str
    accuracy: int


# Search the key section of the translation
def search_korean(val: str):
    out_val = None
    accuracy = -1
    if val in translations:
        out_val = translations[val]
        accuracy = 1
    else:
        for key in translations:
            sim = similarity(val, key)
            if sim > accuracy and sim >= 0:
                out_val = key
                accuracy = sim

    return TranslationResult(in_val=val, out_val=out_val, accuracy=accuracy)


# Load quiz JSON
with open("output/bb_quiz_capture.json", "r") as f:
    quiz = json.load(f)

#translation_set: {str, str}
# Load manual json.
with open("output/manual.json", "r") as f:
    manual = json.load(f)
    for section in manual:
        print(f"loading {section["name"]} section.")
        translations.update(section["translations"])

question_count = 0
for question in quiz:
    question_count += 1
    question_accuracy = search_korean(question["question"])
    output_string = F"question {question_count}: {question_accuracy.in_val} "
    if question_accuracy.accuracy >= 1:
        output_string += "was 100% accurate. Moving to next string"
    elif question_accuracy.accuracy >= .7:
        output_string += F"was accurate(ish) {question_accuracy.accuracy:.3f}."
    elif question_accuracy.accuracy >= .5:
        output_string += F"was inaccurate {question_accuracy.accuracy:.3f}."
    else:
        output_string += F"was very inaccurate {question_accuracy.accuracy:.3f}."
    print(output_string)
    if question_accuracy.accuracy >= 1:
        continue

    correct_guess = input(f"Answer is possibly: {question_accuracy.out_val}?")

    if correct_guess.lower() != "y":
        print("skipping.")
        continue

    question["question"] = question_accuracy.out_val

with open("output/bb_quiz_capture.json", "w") as f:
    json.dump(quiz, f, indent=4)
