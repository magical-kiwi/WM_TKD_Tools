from Manual import Manual
from common import load_json_file, write_json_file


def validate_questions(quiz, manual: Manual):
    question_count = 0
    for question in quiz:
        question_count += 1
        question_accuracy = manual.search_korean(question["question"])
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

    write_json_file("output/bb_quiz_capture.json", quiz, indent=4)


def get_correct_answer(question) -> str:
    return question[question["correct"]]


def verify_answer(manual: Manual, fix_up: {str, str}, question:str, val:str):
    search_result = manual.search_english(val)
    if search_result.accuracy >= 1:
        return
    if search_result.accuracy < 1:
        question_result = manual.search_korean(question)
        translation = manual.get_translation(question_result.out_val)
        correct_guess = ""
        if translation is None:
            correct_guess = input(f"Incorrect answer for {question}:\n"
                                  f"Was: {val}.\n"
                                  f"should be: {search_result.out_val}?\n")
        else:
            correct_guess = input(f"Incorrect answer for {question}:\n"
                                  f"Was: {val}.\n"
                                  f"should be: {question_result.out_val}?\n")
        if correct_guess.lower() != "y":
            search_result.out_val = input("What should it be?")
            if search_result.out_val == "":
                print(f"skipping {val}")
                return

        fix_up[val] = search_result.out_val


def validate_answers(quiz, manual: Manual):
    question_count = 0
    for question in quiz:
        # handle question correctness
        question_count += 1
        question_text = question["question"]
        question_accuracy = manual.search_korean(question_text)
        if question_accuracy.accuracy < 1:
            correct_guess = input(f"Incorrect question: {question_text}.\n"
                                  f"should be: {question_accuracy.out_val}?\n")
            if correct_guess.lower() != "y":
                print("skipping.")
                continue
            question_text = question_accuracy.out_val
        print("verifying answer details")
        # fix up quiz answers
        fix_up_dict = {}
        verify_answer(manual, fix_up_dict, question_text, question[question["correct"]])

        print("checking quiz has correct answer")
        # handle answer correctness
        answer_text = get_correct_answer(question)
        answer_accuracy = manual.search_english(answer_text)
        if answer_accuracy.accuracy < 1:
            if answer_text in fix_up_dict:
                print("fixing up answer from dict")
                answer_text = fix_up_dict[answer_text]
            else:
                correct_guess = input(f"Incorrect answer for {question_text}:"
                                      f"Was: {answer_text}.\n"
                                      f"should be: {answer_accuracy.out_val}?\n")
                if correct_guess.lower() != "y":
                    print("skipping.")
                    continue
                answer_text = answer_accuracy.out_val

        translated_answer = manual.get_translation(question_text)
        if translated_answer.lower().strip() != answer_text.lower().strip():
            print(f"{question_count} possibly incorrect quiz set up.\n"
                  f"{question_text} should translate to {translated_answer}.\n"
                  f"the quiz records an answer of {answer_text}")
        else:
            print(f"{question_count} question is correct")


print("Loading files")
# Load quiz JSON
quiz_json = load_json_file("output/bb_quiz_capture.json", "r")

# Load manual
loaded_manual = Manual()
# print("comparing questions")
# validate_questions(quiz_json, loaded_manual)
print("comparing answer")
validate_answers(quiz_json, loaded_manual)

