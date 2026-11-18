"""Build ATS-friendly two-page English CVs for frontend and full-stack roles."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageBreak, PageTemplate, Paragraph, Spacer

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#202833")
MUTED = colors.HexColor("#525E6D")
NAVY = colors.HexColor("#17365D")
LINK = colors.HexColor("#17365D")
W, H = A4

ss = getSampleStyleSheet()
name = ParagraphStyle("Name", parent=ss["Title"], fontName="Helvetica-Bold", fontSize=22, leading=25, textColor=INK, alignment=TA_LEFT, spaceAfter=2)
headline = ParagraphStyle("Headline", parent=ss["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=12, textColor=NAVY, spaceAfter=5)
contact = ParagraphStyle("Contact", parent=ss["Normal"], fontName="Helvetica", fontSize=8, leading=10.2, textColor=MUTED, spaceAfter=1)
section = ParagraphStyle("Section", parent=ss["Heading2"], fontName="Helvetica-Bold", fontSize=9.4, leading=11, textColor=NAVY, spaceBefore=6.5, spaceAfter=3, keepWithNext=True)
body = ParagraphStyle("Body", parent=ss["BodyText"], fontName="Helvetica", fontSize=8.15, leading=10.4, textColor=INK, spaceAfter=2)
small = ParagraphStyle("Small", parent=body, fontSize=7.9, leading=9.6, spaceAfter=1.5)
entry = ParagraphStyle("Entry", parent=body, fontName="Helvetica-Bold", fontSize=8.5, leading=10.2, spaceBefore=2, spaceAfter=1, keepWithNext=True)
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=9, firstLineIndent=-7, bulletIndent=0, spaceAfter=1.2)

def p(text, style=body):
    return Paragraph(text, style)

def sec(text):
    return p(text, section)

def b(text):
    return p("&#8226; " + text, bullet)

def project(title, stack, bullets, url):
    parts = [p(f"{title} <font color='#525E6D'>| {stack}</font>", entry)]
    parts += [b(x) for x in bullets]
    parts.append(p(f"<link href='{url}' color='#17365D'>{url.replace('https://', '')}</link>", small))
    return parts

class CV(BaseDocTemplate):
    def __init__(self, path, role):
        super().__init__(str(path), pagesize=A4, leftMargin=17*mm, rightMargin=17*mm, topMargin=14*mm, bottomMargin=13*mm,
                         title=f"Yasser Akanni - {role} CV", author="Yasser Akanni", subject=role)
        self.role = role
        self.addPageTemplates(PageTemplate(id="cv", frames=[Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="main")], onPage=self.draw_page))

    def draw_page(self, canvas, doc):
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, H-3*mm, W, 3*mm, stroke=0, fill=1)
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(17*mm, 7*mm, "YASSER AKANNI")
        canvas.drawRightString(W-17*mm, 7*mm, f"{self.role}  |  {doc.page} / 2")
        canvas.restoreState()

def make_story(role):
    full = role == "Junior Full-Stack Developer"
    title = role + (" | React · Next.js · TypeScript · Node.js · PostgreSQL" if full else " | React · Next.js · TypeScript")
    s = [p("Yasser Akanni", name), p(title, headline),
         p("Essen, Germany | +49 176 12854755 | <link href='mailto:ressay93@outlook.com' color='#17365D'>ressay93@outlook.com</link>", contact),
         p("<link href='https://yasser-akanni.vercel.app' color='#17365D'>Portfolio</link> | <link href='https://github.com/z4dhbnxw8f-prog' color='#17365D'>GitHub</link> | <link href='https://www.linkedin.com/in/yasser-akanni-4b15333b3/' color='#17365D'>LinkedIn</link>", contact),
         sec("Professional Summary")]
    summary = ("Junior Full-Stack Developer focused on React, Next.js, TypeScript and database-driven applications, with hands-on experience building and deploying web apps using Node.js, PostgreSQL, Prisma, authentication and APIs. I completed Syntax Institut’s 2,300-unit IT qualification and hold IHK certificates in digital product design and web development. My earlier career in international procurement, logistics and business operations brings practical process understanding to software development. Seeking a Junior Full-Stack Developer role.") if full else ("Junior Frontend Developer focused on React, Next.js, TypeScript, JavaScript, HTML and CSS, with hands-on experience developing and deploying functional web applications. I completed Syntax Institut’s 2,300-unit IT qualification and hold IHK certificates in digital product design and web development. My earlier career in international procurement, logistics and business operations brings practical process understanding to product work. Seeking a Junior Frontend Developer role.")
    s.append(p(summary))
    s.append(sec("Technical Skills"))
    s += [p("<b>Frontend Development:</b> HTML5, CSS3, JavaScript (ES6+), TypeScript, React, Next.js, Tailwind CSS, responsive design", small),
          p("<b>Backend and Databases:</b> Node.js, REST APIs, Next.js Server Actions, PostgreSQL, Prisma ORM, Firebase, Firestore", small),
          p("<b>Tools and Deployment:</b> Git, GitHub, VS Code, npm, Vercel, Figma", small),
          p("<b>Development Practices:</b> Authentication, authorization, CRUD operations, accessibility, debugging, API integration, Agile/Scrum", small),
          sec("Selected Projects")]
    s += project("Penee — Full-Stack Expense Tracker", "Next.js, React, TypeScript, PostgreSQL, Prisma", [
        "Built and deployed a personal finance app with session authentication, protected routes and user-specific accounts, transactions and budgets.",
        "Added multi-currency support; Decimal-based money handling and correction transactions preserve financial precision and transaction history."], "https://xpense-trvcker.vercel.app")
    s += project("ItemVault — Personal Inventory Application", "React, Vite, Firebase Authentication, Firestore", [
        "Built private inventories with item categories, locations, status, search and filtering across screen sizes.",
        "Connected real-time Firestore listeners and protected routes; used Firestore security rules to protect user records."], "https://item-vault.vercel.app")
    s += project("Cosmic Styles LLC — Real-World Client Website", "HTML, CSS, JavaScript", [
        "Built a responsive client website for services, pricing, business information, gallery and appointment requests.",
        "Created a service/date/time/details flow that prepares WhatsApp messages and email drafts for customers to send."], "https://cosmicstylesllc.vercel.app")
    s += project("Salesbook — Sales and Stock Management", "Next.js, React, TypeScript, PostgreSQL, Prisma", [
        "Built owner and worker workspaces for sales, stock, payments, cash handovers and commission per sale.",
        "Implemented role-aware access and configurable workspace currency for business records."], "https://salesbook-bay.vercel.app")
    s += project("Learn Yoruba with Ykay — Educational Website", "Next.js, React, TypeScript, Tailwind CSS", [
        "Built a responsive teaching website connecting tutor information, lesson options and Yoruba cultural stories.",
        "Added accessible motion and direct email and WhatsApp enquiry links."], "https://learnyorubawithykay.vercel.app")
    s.append(PageBreak())
    s += [sec("Professional Experience"),
          p("Preymesser | Logistics Operations Associate | 2023–2025", entry),
          b("Supported warehouse and transport workflows through loading, offloading and material handling; coordinated with operations teams to maintain safe, reliable day-to-day execution."),
          p("Haeger &amp; Schmidt | Industrial Logistics Operator | 2022–2023", entry),
          b("Handled truck and vessel loading, crane-assisted material handling, blade cutting and work-area maintenance in a safety-focused industrial environment."),
          p("SIB Enterprises | Purchasing Manager, International Procurement &amp; SAP | 2007–2021", entry),
          b("Managed international purchasing workflows, orders, supplier records and procurement administration in SAP; coordinated import/export activity and supplier sourcing."),
          b("Built experience in process coordination, negotiation, organization, responsibility and cross-cultural communication."),
          sec("Education"),
          p("Qualifizierung zur IT-Fachkraft | Syntax Institut | 09/2025–09/2026", entry),
          p("Successfully completed 11 September 2026 under §81 ff. SGB III | 2,300 teaching units | 46 weeks", small),
          p("Modules: Produktdesign &amp; -entwicklung in der IT (09.01.2026, 700 units); Einführung Software- und Webentwicklung (02.04.2026, 600 units); Vertiefung: Frontend Entwicklung (26.06.2026, 500 units); Spezialisierung &amp; Arbeitsmarktvorbereitung (11.09.2026, 500 units).", small),
          sec("Certifications"),
          p("Digital Product Designer IHK — IHK Akademie München und Oberbayern gGmbH (15.01.2026)", small),
          p("JUNIOR WEB DEVELOPER IHK — IHK Akademie München und Oberbayern gGmbH (17.09.2026)", small),
          p("Web Development Specialist IHK — IHK Akademie München und Oberbayern gGmbH (15.09.2026)", small),
          p("Qualifizierung zur IT-Fachkraft — Syntax Institut, final certificate: Web Development - Qualification for IT and AI-Supported Professions (11.09.2026)", small),
          sec("Languages"),
          p("English — Fluent | French — Fluent | German — B1 (CEFR)", body)]
    return s

for role, filename in [("Junior Frontend Developer", "Yasser-Akanni-Junior-Frontend-Developer-CV.pdf"), ("Junior Full-Stack Developer", "Yasser-Akanni-Junior-Fullstack-Developer-CV.pdf")]:
    CV(OUT / filename, role).build(make_story(role))
    print(OUT / filename)
