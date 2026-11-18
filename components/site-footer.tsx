'use client';

import { useEffect } from 'react';
import { ArrowUp, Download, Github, Linkedin, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const githubUrl = 'https://github.com/z4dhbnxw8f-prog';
const linkedInUrl = 'https://www.linkedin.com/in/yasser-akanni-4b15333b3/';

export function SiteFooter() {
  const language = useSearchParams().get('lang') === 'de' ? 'de' : 'en';
  const isEnglish = language === 'en';
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const cvHref = isEnglish ? '/Yasser-Akanni-CV-English.pdf' : '/Yasser-Akanni-CV-German.pdf';

  return (
    <footer>
      <div><strong>Yasser Akanni</strong><span>{isEnglish ? 'Frontend Developer' : 'Frontend-Entwickler'} · React · Next.js · TypeScript</span><span>© {new Date().getFullYear()} XXL Designs</span></div>
      <div className="footer-links">
        <a href={githubUrl} target="_blank" rel="noreferrer"><Github /> GitHub</a>
        <a href={linkedInUrl} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
        <a href={cvHref} download>{isEnglish ? 'CV' : 'Lebenslauf'} <Download /></a>
        <a href={`/datenschutz?lang=${language}`}>{isEnglish ? 'Privacy' : 'Datenschutz'} <ShieldCheck /></a>
        <a href={`/?lang=${language}#top`}><ArrowUp /> {isEnglish ? 'Back to top' : 'Zurück nach oben'}</a>
      </div>
    </footer>
  );
}
