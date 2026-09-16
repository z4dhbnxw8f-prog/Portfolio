"""Create public copies of supplied Syntax certificates; remove birth-date text permanently.
Usage: python scripts/build_public_documents.py [directory containing WEB2509 PDFs]
The already-issued public IHK certificate is preserved.
"""
from pathlib import Path
import sys
import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / 'Downloads'
FILES = {
    'M1': 'produktdesign-it',
    'M2': 'software-webentwicklung',
    'M3': 'frontend-entwicklung',
    'M4': 'spezialisierung-arbeitsmarktvorbereitung',
    'Zertifikat': 'webentwicklung-abschluss',
}

def main():
    output = ROOT / 'public/certificates'
    output.mkdir(parents=True, exist_ok=True)
    for key, slug in FILES.items():
        document = fitz.open(SOURCE / f'WEB2509_{key}_Yasser-Akanni.pdf')
        removed = 0
        for page in document:
            for line in page.get_text().splitlines():
                if 'geboren' in line.lower():
                    for rect in page.search_for(line):
                        page.add_redact_annot(rect + (-2, -2, 2, 2), fill=(1, 1, 1))
                        removed += 1
            page.apply_redactions()
        if removed != 1:
            raise ValueError(f'Expected one birth-date line in {key}; found {removed}')
        document.set_metadata({'title': f'{slug} - public certificate', 'author': 'Yasser Akanni', 'subject': 'Privacy-safe public copy'})
        target = output / f'{slug}-web.pdf'
        document.save(target, garbage=4, deflate=True)
        document.close()
        with fitz.open(target) as check:
            assert all('geboren' not in page.get_text().lower() and '04.07.1993' not in page.get_text() for page in check)
        print(target)

if __name__ == '__main__':
    main()
