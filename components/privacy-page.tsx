'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Menu, X } from 'lucide-react';

import { portfolioCopy, type Language } from '@/lib/portfolio-content';

const sectionIds = ['top', 'projects', 'skills', 'about', 'experience', 'qualifications', 'contact'];

const privacyCopy = {
  de: {
    kicker: 'Datenschutz', title: 'Datenschutzerklärung', intro: 'Diese Website dient der Präsentation des Portfolios von Yasser Akanni. Personenbezogene Daten werden nur verarbeitet, soweit dies für den Betrieb der Website und die Bearbeitung von Kontaktanfragen erforderlich ist.',
    formTitle: 'Kontaktformular', formOne: 'Wenn Sie das Kontaktformular nutzen, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse und Ihre Nachricht ausschließlich zur Bearbeitung Ihrer Anfrage. Die Website speichert diese Angaben nicht in einer eigenen Datenbank.', formTwo: 'Das Formular übermittelt Ihre Angaben direkt an Formspree. Formspree verarbeitet sie zur Weiterleitung Ihrer Anfrage an ', formThree: '. Dabei können Daten auch außerhalb der EU, insbesondere in den USA, verarbeitet werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf vorvertragliche Maßnahmen gerichtet ist, sonst Art. 6 Abs. 1 lit. f DSGVO.',
    hostingTitle: 'Hosting und Server-Protokolle', hosting: 'Diese Website wird über Vercel bereitgestellt. Vercel kann technisch erforderliche Zugriffsdaten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browserinformationen in Server-Protokollen verarbeiten. Diese Daten dienen der sicheren und stabilen Bereitstellung der Website.', rightsTitle: 'Ihre Rechte', rights: 'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Sie können sich außerdem bei einer Datenschutzaufsichtsbehörde beschweren.', controllerTitle: 'Verantwortlicher', updated: 'Stand: 12. September 2026', cv: 'Lebenslauf', formspree: 'Datenschutzerklärung von Formspree', vercel: 'Datenschutzerklärung von Vercel', language: 'Sprache wählen',
  },
  en: {
    kicker: 'Privacy', title: 'Privacy policy', intro: 'This website presents Yasser Akanni’s portfolio. Personal data is processed only where necessary to operate the website and respond to contact enquiries.',
    formTitle: 'Contact form', formOne: 'When you use the contact form, your name, email address, and message are processed solely to respond to your enquiry. The website does not store these details in its own database.', formTwo: 'The form sends your information directly to Formspree, which processes it to forward your enquiry to ', formThree: '. Data may be processed outside the EU, including in the United States. The legal basis is Art. 6(1)(b) GDPR where the enquiry concerns pre-contractual measures, otherwise Art. 6(1)(f) GDPR.',
    hostingTitle: 'Hosting and server logs', hosting: 'This website is hosted by Vercel. Vercel may process technically necessary access data such as IP address, time of access, requested page, and browser information in server logs. This data supports the secure and reliable provision of the website.', rightsTitle: 'Your rights', rights: 'You have the right to access, correct, erase, restrict, and object to processing of your personal data, as well as the right to data portability. You may also lodge a complaint with a data protection authority.', controllerTitle: 'Controller', updated: 'Last updated: 12 September 2026', cv: 'CV', formspree: 'Formspree privacy policy', vercel: 'Vercel privacy notice', language: 'Choose language',
  },
} as const;

export function PrivacyPage() {
  const language: Language = useSearchParams().get('lang') === 'de' ? 'de' : 'en';
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const siteCopy = portfolioCopy[language];
  const copy = privacyCopy[language];
  const cvHref = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';
  useEffect(() => {
    document.title = `${copy.title} | Yasser Akanni`;
    document.documentElement.lang = language;
  }, [copy.title, language]);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  const changeLanguage = (nextLanguage: Language) => { const url = new URL(window.location.href); url.searchParams.set('lang', nextLanguage); router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false }); };

  return <>
    <header className={`site-header legal-site-header${menuOpen ? ' menu-open' : ''}`}>
      <a className="wordmark" href={`/?lang=${language}`} aria-label={language === 'de' ? 'Zur Startseite' : 'Back to home'}><span>YA</span><span className="wordmark-name">Yasser Akanni</span></a>
      <button ref={menuButton} className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="privacy-navigation" onClick={() => setMenuOpen((open) => !open)}>
        <span className="sr-only">{language === 'de' ? 'Menü' : 'Menu'}</span>{menuOpen ? <X /> : <Menu />}
      </button>
      <nav id="privacy-navigation" aria-label={siteCopy.navLabel}>{siteCopy.nav.map((label, index) => <a href={`/?lang=${language}#${sectionIds[index]}`} key={sectionIds[index]} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <div className="header-tools">
        <Link className="header-cv" href={cvHref} download><Download size={14} /> {copy.cv}</Link>
        <fieldset className="language-switcher"><legend className="sr-only">{copy.language}</legend><button type="button" aria-pressed={language === 'de'} onClick={() => changeLanguage('de')}>DE</button><span aria-hidden="true">/</span><button type="button" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button></fieldset>
      </div>
    </header>
    <main className="legal-page" lang={language}><article>
      <a className="legal-back-link" href={`/?lang=${language}`}><ArrowLeft size={18} aria-hidden="true" />{language === 'de' ? 'Zurück zur Startseite' : 'Back to home'}</a>
      <p className="section-kicker">{copy.kicker}</p><h1>{copy.title}</h1><p>{copy.intro}</p>
      <h2>{copy.formTitle}</h2><p>{copy.formOne}</p><p>{copy.formTwo}<a href="mailto:ressay93@outlook.com">ressay93@outlook.com</a>{copy.formThree} <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer">{copy.formspree}</a>.</p>
      <h2>{copy.hostingTitle}</h2><p>{copy.hosting} <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">{copy.vercel}</a>.</p>
      <h2>{copy.rightsTitle}</h2><p>{copy.rights}</p>
      <h2>{copy.controllerTitle}</h2><p>Yasser Akanni<br />Essen, {language === 'de' ? 'Deutschland' : 'Germany'}<br /><a href="mailto:ressay93@outlook.com">ressay93@outlook.com</a></p><p className="legal-updated">{copy.updated}</p>
    </article></main>
  </>;
}
