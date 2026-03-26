from __future__ import annotations

import json
import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_TEX = Path(
    "/Users/andreasloeffler/Documents/Universitaet/Lehre/Lehrmaterialien/BA Investition/github/Uebungsaufgaben.tex"
)
TARGET_JSON = REPO_ROOT / "docs" / "data" / "exercise_solutions.json"

SECTION_TO_ID = {
    "Set 1": "set1",
    "Set 2": "set2",
    "Set 3": "set3",
    "Set 4": "set4",
    "Zusätzliches Set 1": "set1-extra",
    "Zusätzliches Set 2": "set2-extra",
    "Zusätzliches Set 3": "set3-extra",
    "Zusätzliches Set 4": "set4-extra",
}


def subsection_blocks(text: str) -> list[tuple[str, str]]:
    matches = list(re.finditer(r"\\subsection\{([^}]+)\}", text))
    blocks: list[tuple[str, str]] = []

    for index, match in enumerate(matches):
        title = match.group(1).strip()
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        blocks.append((title, text[start:end]))

    return blocks


def extract_solution_items(block: str) -> dict[str, str]:
    lines = block.splitlines()
    depth = 0
    current_key: str | None = None
    current_lines: list[str] = []
    items: dict[str, str] = {}

    def flush() -> None:
        nonlocal current_key, current_lines
        if current_key is None:
            return
        cleaned = clean_solution_text("\n".join(current_lines))
        if cleaned:
            items[current_key] = cleaned
        current_key = None
        current_lines = []

    for line in lines:
        depth += line.count(r"\begin{description}")

        item_match = re.match(r"\s*\\item\[Aufgabe ([^\]]+)\]\s*(.*)", line)
        if item_match and depth == 1:
            flush()
            current_key = f"Aufgabe {item_match.group(1).strip()}"
            remainder = item_match.group(2).rstrip()
            if remainder:
                current_lines.append(remainder)
        elif current_key is not None:
            current_lines.append(line.rstrip())

        depth -= line.count(r"\end{description}")
        if depth < 0:
            depth = 0

    flush()
    return items


def clean_solution_text(text: str) -> str:
    substitutions = {
        r"\euro{}": r"\text{€}",
        r"\%": r"\%",
        r"\,": " ",
        r"\;": " ",
        r"\:": " ",
        r"\quad": " ",
        r"\qquad": " ",
        r"\newline": "\n",
        r"\medskip": "\n",
        r"\centering": "\n",
        r"\gray": "",
        r"\black": "",
        r"\Stt": "",
        r"\I_": "I_",
        r"\NPV": r"\mathrm{NPV}",
        "~": " ",
        "\\\\": "\n",
    }

    text = re.sub(r"(?<!\\)%.*", "", text)
    text = re.sub(r"\\(newpage|clearpage)\b", "", text)
    text = re.sub(r"\\vspace\*?\{[^}]*\}", "", text)
    text = re.sub(r"\\vspace-?[0-9.,]+[a-zA-Z]+", "", text)
    text = re.sub(r"\\label\{[^}]+\}", "", text)
    text = re.sub(r"\\ref\{([^}]+)\}", r"[\1]", text)
    text = re.sub(r"\\href\{([^}]+)\}\{([^}]+)\}", r"\2 (\1)", text)
    text = re.sub(r"\\includegraphics(?:\[[^\]]*\])?\s*\{([^}]+)\}", r"[Abbildung: \1]", text)
    text = re.sub(r"\\caption\{[^}]+\}", "", text)
    text = re.sub(r"\\begin\{figure\}(?:\[[^\]]*\])?", "", text)
    text = re.sub(r"\\end\{figure\}", "", text)
    text = re.sub(r"\\begin\{tabular\}\{[^}]*\}", "", text)
    text = re.sub(r"\\end\{tabular\}", "", text)
    text = re.sub(r"\\begin\{[^}]+\}", "", text)
    text = re.sub(r"\\end\{[^}]+\}", "", text)
    text = re.sub(r"\\item\[([^\]]+)\]", r"\n\1 ", text)
    text = re.sub(r"\\(textit|emph|textbf)\{", "{", text)
    text = re.sub(r"^\s*\[[a-z]{1,3}\]\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[clr|]+\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\\hline\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\{\}\s*$", "", text, flags=re.MULTILINE)

    for old, new in substitutions.items():
        text = text.replace(old, new)

    text = text.replace("&", "")
    text = re.sub(r"\\\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    return text.strip()


def main() -> None:
    source_tex = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE_TEX
    tex = source_tex.read_text(encoding="utf-8")
    solution_start = tex.index(r"\section{Musterlösungen Übungsaufgaben}")
    solution_text = tex[solution_start:]

    data: dict[str, dict[str, str]] = {}
    for title, block in subsection_blocks(solution_text):
        section_id = SECTION_TO_ID.get(title)
        if not section_id:
            continue
        data[section_id] = extract_solution_items(block)

    TARGET_JSON.parent.mkdir(parents=True, exist_ok=True)
    TARGET_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
