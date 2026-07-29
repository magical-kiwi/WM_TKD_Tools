from difflib import SequenceMatcher
import json

seperator = "|"
header_marker = "*"


def text_normalise(s: str) -> str:
    return " ".join(s.split()).strip()


def write_line(file, line: str):
    if line.find("\n") == -1:
        line += "\n"
    file.write(line)


def similarity(a: str, b: str) -> float:
    a_norm = text_normalise(a)
    b_norm = text_normalise(b)
    return SequenceMatcher(None, a_norm, b_norm).ratio()


def load_json_file(path: str, mode: str):
    with open(path, mode) as f:
        return json.load(f)


def write_json_file(path: str, data, indent: int):
    with open(path, "w") as f:
        json.dump(data, f, indent=indent)
