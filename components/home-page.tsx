/* oxlint-disable next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BriefcaseBusiness,
  Code2,
  Database,
  Download,
  Mail,
  MapPin,
  PanelsTopLeft,
  Phone,
  ServerCog,
  ShieldCheck,
  Terminal,
  PencilRuler,
  Wrench,
} from 'lucide-react';

import { PortfolioModesButton } from '@/components/portfolio-modes';
import { FullscreenMenu } from '@/components/fullscreen-menu';
import { useCinematic } from '@/components/motion/use-cinematic';
import { ContactForm } from '@/components/contact-form';
import { ProjectBento } from '@/components/project-bento';
import { ThemeToggle, HeroStickers, RandomStuff, PlayfulCursor } from '@/components/scrapbook-extras';
import { buttonVariants } from '@/components/ui/button';
import {
  experience,
  qualifications,
  portfolioCopy,
  processSteps,
  skillGroups,
  strengths,
  type Language,
} from '@/lib/portfolio-content';

const sectionIds = ['top', 'projects', 'skills', 'about', 'contact'];
const contactEmail = 'ressay93@outlook.com';
const contactPhone = '+49 176 12854755';
const githubUrl = 'https://github.com/z4dhbnxw8f-prog';
const linkedInUrl = 'https://www.linkedin.com/in/yasser-akanni-4b15333b3/';
const skillIcons = [PanelsTopLeft, ServerCog, Database, ShieldCheck, Code2, PencilRuler, Wrench, Terminal];


export default function Home() {
  const language: Language = useSearchParams().get('lang') === 'de' ? 'de' : 'en';
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const rootRef = useRef<HTMLElement>(null);
  const [activeSkill, setActiveSkill] = useState('All');
  useCinematic(rootRef, language);
  const copy = portfolioCopy[language];
  const introduction = language === 'de' ? 'Hi, ich bin Yasser — Webentwickler aus Essen.' : 'Hi, I’m Yasser — a web developer based in Essen.';
  const cvHref = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';
  const changeLanguage = (nextLanguage: Language) => {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLanguage);
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'de'
      ? 'Yasser Akanni | Frontend-Entwickler in Essen'
      : 'Yasser Akanni | Frontend Developer in Essen';
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    description?.setAttribute(
      'content',
      language === 'de'
        ? 'Portfolio von Yasser Akanni, Frontend-Entwickler für React, Next.js und TypeScript in Essen, NRW.'
        : 'Portfolio of Yasser Akanni, a frontend developer focused on React, Next.js, and TypeScript in Essen, Germany.',
    );
  }, [language]);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 18);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const activationLine = window.innerHeight * 0.3;
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (!section || section.getBoundingClientRect().top > activationLine) break;
          current = id;
        }
        const atPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        setActiveSection(atPageBottom ? 'contact' : current);
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <main className="cinematic scrapbook" ref={rootRef}>
      <PlayfulCursor />
      <a className="skip-link" href="#projects">{language === 'de' ? 'Zum Inhalt' : 'Skip to content'}</a>
      <div className="scroll-progress" aria-hidden="true" />
      <header className={`site-header cinematic-header${isScrolled ? ' is-scrolled' : ''}`}>
        <a className="wordmark" href="#top" aria-label={copy.homeLabel}>
          <span>YA</span>
          <span className="wordmark-name">Yasser Akanni</span>
        </a>
        <nav className="scrapbook-nav" aria-label={copy.navLabel}>{sectionIds.map((id, index) => <a href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} key={id}>{copy.nav[index]}</a>)}</nav>
        <FullscreenMenu language={language} activeSection={activeSection} onLanguageChange={changeLanguage} />
        <div className="header-tools">
          <PortfolioModesButton language={language} />
          <ThemeToggle language={language} />
          <fieldset className="language-switcher">
            <legend className="sr-only">{language === 'de' ? 'Sprache wählen' : 'Choose language'}</legend>
            <button type="button" aria-pressed={language === 'de'} onClick={() => changeLanguage('de')}>DE</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button>
          </fieldset>
        </div>
      </header>



      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="hero-edition">PORTFOLIO / 2026 <span>DESIGN × DEVELOPMENT</span></p>
          <p className="hero-name" aria-label="Yasser Akanni"><span className="name-mask"><span className="hero-name-word">YASSER</span></span><span className="name-mask"><span className="hero-name-word">AKANNI<span className="name-period">.</span></span></span></p>
          <div className="eyebrow"><MapPin size={14} /> {copy.location}</div>
          <p className="role-line"><span className="role-mask"><span className="role-text">{copy.role}</span></span></p>
          <p className="stack-line">{copy.stack}</p>
          <h1>{copy.headline[0]}<br /><em>{copy.headline[1]}</em></h1>
          <p className="hero-lead">{copy.hero}</p>
          <div className="hero-actions">
            <a className={`primary-action ${buttonVariants({ size: 'lg' })}`} href="#projects">{language === 'de' ? 'Projekte entdecken' : 'Explore my work'} <span aria-hidden="true">↗</span></a>
            <a className="hero-github" href={githubUrl} target="_blank" rel="noreferrer"><Code2 /> GitHub </a>
            <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href={cvHref} download><Download /> {copy.downloadCv}</a>
            <a className="hero-credential" href="/credentials/junior-web-developer-ihk-web.pdf" target="_blank" rel="noreferrer"><ShieldCheck size={14} /> Junior Web Developer IHK</a>
          </div>
          <div className="hero-modes-invite"><PortfolioModesButton language={language} placement="hero" /><span className="hand-note">{language === 'de' ? 'Anderes Fenster. Gleiche Person. ↖' : 'Different window. Same human. ↖'}</span></div>
          <div className="hero-availability">
            <p className="section-kicker">{copy.lookingFor}</p>
            <p>{copy.roles}</p>
            <p>{copy.preferred}</p>
          </div>
          <div className="social-links">
            <a href={githubUrl} target="_blank" rel="noreferrer"><Code2 /> GitHub</a>
            <a href={linkedInUrl} target="_blank" rel="noreferrer"><BriefcaseBusiness /> LinkedIn</a>
          </div>
        </div>

        <aside className="hero-aside">
          <HeroStickers language={language} />
          <p className="portrait-caption">{introduction}</p>
          <figure className="profile-photo">
            <img src="/yasser-akanni-profile-20261012.png" alt="Yasser Akanni" width={856} height={1836} />
          </figure>
          <div className="practice-map" id="process" aria-label={copy.processTitle}>
          <div className="map-header"><span>{copy.processTitle}</span></div>
          <ol>
            {processSteps[language].map(([number, title, detail], index) => (
              <li className={index === processSteps[language].length - 1 ? 'is-complete' : undefined} key={number}><span className="step-progress" aria-hidden="true"><i /></span><div><strong>{title}</strong><small>{detail}</small></div></li>
            ))}
          </ol>
          <div className="map-footer"><span>{copy.primaryFocus}</span><strong>{copy.frontendDevelopment}</strong></div>
          </div>
        </aside>
        <div className="skills-marquee" aria-label="React · Next.js · TypeScript · Figma · PostgreSQL"><div aria-hidden="true">{[0, 1].map((n) => <span key={n}>REACT ✦ NEXT.JS ✦ TYPESCRIPT ✦ FIGMA ✦ POSTGRESQL ✦ CSS ✦ </span>)}</div></div>
        <a className="scroll-cue" href="#projects"><span>{language === 'de' ? 'WEITER ENTDECKEN' : 'SCROLL TO EXPLORE'}</span><span aria-hidden="true">↓</span></a>
      </section>

      <section className="section projects-section" id="projects" data-section="02">
        <div className="section-heading">
          <p className="section-kicker">{copy.projectsKicker}</p>
          <h2>{copy.projectsTitle[0]}<br />{copy.projectsTitle[1]}</h2>
          <p>{copy.projectsIntro}</p>
        </div>

        <ProjectBento language={language} />
      </section>

      <section className="section skills-section" id="skills" data-section="03">
        <div className="section-heading compact">
          <p className="section-kicker">{copy.skillsKicker}</p>
          <h2>{copy.skillsTitle}</h2>
          <p>{copy.skillsIntro}</p>
        </div>
        <div className="core-stack" aria-label={language === 'de' ? 'Frontend-Schwerpunkt' : 'Core frontend stack'}>{['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'].map((tech) => <span key={tech}>{tech}</span>)}</div>
        <div className="skill-filters" aria-label={language === 'de' ? 'Kompetenzen filtern' : 'Filter skills'}>
          {['All', ...skillGroups.map((group) => group.title.en)].map((category) => <button type="button" key={category} aria-pressed={activeSkill === category} onClick={() => setActiveSkill(category)}>{category === 'All' ? (language === 'de' ? 'Alle' : 'All expertise') : skillGroups.find((group) => group.title.en === category)?.title[language]}</button>)}
        </div>
        <div className="skills-grid">
          {skillGroups.map((group) => {
            const Icon = skillIcons[skillGroups.indexOf(group)];
            return (
              <article className="skill-group" key={group.title.en} hidden={activeSkill !== 'All' && activeSkill !== group.title.en}>
                <div className="skill-title"><Icon /><h3>{group.title[language]}</h3></div>
                <ul className="skill-technologies">{group.skills[language].map((skill) => <li key={skill}>{skill}</li>)}</ul>
                {group.evidence && <small><strong>{copy.evidence}:</strong> {group.evidence[language]}</small>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section about-section" id="about" data-section="04">
        <div className="about-title">
          <p className="section-kicker">{copy.aboutKicker}</p>
          <h2>{copy.aboutTitle[0]}<br /><em>{copy.aboutTitle[1]}</em></h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">{copy.aboutLead}</p>
          <p>{copy.aboutBody}</p>
          <p>{copy.aboutTraining}</p>
          <div className="about-principle"><ShieldCheck /><p><strong>{copy.perspective}</strong><br />{copy.perspectiveBody}</p></div>
          <div className="currently-into"><span className="hand-note">{language === 'de' ? 'aktuell im fokus ↴' : 'currently into ↴'}</span><ul><li>UI/UX &amp; React</li><li>{language === 'de' ? 'Verständliche Nutzerabläufe' : 'Thoughtful user flows'}</li><li>{language === 'de' ? 'Interfaces mit Liebe zum Detail' : 'Interfaces with attention to detail'}</li></ul></div>
          <div className="strengths" aria-label={language === 'de' ? 'Stärken' : 'Strengths'}>
            {strengths[language].map((strength) => <span key={strength}>{strength}</span>)}
          </div>
        </div>
      </section>

      <section className="section career-section" id="experience">
        <div className="section-heading"><p className="section-kicker">{copy.experienceKicker}</p><h2>{copy.experienceTitle.join(' ')}</h2><p>{copy.experienceIntro}</p></div>
        <div className="career-list">{experience.map((item) => <details className="career-detail" key={item.date.en}><summary><span>{item.date[language]}</span><strong>{typeof item.title === 'string' ? item.title : item.title[language]}</strong><span aria-hidden="true">↗</span></summary><p>{item.kind[language]}{item.org ? ` · ${item.org}` : ''}</p><p>{item.body[language]}</p>{item.modules && <ul>{item.modules.map(([hours, title]) => <li key={hours + title.en}>{hours} · {title[language]}</li>)}</ul>}</details>)}</div>
        <div className="qualification-block" id="qualifications"><p className="section-kicker">{copy.qualificationsKicker}</p><h3>{copy.qualificationsTitle}</h3><p>{copy.qualificationsIntro}</p><div className="qualification-links">{qualifications.map((item) => <a href={item.href} key={item.title} target="_blank" rel="noreferrer"><span>{language === 'de' ? item.titleDe ?? item.title : item.titleEn ?? item.title}</span><small>{item.institution} · {item.date}</small><span aria-hidden="true">↗</span></a>)}</div></div>
      </section>



      <RandomStuff language={language} />

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="section-kicker">{copy.contactKicker}</p>
          <h2>{language === 'de' ? copy.contactTitle : "LET’S BUILD SOMETHING USEFUL."}</h2>
          <p>{copy.contactBody}</p>
          <address>
            <a href={`mailto:${contactEmail}`}><Mail /> {contactEmail}</a>
            <a href="tel:+4917612854755"><Phone /> {contactPhone}</a>
            <span><MapPin /> Essen · NRW</span>
          </address>
          <div className="contact-links">
            <a href={linkedInUrl} target="_blank" rel="noreferrer"><BriefcaseBusiness /> LinkedIn </a>
            <a href={githubUrl} target="_blank" rel="noreferrer"><Code2 /> GitHub </a>
          </div>
          <p className="work-status"><i aria-hidden="true" />{language === 'de' ? 'Bereit für neue Aufgaben' : 'Ready to work'}</p>
        </div>
        <ContactForm language={language} privacyText={copy.privacy} />
      </section>

    </main>
  );
}
