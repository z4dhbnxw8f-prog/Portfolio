"""Create a privacy-safe public copy of the JUNIOR WEB DEVELOPER IHK certificate."""
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/yasseradebayoakanni/Desktop/Zertifikat_fuer_Seminar_F-78-000-26-477.pdf')
TARGET = ROOT / 'public' / 'certificates' / 'junior-web-developer-ihk-web.pdf'
DATE_OF_BIRTH = '04.07.1993'

document = fitz.open(SOURCE)
removed = 0
for page in document:
    for line in page.get_text().splitlines():
        if 'geb.' in line.lower() or DATE_OF_BIRTH in line:
            for rect in page.search_for(line):
                page.add_redact_annot(rect + (-2, -2, 2, 2), fill=(1, 1, 1))
                removed += 1
    page.apply_redactions()

if removed != 1:
    raise ValueError(f'Expected one date-of-birth line, found {removed}')

document.set_metadata({
    'title': 'JUNIOR WEB DEVELOPER IHK - public certificate',
    'author': 'Yasser Akanni',
    'subject': 'Privacy-safe public certificate',
})
TARGET.parent.mkdir(parents=True, exist_ok=True)
document.save(TARGET, garbage=4, deflate=True)
document.close()

with fitz.open(TARGET) as check:
    assert all(DATE_OF_BIRTH not in page.get_text() and 'geb.' not in page.get_text().lower() for page in check)

print(TARGET)
