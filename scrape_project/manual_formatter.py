import json
from dataclasses import dataclass, asdict

seperator = "|"
header_marker = "*"

issue = False


@dataclass
class TerminologySection:
    name: str
    translations: dict[str, str]

def write_line(file, line: str):
    if line.find("\n") == -1:
        line += "\n"
    file.write(line)


def join_words(words: list[str]) -> str:
    return seperator.join(words)


def check_and_clean() -> bool:
    global issue
    with open("content/manual_text.txt") as f_in:
        with open("content/converted.txt", "w") as f_out:
            f_in_lines = f_in.readlines()
            print("pre check")
            for line in f_in_lines:
                if (line.find(seperator) & line.find(header_marker)) == -1:
                    issue = True
                    print(f"no seperator or header marker for: {line}")
            print("pre check - complete")
            if issue:
                print("issue found - exiting")
                return False
            print("clean up")
            for line in f_in_lines:
                words = line.split(" ")
                words_count = len(words)
                if (words_count == 1
                        or line.find(header_marker) >= 0
                        or line.isupper()):
                    write_line(f_out, line)
                    continue
                if line.find(seperator):
                    cleaned_words = (section.strip() for section in line.split(seperator))
                    write_line(f_out, join_words(list(cleaned_words)))
                    continue
                if words_count == 2:
                    write_line(f_out, join_words(words))
                    continue
                else:
                    write_line(f_out, line)
            print("clean up - complete")
    return True


def convert_file():
    with open("content/converted.txt", "r") as f_in:
        f_in_lines = f_in.readlines()
        print("starting conversion")
        if not header_marker in f_in_lines[0]:
            print("first line wasn't a header")
            return
        sections: list[TerminologySection] = []
        section: TerminologySection
        for line in f_in_lines:
            line = line.strip()
            # is header?
            if header_marker in line:
                if line.find(header_marker) != 0:
                    print("header marker was not first character")
                    return
                header = line[1:]
                words = header.split(" ")
                header = " ".join((word.capitalize() for word in words))
                section = TerminologySection(name=header.strip().capitalize(), translations={})
                sections.append(section)
                continue
            # if not, then it's a normal line.
            translation = line.split(seperator)
            if len(translation) != 2:
                print(f"too many {seperator} characters in line")
                return

            section.translations[translation[0]] = translation[1]

        with open("output/manual.json", "w") as f:
            json.dump([asdict(section) for section in sections], f, indent=4)
        print("conversion finished")


def main():
    if not check_and_clean():
        print("error")
        return
    convert_file()


main()
