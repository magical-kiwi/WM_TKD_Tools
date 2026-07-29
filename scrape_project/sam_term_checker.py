from Manual import Manual
from common import header_marker

def sam_term_conversion():
    line_count = 0

    # Load quiz JSON
    new_term: list[str] = []
    with open("content/sam_term_orig.txt", "r") as f:
        term = f.readlines()

    # Load manual
    manual = Manual()

    for line in term:
        line_count += 1
        if line.find(header_marker) == 0:
            print(f"line ({line_count}) was a header.")
            new_term.append(line[1:])
            continue
        striped_line = line.strip()
        if striped_line == "":
            print(f"line ({line_count}) was empty.")
            new_term.append(line)
            continue

        line_accuracy = manual.search_korean(striped_line)
        output_string = F"question {line_count}: {line_accuracy.in_val} "
        if line_accuracy.accuracy >= 1:
            output_string += "was 100% accurate. Moving to next string"
        elif line_accuracy.accuracy >= .7:
            output_string += F"was accurate(ish) {line_accuracy.accuracy:.3f}."
        elif line_accuracy.accuracy >= .5:
            output_string += F"was inaccurate {line_accuracy.accuracy:.3f}."
        else:
            output_string += F"was very inaccurate {line_accuracy.accuracy:.3f}."
        print(output_string)
        if line_accuracy.accuracy >= 1:
            new_term.append(line)
            continue

        correct_guess = input(f"Answer is possibly: {line_accuracy.out_val}?")

        if correct_guess.lower() != "y":
            print("skipping.")
            new_term.append(line)
            continue

        new_term.append(line_accuracy.out_val+"\n")

    with open("output/sam_term.txt", "w") as f:
        f.writelines(new_term)


def sam_term_trans_conversion():
    line_count = 0

    # Load data to test
    new_term: list[str] = []
    with open("content/sam_term_trans_orig.txt", "r") as f:
        term = f.readlines()
    
    # Load manual
    manual = Manual()

    for line in term:
        line_count += 1
        if line.find(header_marker) == 0:
            print(f"line ({line_count}) was a header.")
            new_term.append(line[1:])
            continue
        striped_line = line.strip()
        if striped_line == "":
            print(f"line ({line_count}) was empty.")
            new_term.append(line)
            continue

        line_accuracy = manual.search_english(striped_line)
        output_string = F"question {line_count}: {line_accuracy.in_val} "
        if line_accuracy.accuracy >= 1:
            output_string += "was 100% accurate. Moving to next string"
        elif line_accuracy.accuracy >= .7:
            output_string += F"was accurate(ish) {line_accuracy.accuracy:.3f}."
        elif line_accuracy.accuracy >= .5:
            output_string += F"was inaccurate {line_accuracy.accuracy:.3f}."
        else:
            output_string += F"was very inaccurate {line_accuracy.accuracy:.3f}."
        print(output_string)
        if line_accuracy.accuracy >= 1:
            new_term.append(line)
            continue

        correct_guess = input(f"Answer is possibly: {line_accuracy.out_val}?")

        if correct_guess.lower() != "y":
            print("skipping.")
            new_term.append(line)
            continue

        new_term.append(line_accuracy.out_val+"\n")

    with open("output/sam_term_trans.txt", "w") as f:
        f.writelines(new_term)


# sam_term_conversion()
sam_term_trans_conversion()
