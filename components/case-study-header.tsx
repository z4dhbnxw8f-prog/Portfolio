'use client';

import { Download, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { portfolioCopy, type Language } from '@/lib/portfolio-content';

const sectionIds = ['top', 'projects', 'skills', 'about', 'experience', 'qualifications', 'contact'];

export function CaseStudyHeader({ language, slug }: { language: Language; slug: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const siteCopy = portfolioCopy[language];
  const cvHref = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';

  return (
    <header className={`site-header case-header${menuOpen ? ' menu-open' : ''}`}>
      <a className="wordmark" href={`/?lang=${language}`} aria-label={language === 'de' ? 'Zurück zum Portfolio von Yasser Akanni' : 'Back to Yasser Akanni portfolio'}><span>YA</span><span className="wordmark-name">Yasser Akanni</span></a>
      <button className="nav-toggle" type="button" aria-expanded={menuOpen} aria-controls="case-study-navigation" onClick={() => setMenuOpen((open) => !open)}>
        <span className="sr-only">{language === 'de' ? 'Menü' : 'Menu'}</span>{menuOpen ? <X /> : <Menu />}
      </button>
      <nav id="case-study-navigation" aria-label={siteCopy.navLabel}>
        {siteCopy.nav.map((label, index) => <a href={`/?lang=${language}#${sectionIds[index]}`} key={sectionIds[index]} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-tools case-header-tools">
        <a className="header-cv" href={cvHref} download><Download size={14} /> {language === 'de' ? 'Lebenslauf' : 'CV'}</a>
        <div className="language-switcher" aria-label={language === 'de' ? 'Sprache wählen' : 'Choose language'}>
          <a aria-current={language === 'de' ? 'page' : undefined} href={`/projects/${slug}?lang=de`}>DE</a>
          <span aria-hidden="true">/</span>
          <a aria-current={language === 'en' ? 'page' : undefined} href={`/projects/${slug}?lang=en`}>EN</a>
        </div>
      </div>
    </header>
  );
}
