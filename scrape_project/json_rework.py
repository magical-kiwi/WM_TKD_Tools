import json

# Load your existing JSON
with open("bb_quiz_capture_bk.json", "r") as f:
    data = json.load(f)

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
with open("bb_quiz_capture.json", "w") as f:
    json.dump(reordered, f, indent=4)