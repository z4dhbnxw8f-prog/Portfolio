from pathlib import Path

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

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Yasser-Akanni-CV.pdf"
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
            subject="Junior Frontend and Full-Stack Web Developer CV",
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
    page_text = f"PAGE {doc.page} / 2"
    canvas.drawString(PAGE_W - 20 * mm - stringWidth(page_text, "Helvetica", 7.5), 9 * mm, page_text)
    canvas.restoreState()


story = []
story += [
    para("Yasser Akanni", name_style),
    para("Junior Frontend / Full-Stack Web Developer · UI/UX Designer", title_style),
    para(
        "Essen, Germany &nbsp;&nbsp;|&nbsp;&nbsp; +49 176 12854755 &nbsp;&nbsp;|&nbsp;&nbsp; "
        "<link href='mailto:ressay93@outlook.com' color='#565D58'>ressay93@outlook.com</link><br/>"
        "<link href='https://github.com/z4dhbnxw8f-prog' color='#565D58'>github.com/z4dhbnxw8f-prog</link> &nbsp;&nbsp;|&nbsp;&nbsp; "
        "<link href='https://linkedin.com/in/YasserAkanni' color='#565D58'>linkedin.com/in/YasserAkanni</link>",
        contact_style,
    ),
    Spacer(1, 5),
]

story += section_title("Professional Profile")
story.append(
    para(
        "Junior Frontend / Full-Stack Web Developer and UI/UX Designer with practical project experience building responsive web applications from concept and interface design through development and deployment. Experience with React, Next.js, TypeScript, JavaScript, Prisma, PostgreSQL, Firebase and MongoDB, including authentication, CRUD, API integration and database-backed interfaces. Currently completing a project-based IT qualification at Syntax Institut. Brings reliability, organization and process awareness from an earlier career in operations, procurement and logistics.",
        body_style,
    )
)

story += section_title("Technical Skills")
skill_lines = [
    ("Frontend", "React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Flexbox, CSS Grid, Responsive Design, Tailwind CSS, Vite"),
    ("Backend", "Node.js, Express, REST APIs, Next.js Server Actions, API Route Handlers"),
    ("Databases", "PostgreSQL, Prisma ORM, Firebase Firestore, MongoDB, MongoDB Atlas"),
    ("Security", "Firebase Authentication, session-based authentication, bcrypt, HTTP-only cookies, protected routes, authorization, ownership checks, Firestore security rules"),
    ("UI/UX", "Figma, wireframes, prototypes, user flows, personas, empathy maps, sitemaps, information architecture, usability, responsive interface design"),
    ("Tools & practice", "Git, GitHub, VS Code, npm, Docker, Vercel, ngrok, CRUD, API integration, debugging, database design, Scrum, technical documentation"),
]
for label, items in skill_lines:
    story.append(para(f"<b>{label}:</b> {items}", small_style))

story += section_title("Selected Projects")
story.append(
    KeepTogether(
        [
            entry_header("Penee", "FLAGSHIP PROJECT", "Multi-account, multi-currency personal finance application"),
            bullet("Built with Next.js, React, TypeScript, PostgreSQL, Prisma, Server Actions, API route handlers and Vercel."),
            bullet("Implemented registration, login, logout, sessions, ownership checks, accounts, transactions, income, expenses, budgets, currencies, exchange rates, a dashboard, ledger and statements."),
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
story.append(PageBreak())
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

story += section_title("Education and IT Qualification")
story.append(entry_header("Qualifizierung zur IT-Fachkraft", "15.09.2025 - 14.09.2026", "Syntax Institut · 2,300 Unterrichtseinheiten"))
story.append(
    para(
        "Structured, project-based training covering product and UI/UX design, software and web development, frontend specialization, backend fundamentals, databases, authentication, APIs, Git/GitHub, deployment, agile/Scrum workflows, debugging and technical documentation.",
        body_style,
    )
)
for module in [
    "Produktdesign & -entwicklung in der IT - 700 UE",
    "Einführung Software- und Webentwicklung - 600 UE",
    "Vertiefung Frontend Entwicklung - 500 UE",
    "Spezialisierung & Arbeitsmarktvorbereitung - 500 UE",
]:
    story.append(bullet(module))

story += section_title("Professional Experience")
story.append(
    KeepTogether(
        [
            entry_header("Preymesser", "2023 - 2025", "Logistics operations"),
            para("Loading and offloading, warehouse and transport-related tasks, and operational support. Worked reliably within practical processes and team-based operations.", body_style),
        ]
    )
)
story.append(Spacer(1, 4))
story.append(
    KeepTogether(
        [
            entry_header("Haeger & Schmidt", "2022 - 2023", "Industrial operations"),
            para("Blade cutting, truck loading, crane operations, cleanup, and ship loading and offloading. Contributed to safe, coordinated work under operational pressure.", body_style),
        ]
    )
)
story.append(Spacer(1, 4))
story.append(
    KeepTogether(
        [
            entry_header("SIB Enterprises", "2007 - 2021", "Operations, procurement and supervision"),
            para("Tire loading, import and export activities, purchasing, supplier-related coordination, company supervision and operational organization. Developed a strong foundation in responsibility, coordination, practical problem solving and process awareness.", body_style),
        ]
    )
)

story += section_title("Languages")
story.append(para("<b>English</b> - Fluent &nbsp;&nbsp;&nbsp; <b>French</b> - Fluent &nbsp;&nbsp;&nbsp; <b>German</b> - Currently developing", body_style))

story += section_title("Professional Focus")
story.append(
    para(
        "Primary targets: Junior Frontend Developer, Junior Web Developer, Junior React Developer and Junior Next.js Developer. Also open to suitable junior full-stack, frontend/UI, UI/UX development, trainee and internship opportunities in Essen, the Ruhrgebiet and across NRW.",
        body_style,
    )
)

doc = CVDocTemplate(str(OUTPUT))
doc.build(story)
print(OUTPUT)
