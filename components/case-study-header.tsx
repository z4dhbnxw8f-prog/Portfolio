'use client';

import { Download } from 'lucide-react';
import { PortfolioModesButton } from '@/components/portfolio-modes';
import { ThemeToggle } from '@/components/scrapbook-extras';
import { FullscreenMenu } from '@/components/fullscreen-menu';

import { portfolioCopy, type Language } from '@/lib/portfolio-content';


export function CaseStudyHeader({ language, slug }: { language: Language; slug: string }) {
  const cvHref = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';

  return (
    <header className="site-header case-header cinematic-header">
      <a data-project-back className="wordmark" href={`/?lang=${language}`} aria-label={language === 'de' ? 'Zurück zum Portfolio von Yasser Akanni' : 'Back to Yasser Akanni portfolio'}><span>YA</span><span className="wordmark-name">Yasser Akanni</span></a>
      <nav className="scrapbook-nav" aria-label={portfolioCopy[language].navLabel}>{['top', 'projects', 'skills', 'about', 'contact'].map((id, index) => <a key={id} href={`/?lang=${language}#${id}`} aria-current={id === 'projects' ? 'location' : undefined}>{portfolioCopy[language].nav[index]}</a>)}</nav>
      <FullscreenMenu language={language} activeSection="projects" homeUrl={`/?lang=${language}`} languageUrls={{ de: `/projects/${slug}?lang=de`, en: `/projects/${slug}?lang=en` }} />
      <div className="header-tools case-header-tools">
        <PortfolioModesButton language={language} /><ThemeToggle language={language} />
        <a className="project-return" data-project-back href={`/?lang=${language}#projects`}>{language === 'de' ? '← Zurück' : '← Back'}</a>
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
