from pathlib import Path
import json
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Yasser-Akanni-CV.pdf"
PROFILE_IMAGE = next(
    (
        ROOT / "public" / filename
        for filename in (
            "yasser-akanni-profile.jpg",
            "yasser-akanni-profile.jpeg",
            "yasser-akanni-profile.png",
        )
        if (ROOT / "public" / filename).exists()
    ),
    None,
)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4
INK = colors.HexColor("#151816")
MUTED = colors.HexColor("#565D58")
GREEN = colors.HexColor("#173F35")
PALE = colors.HexColor("#E8ECE8")
LIME = colors.HexColor("#C8F55A")


def para(text, style):
    return Paragraph(text, style)


styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    "Name",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=28,
    leading=31,
    textColor=INK,
    spaceAfter=4,
)
title_style = ParagraphStyle(
    "ProfessionalTitle",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=10.2,
    leading=13,
    textColor=GREEN,
    spaceAfter=9,
)
contact_style = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=8.4,
    leading=12,
    textColor=MUTED,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=10,
    leading=12,
    textColor=INK,
    spaceBefore=10,
    spaceAfter=6,
    keepWithNext=True,
)
body_style = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.15,
    leading=13.2,
    textColor=INK,
    spaceAfter=4,
)
small_style = ParagraphStyle(
    "Small",
    parent=body_style,
    fontSize=8.55,
    leading=12.1,
    textColor=MUTED,
)
entry_title_style = ParagraphStyle(
    "EntryTitle",
    parent=body_style,
    fontName="Helvetica-Bold",
    fontSize=9.5,
    leading=12,
    spaceAfter=1,
    keepWithNext=True,
)
date_style = ParagraphStyle(
    "Date",
    parent=small_style,
    fontName="Helvetica-Bold",
    alignment=TA_RIGHT,
    textColor=MUTED,
)
bullet_style = ParagraphStyle(
    "Bullet",
    parent=body_style,
    leftIndent=9,
    firstLineIndent=-7,
    bulletIndent=0,
    spaceAfter=2.2,
)
tag_style = ParagraphStyle(
    "Tag",
    parent=small_style,
    fontName="Helvetica-Bold",
    textColor=GREEN,
    spaceAfter=2,
)


def section_title(text):
    return [para(text.upper(), section_style)]


def entry_header(title, date, subtitle=None):
    left = title if subtitle is None else f"{title}<br/><font color='#565D58' size='8.2'>{subtitle}</font>"
    table = Table(
        [[para(left, entry_title_style), para(date, date_style)]],
        colWidths=[132 * mm, 38 * mm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )
    return table


def bullet(text):
    return para(f"• {text}", bullet_style)


def profile_image():
    if PROFILE_IMAGE is None:
        return Spacer(1, 1)
    image = Image(str(PROFILE_IMAGE), width=27 * mm, height=34 * mm)
    image.hAlign = "RIGHT"
    return image


class CVDocTemplate(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=20 * mm,
            rightMargin=20 * mm,
            topMargin=17 * mm,
            bottomMargin=17 * mm,
            title="Yasser Akanni CV",
            author="Yasser Akanni",
            subject="Junior Frontend Developer CV",
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates(PageTemplate(id="cv", frames=[frame], onPage=draw_page))


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.rect(0, PAGE_H - 5 * mm, PAGE_W, 5 * mm, stroke=0, fill=1)
    canvas.setFillColor(LIME)
    canvas.rect(0, PAGE_H - 5 * mm, 35 * mm, 5 * mm, stroke=0, fill=1)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 9 * mm, "YASSER AKANNI")
    page_text = f"PAGE {doc.page} / 3"
    canvas.drawString(PAGE_W - 20 * mm - stringWidth(page_text, "Helvetica", 7.5), 9 * mm, page_text)
    canvas.restoreState()


story = []
story += [
    Table(
        [[
            [
                para("Yasser Akanni", name_style),
                para("Qualified Junior Frontend Developer · React · Next.js · TypeScript", title_style),
                para(
                    "Essen, Germany · NRW &nbsp;&nbsp;|&nbsp;&nbsp; +49 176 12854755 &nbsp;&nbsp;|&nbsp;&nbsp; "
                    "<link href='mailto:ressay93@outlook.com' color='#565D58'>ressay93@outlook.com</link><br/>"
                    "<link href='https://github.com/z4dhbnxw8f-prog' color='#565D58'>github.com/z4dhbnxw8f-prog</link> &nbsp;&nbsp;|&nbsp;&nbsp; "
                    "<link href='https://www.linkedin.com/in/yasser-akanni-4b15333b3/' color='#565D58'>linkedin.com/in/yasser-akanni-4b15333b3/</link>",
                    contact_style,
                ),
            ],
            profile_image(),
        ]],
        colWidths=[140 * mm, 30 * mm],
    ),
    Spacer(1, 5),
]

story += section_title("Professional Profile")
story.append(
    para(
        "Junior Frontend Developer focused on React, Next.js and TypeScript, with UI/UX skills and a practical full-stack foundation. Builds responsive web applications from interface design through development and deployment, with project experience in authentication, CRUD, API integration and database-backed interfaces. Successfully completed the 2,300-unit, 46-week web-development qualification at Syntax Institut in September 2026. Available immediately for junior frontend, React, Next.js and web-development opportunities. Brings reliability, organization and process awareness from an earlier career in purchasing management, international procurement and logistics operations.",
        body_style,
    )
)

story += section_title("Technical Skills")
skill_lines = [(g["title"]["en"], ", ".join(g["skills"]["en"])) for g in json.loads((ROOT / "scripts/cv_skills.json").read_text())]
for label, items in skill_lines:
    story.append(para(f"<b>{label}:</b> {items}", small_style))

story.append(PageBreak())
story += section_title("Selected Projects")
story.append(
    KeepTogether(
        [
            entry_header("Penee", "FINAL PROJECT", "Final Course Project · Full-Stack Expense Tracker"),
            bullet("Built with Next.js, React, TypeScript, PostgreSQL, Prisma, Server Actions, API route handlers and Vercel."),
            bullet("Implemented secure sessions, bcrypt password hashing, protected routes and user-owned accounts, income and expense transactions, budgets and multiple currencies. Responsive web app deployed on Vercel; Android version built with Capacitor."),
            bullet("Used Decimal for money and correction transactions for completed history; preserved original transaction currency and conversion information when recalculating current totals."),
            para("<link href='https://xpense-trvcker.vercel.app' color='#173F35'><b>xpense-trvcker.vercel.app</b></link>", small_style),
        ]
    )
)
story.append(Spacer(1, 3))
story.append(
    KeepTogether(
        [
            entry_header("ItemVault", "LIVE", "Private personal inventory application"),
            bullet("Developed with React, Vite, Firebase Authentication and Firestore for responsive desktop, tablet and mobile use."),
            bullet("Added private inventories, item creation, categories, locations, status, search, filtering, real-time listeners, protected routes and Firestore security rules."),
            para("<link href='https://item-vault.vercel.app' color='#173F35'><b>item-vault.vercel.app</b></link>", small_style),
        ]
    )
)
story.append(Spacer(1, 3))
story += section_title("Selected Projects Continued")
story.append(
    KeepTogether(
        [
            entry_header("Cosmic Styles LLC", "LIVE", "Real-world barbershop business web application"),
            bullet("Designed and built a responsive HTML, CSS and JavaScript interface for services, pricing, business information, gallery content and appointment requests."),
            bullet("Implemented a service-to-date/time-to-customer-details booking flow with a prefilled WhatsApp handoff and an optional Vercel serverless email-notification path."),
            para("<link href='https://cosmic-styles-llc.vercel.app' color='#173F35'><b>cosmic-styles-llc.vercel.app</b></link>", small_style),
        ]
    )
)
story.append(Spacer(1, 3))

story.append(PageBreak())
story += section_title("Education and IT Qualification")
story.append(entry_header("Qualifizierung zur IT-Fachkraft", "09/2025 - 09/2026", "Syntax Institut · Successfully completed · 2,300 teaching units · 46 weeks"))
story.append(
    para(
        "Successfully completed on 11 September 2026 under §81 ff. SGB III. Project-based training covering product and UI/UX design, software and web development, frontend specialization, backend fundamentals, databases, authentication, APIs, Git/GitHub, deployment, agile/Scrum workflows, debugging and technical documentation.",
        body_style,
    )
)
for module in [
    "Produktdesign & -entwicklung in der IT - 09.01.2026 - 700 units",
    "Einführung Software- und Webentwicklung - 02.04.2026 - 600 units",
    "Vertiefung: Frontend Entwicklung - 26.06.2026 - 500 units",
    "Spezialisierung & Arbeitsmarktvorbereitung - 11.09.2026 - 500 units",
]:
    story.append(bullet(module))

story += section_title("Professional Experience")
story.append(
    KeepTogether(
        [
            entry_header("Preymesser", "2023 - 2025", "Logistics Operations Associate"),
            para("Supported warehouse and transport operations through loading, offloading and material handling. Worked closely with operational teams to maintain safe, reliable workflows and consistent day-to-day execution.", body_style),
        ]
    )
)
story.append(Spacer(1, 4))
story.append(
    KeepTogether(
        [
            entry_header("Haeger & Schmidt", "2022 - 2023", "Industrial Logistics Operator"),
            para("Performed truck and vessel loading and offloading, crane-assisted material handling, blade cutting and work-area maintenance within a safety-focused industrial environment.", body_style),
        ]
    )
)
story.append(Spacer(1, 4))
story.append(
    KeepTogether(
        [
            entry_header("SIB Enterprises", "2007 - 2021", "Purchasing Manager - International Procurement & SAP"),
            para("Managed purchasing and procurement operations, including international travel for supplier sourcing and business coordination. Used SAP to manage purchasing workflows, orders, supplier records and procurement administration, while coordinating import and export activities. Developed strong organization, responsibility, negotiation and cross-cultural communication skills.", body_style),
        ]
    )
)

story += section_title("Qualifications and Certificates")
story.append(
    KeepTogether(
        [
            entry_header("Qualifizierung zur IT-Fachkraft", "COMPLETED", "Syntax Institut · Final certificate · 11.09.2026"),
            para(
                "Final certificate: Web Development - Qualification for IT and AI-Supported Professions. Digital Product Designer IHK (issued 15.01.2026). Junior WEB-Developer (IHK) and Web Development Specialist (IHK): successfully completed - official certificates pending.",
                small_style,
            ),
        ]
    )
)

story += section_title("Languages")
story.append(para("<b>English</b> - Fluent &nbsp;&nbsp;&nbsp; <b>French</b> - Fluent &nbsp;&nbsp;&nbsp; <b>German</b> - B1 (CEFR)", body_style))

doc = CVDocTemplate(str(OUTPUT))
doc.build(story)
print(OUTPUT)

shutil.copy2(OUTPUT, ROOT / "public/Yasser-Akanni-CV-English.pdf")
shutil.copy2(OUTPUT, ROOT / "public/Yasser-Akanni-CV.pdf")
