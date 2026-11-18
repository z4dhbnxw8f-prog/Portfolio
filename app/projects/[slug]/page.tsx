/* oxlint-disable next/no-img-element */
import type { Metadata } from 'next';
import { Check, Code2, Layers3 } from 'lucide-react';
import { notFound } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { CaseStudyHeader } from '@/components/case-study-header';
import { TechnologyIcon } from '@/components/technology-icon';
import { getProject, projects } from '@/lib/projects';
import { portfolioCopy, projectCopy, type Language } from '@/lib/portfolio-content';

type ProjectPageProps = { params: Promise<{ slug: string }>; searchParams?: Promise<{ lang?: string }> };

const projectScreens = {
  penee: [
    { src: '/projects/screens/penee-dashboard-laptop.png', alt: { en: 'Penee dashboard shown on a laptop', de: 'Penee-Dashboard auf einem Laptop' } },
    { src: '/projects/screens/penee-transactions-laptop.png', alt: { en: 'Penee transactions shown on a laptop', de: 'Penee-Kontoauszuege auf einem Laptop' } },
  ],
  itemvault: [
    { src: '/projects/screens/itemvault-features-laptop.png', alt: { en: 'ItemVault features shown on a laptop', de: 'ItemVault-Funktionen auf einem Laptop' } },
    { src: '/projects/screens/itemvault-inventory-laptop.png', alt: { en: 'ItemVault inventory shown on a laptop', de: 'ItemVault-Inventar auf einem Laptop' } },
  ],
  'cosmic-styles': [
    { src: '/projects/screens/cosmic-current.png', alt: { en: 'Current Cosmic Styles LLC homepage', de: 'Aktuelle Startseite von Cosmic Styles LLC' } },
  ],
  salesbook: [
    { src: '/projects/screens/salesbook-dashboard-redacted.png', alt: { en: 'Salesbook dashboard', de: 'Salesbook-Dashboard' } },
  ],
  'learn-yoruba': [
    { src: '/projects/screens/learn-yoruba.png', alt: { en: 'Learn Yoruba with Ykay homepage', de: 'Startseite von Learn Yoruba with Ykay' } },
  ],
} as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params, searchParams }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found' };
  const query = searchParams ? await searchParams : undefined;
  const language: Language = query?.lang === 'de' ? 'de' : 'en';
  const localized = projectCopy[slug]?.[language];
  const title = language === 'de' ? `${project.name} Fallstudie | Yasser Akanni` : `${project.name} Case Study | Yasser Akanni`;
  const description = localized?.summary ?? project.summary;
  const imageAlt = language === 'de'
    ? ({
      penee: 'Sicherer Login der persönlichen Finanzanwendung Penee',
      itemvault: 'Responsive Startseite der persönlichen Inventaranwendung ItemVault',
      'cosmic-styles': 'Responsive Barbershop-Website von Cosmic Styles LLC',
    }[slug] ?? project.imageAlt)
    : project.imageAlt;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: project.image, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const orderedProjects = projects;
  const projectIndex = orderedProjects.findIndex((item) => item.slug === slug);
  const previousProject = projectIndex > 0 ? orderedProjects[projectIndex - 1] : undefined;
  const nextProject = projectIndex < orderedProjects.length - 1 ? orderedProjects[projectIndex + 1] : undefined;
  const query = searchParams ? await searchParams : undefined;
  const language: Language = query?.lang === 'de' ? 'de' : 'en';
  const localized = projectCopy[slug]?.[language];
  const siteCopy = portfolioCopy[language];
  const localizedType = language === 'de'
    ? ({
      penee: 'Full-Stack-Finanzanwendung',
      itemvault: 'React-/Firebase-Webanwendung',
      'cosmic-styles': 'Freelance-Kundenprojekt',
      salesbook: 'Full-Stack-Verkaufs- und Lagerverwaltung',
      'learn-yoruba': 'Sprachunterrichts- und Tutorwebsite',
    }[slug] ?? project.type)
    : project.type;
  const screens = projectScreens[slug as keyof typeof projectScreens];
  const labels = language === 'de'
    ? { overview: 'Überblick', problem: 'Problem', contribution: 'Mein Beitrag', decision: 'Technische Entscheidung', features: 'Umgesetzte Funktionen', architecture: 'Architektur', technologies: 'Technologien', coreFeatures: 'Kernfunktionen', projectType: 'Projekttyp', technology: 'Technologie', allProjects: 'Alle Projekte', switchLanguage: 'English', nextProject: 'Nächstes Projekt', previousProject: 'Vorheriges Projekt', exploreProjects: 'Projekte entdecken' }
    : { overview: 'Overview', problem: 'Problem', contribution: 'My contribution', decision: 'Technical decision', features: 'Implemented functionality', architecture: 'Architecture', technologies: 'Technologies', coreFeatures: 'Core features', projectType: 'Project type', technology: 'Technology', allProjects: 'All projects', switchLanguage: 'Deutsch', nextProject: 'Next project', previousProject: 'Previous project', exploreProjects: 'Explore projects' };

  const narrative = [
    [labels.overview, localized?.summary ?? project.summary],
    [labels.problem, localized?.problem ?? project.problem],
    [labels.contribution, localized?.contribution ?? project.role],
    [labels.decision, localized?.decision ?? project.solutions],
    [labels.features, localized?.features.join(' · ') ?? project.features.join(' · ')],
    [labels.architecture, localized?.architecture ?? project.architecture],
  ];

  return (
    <main className="case-study cinematic scrapbook scrapbook-case" data-case-slug={slug}>
      <CaseStudyHeader language={language} slug={slug} />

      <section className="case-hero">
        <div>
          <p className="section-kicker">{project.status}{project.status === 'Live' && <i className="live-dot" aria-label="Online" />}</p>
          <h1>{project.name}</h1>
          <p className="case-intro">{localized?.summary ?? project.summary}</p>
          <div className="case-links">
            {project.links.map((link) => {
              const linkLabel = link.kind === 'live' ? siteCopy.liveDemo : siteCopy.sourceCode;
              return <a className={link.kind === 'live' ? `primary-action ${buttonVariants({ variant: 'default' })}` : buttonVariants({ variant: 'outline' })} key={link.kind} href={link.url} target="_blank" rel="noreferrer">{linkLabel}{link.kind === 'live' && <i className="live-dot" aria-label="Online" />} </a>;
            })}
          </div>
          <ul className="case-tech-tags">{project.technologies.map((tech) => <li key={tech}><TechnologyIcon name={tech} />{tech}</li>)}</ul>
        <div className="case-spec">
          <span>{labels.projectType}</span><strong>{localizedType}</strong>
          <span>{labels.technology}</span><strong>{project.technologies.slice(0, 4).join(' · ')}</strong>
        </div>
        </div>
        <figure className="case-featured-image" data-case-visual>
          <img src={screens[0].src} alt={screens[0].alt[language]} width={1800} height={1200} />
        </figure>
      </section>

      <section className="case-screens" aria-label={language === 'de' ? `${project.name} Ansichten` : `${project.name} screens`}>
        {screens.map((screen) => <figure className="case-image" key={screen.src}>
          <img src={screen.src} alt={screen.alt[language]} width={1800} height={1200} style={slug === 'salesbook' ? { objectFit: 'contain' } : undefined} />
        </figure>)}
      </section>

      <section className="case-body">
        <div className="case-narrative">
          {narrative.map(([title, copy]) => <article key={title}><p className="section-kicker">{title}</p><p>{copy}</p></article>)}
        </div>
        <aside className="case-sidebar">
          <div className="case-panel"><Code2 /><p className="section-kicker">{labels.technologies}</p><ul>{project.technologies.map((tech) => <li key={tech}><TechnologyIcon name={tech} />{language === 'de' && tech === 'Responsive Design' ? 'Responsives Design' : tech}</li>)}</ul></div>
          <div className="case-panel"><Layers3 /><p className="section-kicker">{labels.coreFeatures}</p><ul className="feature-list">{(localized?.features ?? project.features).map((feature) => <li key={feature}><Check />{feature}</li>)}</ul></div>
        </aside>
      </section>

      <section className="case-next">
        <p className="section-kicker">{previousProject && nextProject ? labels.exploreProjects : nextProject ? labels.nextProject : labels.previousProject}</p>
        <h2>{previousProject && nextProject ? labels.exploreProjects : (nextProject ?? previousProject)?.name}</h2>
        <div className="case-next-actions">
          {previousProject && <a className={`case-back-link case-previous-link ${buttonVariants({ variant: 'outline', size: 'lg' })}`} href={`/projects/${previousProject.slug}?lang=${language}`}> {labels.previousProject}: {previousProject.name}</a>}
          {nextProject && <a className={`case-back-link case-next-link ${buttonVariants({ variant: 'outline', size: 'lg' })}`} href={`/projects/${nextProject.slug}?lang=${language}`}>{labels.nextProject}: {nextProject.name} </a>}
        </div>
      </section>
    </main>
  );
}
