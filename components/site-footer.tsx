'use client';

import Link from 'next/link';
import { ArrowUpRight, Download, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const githubUrl = 'https://github.com/z4dhbnxw8f-prog';
const linkedInUrl = 'https://www.linkedin.com/in/yasser-akanni-4b15333b3/';

export function SiteFooter() {
  const language = useSearchParams().get('lang') === 'de' ? 'de' : 'en';
  const isEnglish = language === 'en';
  const cvHref = isEnglish ? '/Yasser-Akanni-CV-English.pdf' : '/Yasser-Akanni-CV-German.pdf';

  return (
    <footer>
      <div><strong>Yasser Akanni</strong><span>Junior Frontend Developer · React · Next.js · TypeScript</span><span>© {new Date().getFullYear()} XXL Designs</span></div>
      <div className="footer-links">
        <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
        <a href={linkedInUrl} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
        <a href={cvHref} download>{isEnglish ? 'CV' : 'Lebenslauf'} <Download /></a>
        <Link href={`/datenschutz?lang=${language}`}>{isEnglish ? 'Privacy' : 'Datenschutz'} <ShieldCheck /></Link>
        <Link href={`/?lang=${language}#top`}>{isEnglish ? 'Back to top' : 'Nach oben'} <ArrowUpRight /></Link>
      </div>
    </footer>
  );
}
