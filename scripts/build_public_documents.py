from pathlib import Path
import shutil
import subprocess

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "tmp" / "pdfs" / "redaction-work"
PUBLIC = ROOT / "public"
CERTIFICATES = ROOT / "Certificates"

DPI = 180
SCALE = DPI / 72


def redact_certificate(source: Path, output: Path, boxes_by_page: dict[int, list[tuple[float, float, float, float]]]):
    prefix = WORK / output.stem
    subprocess.run(
        ["pdftoppm", "-png", "-r", str(DPI), str(source), str(prefix)],
        check=True,
    )
    rendered = sorted(WORK.glob(f"{output.stem}-*.png"))
    if not rendered:
        raise RuntimeError(f"No pages rendered for {source}")

    pages = []
    for page_number, path in enumerate(rendered, start=1):
        image = Image.open(path).convert("RGB")
        draw = ImageDraw.Draw(image)
        for left, top, right, bottom in boxes_by_page.get(page_number, []):
            draw.rectangle(
                (left * SCALE, top * SCALE, right * SCALE, bottom * SCALE),
                fill="white",
            )
        pages.append(image)

    output.parent.mkdir(parents=True, exist_ok=True)
    pages[0].save(
        output,
        "PDF",
        resolution=DPI,
        save_all=True,
        append_images=pages[1:],
        title=output.stem.replace("-web", ""),
        author="Yasser Akanni",
        subject="Privacy-safe public certificate copy",
    )

    for page in pages:
        page.close()


def main():
    if WORK.exists():
        shutil.rmtree(WORK)
    WORK.mkdir(parents=True)

    syntax_box = {1: [(306, 200, 520, 236)]}
    redact_certificate(
        CERTIFICATES / "Yasser_Akanni_Produktdesign & -entwicklung in der IT.pdf",
        PUBLIC / "certificates" / "produktdesign-it-web.pdf",
        syntax_box,
    )
    redact_certificate(
        CERTIFICATES / "02.04.2026_Yasser_Akanni_Einführung Software- und Webentwicklung.pdf",
        PUBLIC / "certificates" / "software-webentwicklung-web.pdf",
        syntax_box,
    )
    redact_certificate(
        CERTIFICATES / "25.06.2026_Yasser_Akanni_Vertiefung_ Frontend Entwicklung.pdf",
        PUBLIC / "certificates" / "frontend-entwicklung-web.pdf",
        syntax_box,
    )
    redact_certificate(
        CERTIFICATES / "Zertifikat_fuer_Seminar_F-78-000-26-294.pdf",
        PUBLIC / "certificates" / "digital-product-designer-ihk-web.pdf",
        {1: [(84, 249, 182, 275)]},
    )

    shutil.copy2(ROOT / "output" / "pdf" / "Yasser-Akanni-CV.pdf", PUBLIC / "Yasser-Akanni-CV.pdf")
    shutil.copy2(ROOT / "output" / "pdf" / "Yasser-Akanni-CV.pdf", PUBLIC / "Yasser-Akanni-CV-English.pdf")

    shutil.rmtree(WORK)


if __name__ == "__main__":
    main()
