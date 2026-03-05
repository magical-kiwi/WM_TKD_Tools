from Manual import Manual
from common import load_json_file, write_json_file


def compare_korean():
    # Load quiz JSON
    quiz = load_json_file("output/bb_quiz_capture.json", "r")

    # Load manual
    manual = Manual()

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


compare_korean()
