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

export default function Home() {
  const [language, setLanguage] = useState<Language>('de');
  const copy = portfolioCopy[language];

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

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={copy.homeLabel}>
          <span>YA</span>
          <span className="wordmark-name">Yasser Akanni</span>
        </a>
        <nav aria-label={copy.navLabel}>
          {copy.nav.map((label, index) => (
            <a href={`#${sectionIds[index]}`} key={sectionIds[index]}>{label}</a>
          ))}
        </nav>
        <div className="header-tools">
          <a className="availability" href={`mailto:${contactEmail}`}>
            <span aria-hidden="true" /> {copy.openRoles}
          </a>
          <fieldset className="language-switcher">
            <legend className="sr-only">{language === 'de' ? 'Sprache wählen' : 'Choose language'}</legend>
            <button type="button" aria-pressed={language === 'de'} onClick={() => setLanguage('de')}>DE</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
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
            <a className={buttonVariants({ size: 'lg' })} href="#projects">{copy.viewWork} <ArrowDownRight /></a>
            <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href="/Yasser-Akanni-CV-English.pdf" download>{copy.downloadCv} <Download /></a>
          </div>
          <div className="hero-availability">
            <p className="section-kicker">{copy.lookingFor}</p>
            <p>{copy.roles}</p>
            <p>{copy.preferred}</p>
          </div>
          <div className="social-links">
            <a href={githubUrl} target="_blank" rel="noreferrer"><Code2 /> GitHub</a>
            <a href={linkedInUrl} target="_blank" rel="noreferrer"><BriefcaseBusiness /> LinkedIn</a>
            <a href="/Yasser-Akanni-CV-English.pdf" download><Download /> {copy.cvLabel}</a>
          </div>
        </div>

        <aside className="practice-map" aria-label={copy.processTitle}>
          <div className="map-header"><span>{copy.processTitle}</span><span>01–04</span></div>
          <ol>
            {processSteps[language].map(([number, title, detail]) => (
              <li key={number}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div></li>
            ))}
          </ol>
          <div className="map-footer"><span>{copy.primaryFocus}</span><strong>{copy.frontendDevelopment}</strong></div>
        </aside>
      </section>

      <section className="section projects-section" id="projects">
        <div className="section-heading">
          <p className="section-kicker">{copy.projectsKicker}</p>
          <h2>{copy.projectsTitle[0]}<br />{copy.projectsTitle[1]}</h2>
          <p>{copy.projectsIntro}</p>
        </div>

        <div className="project-list">
          {projects.map((project) => {
            const content = projectCopy[project.slug][language];
            return (
              <article className="project-card" id={`project-${project.slug}`} key={project.slug}>
                <div className="project-number">{content.label.slice(0, 2)}</div>
                <div className="project-copy">
                  <div className="project-meta"><span>{content.label}</span><span>{project.status}</span></div>
                  <h3>{project.name}</h3>
                  <p>{content.summary}</p>
                  <ul className="tech-list" aria-label={`${project.name} ${language === 'de' ? 'Technologien' : 'technologies'}`}>
                    {project.technologies.slice(0, 6).map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                  <details className="project-case">
                    <summary>{copy.caseStudy}</summary>
                    <div className="case-grid">
                      <div><h4>{copy.problem}</h4><p>{content.problem}</p></div>
                      <div><h4>{copy.contribution}</h4><p>{content.contribution}</p></div>
                      <div className="decision-card"><h4>{copy.decision}</h4><p>{content.decision}</p></div>
                      <div><h4>{copy.implemented}</h4><ul>{content.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
                      <div className="architecture-line"><h4>{copy.architecture}</h4><p>{content.architecture}</p></div>
                    </div>
                  </details>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <a
                        className={link.label === 'Live demo' ? buttonVariants({ variant: 'default' }) : 'text-link'}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        key={link.label}
                      >
                        {link.label === 'Live demo' ? copy.liveDemo : copy.sourceCode} <ArrowUpRight />
                      </a>
                    ))}
                  </div>
                </div>
                <figure className="project-preview">
                  <img src={project.image} alt={content.imageAlt} width={1440} height={900} />
                </figure>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section skills-section" id="skills">
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

      <section className="section about-section" id="about">
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

      <section className="section experience-section" id="experience">
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

      <section className="section certificates-section" id="qualifications">
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

      <section className="section application-section" aria-labelledby="application-title">
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
            <span><MapPin /> Essen · Ruhrgebiet · NRW</span>
          </address>
        </div>
        <ContactForm language={language} privacyText={copy.privacy} />
      </section>

      <footer>
        <div><strong>Yasser Akanni</strong><span>Junior Frontend Developer · React · Next.js · TypeScript</span></div>
        <div className="footer-links">
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          <a href={linkedInUrl} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
          <a href="/Yasser-Akanni-CV-English.pdf" download>{copy.cvLabel} <Download /></a>
          <a href={`mailto:${contactEmail}`}>Email <Mail /></a>
          <a href="#contact">{language === 'de' ? 'Datenschutz' : 'Privacy'} <ShieldCheck /></a>
          <a href="#top">{copy.backToTop} <ArrowUpRight /></a>
        </div>
      </footer>
    </main>
  );
}
