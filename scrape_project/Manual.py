from dataclasses import dataclass
from common import similarity, load_json_file


class Manual:
    translations = {}

    @dataclass
    class TranslationResult:
        in_val: str
        out_val: str
        accuracy: int

    def __init__(self):
        self.manual = load_json_file("output/manual.json", "r")
        for section in self.manual:
            print(f"loading {section["name"]} section.")
            self.translations.update(section["translations"])

    @staticmethod
    def find_best_match_in_list(val: str, values: list[str]) -> TranslationResult:
        accuracy = -1
        out_val = None
        for value in values:
            sim = similarity(val.lower(), value.lower())
            if sim > accuracy and sim > 0:
                out_val = value
                accuracy = sim

        return Manual.TranslationResult(in_val=val, out_val=out_val, accuracy=accuracy)

    # Search the key section of the translations
    def search_korean(self, val: str):
        if val in self.translations:
            out_val = self.translations[val]
            accuracy = 1
            return Manual.TranslationResult(in_val=val, out_val=out_val, accuracy=accuracy)
        return Manual.find_best_match_in_list(val, list(self.translations))

    # Search the values section of the translations
    def search_english(self, val: str) -> TranslationResult:
        values = self.translations.values()

        if val in values:
            out_val = val
            accuracy = 1
            return Manual.TranslationResult(in_val=val, out_val=out_val, accuracy=accuracy)

        return Manual.find_best_match_in_list(val, list(values))

    def get_translation(self, key) -> str:
        if key in self.translations:
            return self.translations[key]
        return ""
