from pathlib import Path
import json
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, Image, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Yasser-Akanni-CV-German.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
PROFILE = ROOT / "public" / "yasser-akanni-profile.png"
PAGE_W, PAGE_H = A4
INK = colors.HexColor("#151816")
MUTED = colors.HexColor("#565D58")
GREEN = colors.HexColor("#173F35")
LIME = colors.HexColor("#C8F55A")

styles = getSampleStyleSheet()
name = ParagraphStyle("Name", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=28, leading=31, textColor=INK, spaceAfter=4)
title = ParagraphStyle("Title", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10.2, leading=13, textColor=GREEN, spaceAfter=9)
contact = ParagraphStyle("Contact", parent=styles["Normal"], fontSize=8.4, leading=12, textColor=MUTED)
section = ParagraphStyle("Section", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=10, leading=12, textColor=INK, spaceBefore=10, spaceAfter=6, keepWithNext=True)
body = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=9.15, leading=13.2, textColor=INK, spaceAfter=4)
small = ParagraphStyle("Small", parent=body, fontSize=8.55, leading=12.1, textColor=MUTED)
entry = ParagraphStyle("Entry", parent=body, fontName="Helvetica-Bold", fontSize=9.5, leading=12, keepWithNext=True)
date = ParagraphStyle("Date", parent=small, fontName="Helvetica-Bold", alignment=TA_RIGHT)
bullet_style = ParagraphStyle("Bullet", parent=body, leftIndent=9, firstLineIndent=-7, spaceAfter=2.2)

def p(text, style): return Paragraph(text, style)
def bullet(text): return p(f"• {text}", bullet_style)
def heading(text): return [p(text.upper(), section)]
def entry_header(job, when, subtitle):
    table = Table([[p(f"{job}<br/><font color='#565D58' size='8.2'>{subtitle}</font>", entry), p(when, date)]], colWidths=[132 * mm, 38 * mm])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 1)]))
    return table

class GermanCV(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(filename, pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=17 * mm, bottomMargin=17 * mm, title="Yasser Akanni Lebenslauf", author="Yasser Akanni")
        self.addPageTemplates(PageTemplate(id="cv", frames=[Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")], onPage=self.draw_page))
    def draw_page(self, canvas, doc):
        canvas.saveState(); canvas.setFillColor(GREEN); canvas.rect(0, PAGE_H - 5 * mm, PAGE_W, 5 * mm, stroke=0, fill=1); canvas.setFillColor(LIME); canvas.rect(0, PAGE_H - 5 * mm, 35 * mm, 5 * mm, stroke=0, fill=1)
        canvas.setFont("Helvetica", 7.5); canvas.setFillColor(MUTED); canvas.drawString(20 * mm, 9 * mm, "YASSER AKANNI"); canvas.drawRightString(PAGE_W - 20 * mm, 9 * mm, f"SEITE {doc.page} / 3"); canvas.restoreState()

story = [Table([[[p("Yasser Akanni", name), p("Qualifizierter Junior Frontend-Entwickler · React · Next.js · TypeScript", title), p("Essen, Deutschland · NRW &nbsp;&nbsp;|&nbsp;&nbsp; +49 176 12854755 &nbsp;&nbsp;|&nbsp;&nbsp; <link href='mailto:ressay93@outlook.com' color='#565D58'>ressay93@outlook.com</link><br/><link href='https://github.com/z4dhbnxw8f-prog' color='#565D58'>github.com/z4dhbnxw8f-prog</link> &nbsp;&nbsp;|&nbsp;&nbsp; <link href='https://www.linkedin.com/in/yasser-akanni-4b15333b3/' color='#565D58'>linkedin.com/in/yasser-akanni-4b15333b3/</link>", contact)], Image(str(PROFILE), width=27 * mm, height=34 * mm)]], colWidths=[140 * mm, 30 * mm]), Spacer(1, 5)]
story += heading("Profil") + [p("Junior Frontend-Entwickler mit Schwerpunkt auf React, Next.js und TypeScript sowie Fähigkeiten in UI/UX und praktischer Full-Stack-Entwicklung. Ich entwickle responsive Webanwendungen von der Gestaltung bis zum Deployment und bringe Erfahrung mit Authentifizierung, CRUD, API-Integration und datenbankgestützten Oberflächen mit. Im September 2026 habe ich die IT-Weiterbildung am Syntax Institut mit 2.300 Unterrichtseinheiten in 46 Wochen erfolgreich abgeschlossen. Ab sofort verfügbar für Junior-Positionen in den Bereichen Frontend-, React-, Next.js- und Webentwicklung.", body)]
story += heading("Technische Kompetenzen")
for group in json.loads((ROOT / "scripts/cv_skills.json").read_text()):
    story.append(p(f"<b>{group['title']['de']}:</b> {', '.join(group['skills']['de'])}", small))
story.append(PageBreak())
story += heading("Ausgewählte Projekte")
story += [entry_header("Penee", "ABSCHLUSSPROJEKT", "Abschlussprojekt · Full-Stack-Ausgabentracker"), bullet("Entwickelt mit Next.js, React, TypeScript, PostgreSQL, Prisma, Server Actions und Vercel."), bullet("Sichere Sessions, bcrypt, geschützte Routen und nutzereigene Daten; Konten, Einnahmen, Ausgaben, Budgets und mehrere Währungen. Responsiv und live auf Vercel; Android-Version mit Capacitor."), bullet("Historische Finanzdaten bleiben durch Decimal-Beträge, Korrekturtransaktionen und gespeicherte Originalwährungen geschützt."), p("<link href='https://xpense-trvcker.vercel.app' color='#173F35'><b>xpense-trvcker.vercel.app</b></link>", small), Spacer(1, 3), entry_header("ItemVault", "LIVE", "Private Inventaranwendung"), bullet("Responsive React-/Vite-Anwendung mit Firebase Authentication und Firestore-Echtzeitdaten."), bullet("Private Inventare, Gegenstände, Kategorien, Orte, Status, Suche, Filter, geschützte Routen und Firestore Security Rules."), p("<link href='https://item-vault.vercel.app' color='#173F35'><b>item-vault.vercel.app</b></link>", small)]
story += heading("Ausgewählte Projekte – Fortsetzung") + [entry_header("Cosmic Styles LLC", "LIVE", "Webanwendung für einen realen Barbershop"), bullet("Responsive HTML-, CSS- und JavaScript-Oberfläche für Leistungen, Preise, Geschäftsinformationen und Galerie."), bullet("Buchungsablauf von Leistung über Datum und Uhrzeit bis zu Kundendaten mit vorausgefüllter WhatsApp-Übergabe."), p("<link href='https://cosmic-styles-llc.vercel.app' color='#173F35'><b>cosmic-styles-llc.vercel.app</b></link>", small)]
story.append(PageBreak())
story += heading("Ausbildung und IT-Qualifizierung") + [entry_header("Qualifizierung zur IT-Fachkraft", "09/2025 – 09/2026", "Syntax Institut · Erfolgreich abgeschlossen · 2.300 Unterrichtseinheiten · 46 Wochen"), p("Am 11.09.2026 erfolgreich abgeschlossene Weiterbildung nach §81 ff. SGB III in Produkt- und UI/UX-Design, Software- und Webentwicklung, Frontend, Backend-Grundlagen, Datenbanken, Authentifizierung, APIs, Git/GitHub, Deployment, Scrum, Debugging und technischer Dokumentation.", body)]
for module in ["Produktdesign & -entwicklung in der IT - 09.01.2026 - 700 UE", "Einführung Software- und Webentwicklung - 02.04.2026 - 600 UE", "Vertiefung: Frontend Entwicklung - 26.06.2026 - 500 UE", "Spezialisierung & Arbeitsmarktvorbereitung - 11.09.2026 - 500 UE"]: story.append(bullet(module))
story += heading("Berufserfahrung") + [entry_header("Preymesser", "2023 – 2025", "Mitarbeiter Logistikbetrieb"), p("Unterstützung von Lager- und Transportabläufen durch Be- und Entladen sowie Materialhandling. Sicherstellung verlässlicher und sicherer täglicher Arbeitsabläufe im Team.", body), Spacer(1, 3), entry_header("Haeger & Schmidt", "2022 – 2023", "Mitarbeiter Industrielogistik"), p("Be- und Entladen von Lkw und Schiffen, kranunterstütztes Materialhandling, Schneidarbeiten und Pflege des Arbeitsbereichs in einem sicherheitsorientierten Industrieumfeld.", body), Spacer(1, 3), entry_header("SIB Enterprises", "2007 – 2021", "Einkaufsmanager – internationale Beschaffung & SAP"), p("Verantwortung für Einkauf und Beschaffung, internationale Lieferantensuche, SAP-gestützte Bestellungen und Lieferantenverwaltung sowie Import- und Exportkoordination. Entwicklung von Organisation, Verhandlung und interkultureller Kommunikation.", body)]
story += heading("Zertifikate") + [entry_header("Qualifizierung zur IT-Fachkraft", "ABGESCHLOSSEN", "Syntax Institut · Abschlusszertifikat · 11.09.2026"), p("Abschlusszertifikat: Webentwicklung - Qualifizierung für IT- und KI-gestützte Berufe. Digital Product Designer IHK (ausgestellt am 15.01.2026). Junior WEB-Developer (IHK) und Web Development Specialist (IHK): erfolgreich abgeschlossen - offizielle Zertifikate werden noch ausgestellt.", small)]
story += heading("Sprachen") + [p("<b>Englisch</b> – fließend &nbsp;&nbsp;&nbsp; <b>Französisch</b> – fließend &nbsp;&nbsp;&nbsp; <b>Deutsch</b> – B1 (GER)", body)]
GermanCV(str(OUTPUT)).build(story)
print(OUTPUT)

shutil.copy2(OUTPUT, ROOT / "public/Yasser-Akanni-CV-German.pdf")
