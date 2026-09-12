import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Yasser Akanni',
  description: 'Datenschutzerklärung für das Portfolio von Yasser Akanni.',
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header"><Link className="wordmark" href="/"><span>YA</span><span className="wordmark-name">Yasser Akanni</span></Link><Link href="/">Zurück zum Portfolio</Link></header>
      <article>
        <p className="section-kicker">Datenschutz</p>
        <h1>Datenschutzerklärung</h1>
        <p>Diese Website dient der Präsentation des Portfolios von Yasser Akanni. Personenbezogene Daten werden nur verarbeitet, soweit dies für den Betrieb der Website und die Bearbeitung von Kontaktanfragen erforderlich ist.</p>
        <h2>Kontaktformular</h2>
        <p>Wenn Sie das Kontaktformular nutzen, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse und Ihre Nachricht ausschließlich zur Bearbeitung Ihrer Anfrage. Die Angaben werden nicht auf dieser Website gespeichert.</p>
        <p>Für die Übermittlung wird Formspree eingesetzt. Formspree verarbeitet die Angaben zur Weiterleitung der Kontaktanfrage an <a href="mailto:ressay93@outlook.com">ressay93@outlook.com</a>. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf vorvertragliche Maßnahmen gerichtet ist, sonst Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen finden Sie in der <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer">Datenschutzerklärung von Formspree</a>.</p>
        <h2>Server-Protokolle</h2>
        <p>Der Hosting-Anbieter kann technisch erforderliche Zugriffsdaten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browserinformationen in Server-Protokollen verarbeiten. Diese Daten dienen der sicheren und stabilen Bereitstellung der Website.</p>
        <h2>Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren.</p>
        <h2>Verantwortlicher</h2>
        <p>Yasser Akanni<br />Essen, Deutschland<br /><a href="mailto:ressay93@outlook.com">ressay93@outlook.com</a></p>
        <p className="legal-updated">Stand: September 2026</p>
      </article>
    </main>
  );
}
