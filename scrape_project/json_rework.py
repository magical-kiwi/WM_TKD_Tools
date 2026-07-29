import json
from common import load_json_file, write_json_file

# Load your existing JSON

data = load_json_file("bb_quiz_capture_bk.json", "r")

# Reorder keys
reordered = []
for item in data:
    new_item = {
        "question": item["question"],
        "a": item["a"],
        "b": item["b"],
        "c": item["c"],
        "correct": item["correct"],
    }
    reordered.append(new_item)

# Write it back out
write_json_file("output/bb_quiz_capture.json", reordered, indent=4)
