/* oxlint-disable next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Code2,
  Database,
  Download,
  FolderKanban,
  House,
  Mail,
  MapPin,
  PanelsTopLeft,
  Phone,
  ServerCog,
  ShieldCheck,
  Terminal,
  UserRound,
  PencilRuler,
  Wrench,
} from 'lucide-react';

import { ContactForm } from '@/components/contact-form';
import { buttonVariants } from '@/components/ui/button';
import {
  experience,
  portfolioCopy,
  processSteps,
  projectCopy,
  qualifications,
  skillGroups,
  strengths,
  type Language,
} from '@/lib/portfolio-content';
import { projects } from '@/lib/projects';

const sectionIds = ['top', 'projects', 'skills', 'about', 'experience', 'qualifications', 'contact'];
const contactEmail = 'ressay93@outlook.com';
const contactPhone = '+49 176 12854755';
const githubUrl = 'https://github.com/z4dhbnxw8f-prog';
const linkedInUrl = 'https://www.linkedin.com/in/yasser-akanni-4b15333b3/';
const skillIcons = [PanelsTopLeft, ServerCog, Database, ShieldCheck, PencilRuler, Wrench, Terminal];
const navIcons = [House, FolderKanban, Code2, UserRound, BriefcaseBusiness, Award, Mail];

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const copy = portfolioCopy[language];
  const introduction = language === 'de' ? 'Hi, ich bin Yasser — Webentwickler aus Essen.' : 'Hi, I’m Yasser — a web developer based in Essen.';
  const cvHref = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';
  const cvDownloadLabel = language === 'de' ? copy.cvGermanShort : copy.cvLabel;
  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLanguage);
    window.history.replaceState(null, '', url);
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('lang') === 'de') setLanguage('de');
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'de'
      ? 'Yasser Akanni | Junior Frontend-Entwickler in Essen'
      : 'Yasser Akanni | Junior Frontend Developer in Essen';
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    description?.setAttribute(
      'content',
      language === 'de'
        ? 'Portfolio von Yasser Akanni, Junior Frontend-Entwickler für React, Next.js und TypeScript in Essen, NRW.'
        : 'Portfolio of Yasser Akanni, a junior frontend developer focused on React, Next.js, and TypeScript in Essen, Germany.',
    );
  }, [language]);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 18);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
        <a className="wordmark" href="#top" aria-label={copy.homeLabel}>
          <span>YA</span>
          <span className="wordmark-name">Yasser Akanni</span>
        </a>
        <nav aria-label={copy.navLabel}>
          {copy.nav.map((label, index) => {
            const Icon = navIcons[index];
            const sectionId = sectionIds[index];
            return <a className={activeSection === sectionId ? 'is-active' : undefined} href={`#${sectionId}`} key={sectionId} aria-current={activeSection === sectionId ? 'location' : undefined} onClick={() => setActiveSection(sectionId)}><Icon aria-hidden="true" />{label}</a>;
          })}
        </nav>
        <div className="header-tools">
          <a className="header-cv" href={cvHref} download aria-label={cvDownloadLabel}><Download size={14} /> {language === 'de' ? 'Lebenslauf' : 'CV'}</a>
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
          <div className="eyebrow"><MapPin size={14} /> {copy.location}</div>
          <p className="role-line">{copy.role}</p>
          <p className="stack-line">{copy.stack}</p>
          <h1>{copy.headline[0]}<br /><em>{copy.headline[1]}</em></h1>
          <p className="hero-lead">{copy.hero}</p>
          <div className="hero-actions">
            <a className={buttonVariants({ size: 'lg' })} href="#projects" style={{ color: 'white' }}>{copy.viewWork} <ArrowDownRight /></a>
            <a className="hero-github" href={githubUrl} target="_blank" rel="noreferrer"><Code2 /> GitHub <ArrowUpRight /></a>
            <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href={cvHref} download>{copy.downloadCv} <Download /></a>
          </div>
          <div className="hero-availability">
            <p className="section-kicker">{copy.lookingFor}</p>
            <p>{copy.roles}</p>
            <p>{copy.preferred}</p>
          </div>
          <div className="social-links">
            <a href={githubUrl} target="_blank" rel="noreferrer"><Code2 /> GitHub</a>
            <a href={linkedInUrl} target="_blank" rel="noreferrer"><BriefcaseBusiness /> LinkedIn</a>
            <a href={cvHref} download><Download /> {cvDownloadLabel}</a>
          </div>
        </div>

        <aside className="hero-aside">
          <figure className="profile-photo">
            <img src="/yasser-akanni-profile.png" alt="Yasser Akanni" width={1462} height={1436} />
            <figcaption className="speech-bubble"><span>{introduction}</span></figcaption>
          </figure>
          <div className="practice-map" aria-label={copy.processTitle}>
          <div className="map-header"><span>{copy.processTitle}</span></div>
          <ol>
            {processSteps[language].map(([number, title, detail], index) => (
              <li className={index === processSteps[language].length - 1 ? 'is-complete' : undefined} key={number}><span className="step-progress" aria-hidden="true"><i /></span><div><strong>{title}</strong><small>{detail}</small></div></li>
            ))}
          </ol>
          <div className="map-footer"><span>{copy.primaryFocus}</span><strong>{copy.frontendDevelopment}</strong></div>
          </div>
        </aside>
      </section>

      <section className="section projects-section" id="projects" data-section="01">
        <div className="section-heading">
          <p className="section-kicker">{copy.projectsKicker}</p>
          <h2>{copy.projectsTitle[0]}<br />{copy.projectsTitle[1]}</h2>
          <p>{copy.projectsIntro}</p>
        </div>

        <div className="project-list">
          {projects.map((project) => {
            const content = projectCopy[project.slug][language];
            return (
              <article className={`project-card${project.slug === 'penee' ? ' featured-project' : ''}`} id={`project-${project.slug}`} key={project.slug}>
                <div className="project-number">{content.label.slice(0, 2)}</div>
                <div className="project-copy">
                  <div className="project-meta">
                    <span>{project.status}{project.status === 'Live' && <i className="live-dot" aria-label="Online" />}</span>
                    {project.slug === 'cosmic-styles' && <span>{content.label.replace(/^03 · /, '')}</span>}
                  </div>
                  <h3>{project.name}</h3>
                  <p>{content.summary}</p>
                  <div className="outcome-badges" aria-label={language === 'de' ? 'Projektergebnisse' : 'Project outcomes'}>
                    {content.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}
                  </div>
                  <ul className="project-highlights" aria-label={`${project.name} ${language === 'de' ? 'Highlights' : 'highlights'}`}>
                    {content.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <ul className="tech-list" aria-label={`${project.name} ${language === 'de' ? 'Technologien' : 'technologies'}`}>
                    {project.technologies.slice(0, 6).map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <a
                        className={link.kind === 'live' ? buttonVariants({ variant: 'default' }) : 'text-link'}
                        style={link.kind === 'live' ? { color: 'white' } : undefined}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        key={link.kind}
                      >
                        {link.kind === 'live' ? copy.liveDemo : copy.sourceCode}{link.kind === 'live' && <i className="live-dot" aria-label="Online" />} <ArrowUpRight />
                      </a>
                    ))}
                    <a className="text-link case-study-link" href={`/projects/${project.slug}?lang=${language}`}>
                      {copy.caseStudy} <ArrowUpRight />
                    </a>
                  </div>
                </div>
                <figure className="project-preview">
                  <img src={project.image} alt={content.imageAlt} width={1440} height={900} loading={project.slug === 'penee' ? 'eager' : 'lazy'} />
                </figure>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section skills-section" id="skills" data-section="02">
        <div className="section-heading compact">
          <p className="section-kicker">{copy.skillsKicker}</p>
          <h2>{copy.skillsTitle}</h2>
          <p>{copy.skillsIntro}</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group, index) => {
            const Icon = skillIcons[index];
            return (
              <article className="skill-group" key={group.title.en}>
                <div className="skill-title"><Icon /><h3>{group.title[language]}</h3></div>
                <p>{group.skills.join(' · ')}</p>
                {group.evidence && <small><strong>{copy.evidence}:</strong> {group.evidence[language]}</small>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section about-section" id="about" data-section="03">
        <div className="about-title">
          <p className="section-kicker">{copy.aboutKicker}</p>
          <h2>{copy.aboutTitle[0]}<br /><em>{copy.aboutTitle[1]}</em></h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">{copy.aboutLead}</p>
          <p>{copy.aboutBody}</p>
          <p>{copy.aboutTraining}</p>
          <div className="about-principle"><ShieldCheck /><p><strong>{copy.perspective}</strong><br />{copy.perspectiveBody}</p></div>
          <div className="strengths" aria-label={language === 'de' ? 'Stärken' : 'Strengths'}>
            {strengths[language].map((strength) => <span key={strength}>{strength}</span>)}
          </div>
        </div>
      </section>

      <section className="section experience-section" id="experience" data-section="04">
        <div className="experience-heading">
          <p className="section-kicker">{copy.experienceKicker}</p>
          <h2>{copy.experienceTitle[0]}<br /><em>{copy.experienceTitle[1]}</em></h2>
          <p>{copy.experienceIntro}</p>
        </div>
        <div className="timeline">
          {experience.map((item, index) => (
            <article className={`timeline-item${index === 0 ? ' featured' : ''}`} key={item.title}>
              <div className="timeline-date">{item.date[language]}</div>
              <div>
                <p className="timeline-kind">{item.kind[language]}</p>
                <h3>{item.title}</h3>
                {item.org && <p className="timeline-org">{item.org}</p>}
                <p>{item.body[language]}</p>
                {item.modules && (
                  <ul className="module-list">
                    {item.modules.map(([units, module]) => <li key={`${units}-${module.en}`}><span>{units}</span>{module[language]}</li>)}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section certificates-section" id="qualifications" data-section="05">
        <div className="section-heading compact">
          <p className="section-kicker">{copy.qualificationsKicker}</p>
          <h2>{copy.qualificationsTitle}</h2>
          <p>{copy.qualificationsIntro}</p>
        </div>
        <div className="certificate-list">
          {qualifications.map((qualification) => (
            <article className="certificate-card" key={qualification.title}>
              <div className="certificate-header">
                <div className="certificate-badge"><Award aria-hidden="true" /></div>
                <div><p className="certificate-kind">{copy.certificate}</p><h3>{qualification.title}</h3></div>
              </div>
              <div className="certificate-meta"><span>{qualification.institution}</span><span>{qualification.date}</span></div>
              <p>{qualification.subject[language]}</p>
              <a className="certificate-link" href={qualification.href} target="_blank" rel="noreferrer">{copy.viewCertificate} <ArrowUpRight /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="section application-section" aria-labelledby="application-title" data-section="06">
        <div>
          <p className="section-kicker">{copy.applicationKicker}</p>
          <h2 id="application-title">{copy.applicationTitle}</h2>
        </div>
        <dl>
          {copy.applicationLabels.map((label, index) => (
            <div key={label}><dt>{label}</dt><dd>{copy.applicationValues[index]}</dd></div>
          ))}
        </dl>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="section-kicker">{copy.contactKicker}</p>
          <h2>{copy.contactTitle}</h2>
          <p>{copy.contactBody}</p>
          <address>
            <a href={`mailto:${contactEmail}`}><Mail /> {contactEmail}</a>
            <a href="tel:+4917612854755"><Phone /> {contactPhone}</a>
            <span><MapPin /> Essen · NRW</span>
          </address>
          <p className="work-status"><i aria-hidden="true" />{language === 'de' ? 'Bereit für neue Aufgaben' : 'Ready to work'}</p>
        </div>
        <ContactForm language={language} privacyText={copy.privacy} />
      </section>

    </main>
  );
}
