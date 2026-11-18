"""Create a privacy-safe public copy of the Web Development Specialist IHK certificate."""
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path.home() / 'Desktop' / 'Zertifikat_fuer_Seminar_F-78-000-26-543.pdf'
TARGET = ROOT / 'public' / 'certificates' / 'web-development-specialist-ihk-web.pdf'
BIRTH_DATE = '07.04.1993'

document = fitz.open(SOURCE)
removed = 0
for page in document:
    for line in page.get_text().splitlines():
        if 'geb.' in line.lower() or BIRTH_DATE in line:
            for rect in page.search_for(line):
                page.add_redact_annot(rect + (-2, -2, 2, 2), fill=(1, 1, 1))
                removed += 1
    page.apply_redactions()

if removed != 1:
    raise ValueError(f'Expected one date-of-birth line, found {removed}')

document.set_metadata({
    'title': 'Web Development Specialist IHK - public certificate',
    'author': 'Yasser Akanni',
    'subject': 'Privacy-safe public certificate',
})
TARGET.parent.mkdir(parents=True, exist_ok=True)
document.save(TARGET, garbage=4, deflate=True)
document.close()

with fitz.open(TARGET) as check:
    text = '\n'.join(page.get_text() for page in check)
    assert BIRTH_DATE not in text and 'geb.' not in text.lower()

print(TARGET)