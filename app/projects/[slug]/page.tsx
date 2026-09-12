/* oxlint-disable next/no-img-element */
import type { Metadata } from 'next';
import { ArrowUpRight, Check, Code2, Download, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { getProject, projects } from '@/lib/projects';
import { portfolioCopy, projectCopy, type Language } from '@/lib/portfolio-content';

type ProjectPageProps = { params: Promise<{ slug: string }>; searchParams?: Promise<{ lang?: string }> };

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
  const query = searchParams ? await searchParams : undefined;
  const language: Language = query?.lang === 'de' ? 'de' : 'en';
  const localized = projectCopy[slug]?.[language];
  const siteCopy = portfolioCopy[language];
  const sectionIds = ['top', 'projects', 'skills', 'about', 'experience', 'qualifications', 'contact'];
  const cvHref = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';
  const localizedType = language === 'de'
    ? ({
      penee: 'Full-Stack-Finanzanwendung',
      itemvault: 'React-/Firebase-Webanwendung',
      'cosmic-styles': 'Freelance-Kundenprojekt',
    }[slug] ?? project.type)
    : project.type;
  const localizedAlt = language === 'de'
    ? ({
      penee: 'Sicherer Login der persönlichen Finanzanwendung Penee',
      itemvault: 'Responsive Startseite der persönlichen Inventaranwendung ItemVault',
      'cosmic-styles': 'Responsive Barbershop-Website von Cosmic Styles LLC',
    }[slug] ?? project.imageAlt)
    : project.imageAlt;
  const labels = language === 'de'
    ? { overview: 'Überblick', problem: 'Problem', contribution: 'Mein Beitrag', decision: 'Technische Entscheidung', features: 'Umgesetzte Funktionen', architecture: 'Architektur', technologies: 'Technologien', coreFeatures: 'Kernfunktionen', projectType: 'Projekttyp', technology: 'Technologie', home: 'Startseite', allProjects: 'Alle Projekte', switchLanguage: 'English', continue: 'Weiter entdecken', selection: 'Die vollständige Projektauswahl ansehen', back: 'Zurück zu Projekten' }
    : { overview: 'Overview', problem: 'Problem', contribution: 'My contribution', decision: 'Technical decision', features: 'Implemented functionality', architecture: 'Architecture', technologies: 'Technologies', coreFeatures: 'Core features', projectType: 'Project type', technology: 'Technology', home: 'Home', allProjects: 'All projects', switchLanguage: 'Deutsch', continue: 'Continue exploring', selection: 'See the complete project selection.', back: 'Back to projects' };

  const narrative = [
    [labels.overview, localized?.summary ?? project.summary],
    [labels.problem, localized?.problem ?? project.problem],
    [labels.contribution, localized?.contribution ?? project.role],
    [labels.decision, localized?.decision ?? project.solutions],
    [labels.features, localized?.features.join(' · ') ?? project.features.join(' · ')],
    [labels.architecture, localized?.architecture ?? project.architecture],
  ];

  return (
    <main className="case-study">
      <header className="site-header case-header">
        <Link className="wordmark" href={`/?lang=${language}#top`} aria-label={language === 'de' ? 'Zurück zum Portfolio von Yasser Akanni' : 'Back to Yasser Akanni portfolio'}><span>YA</span><span className="wordmark-name">Yasser Akanni</span></Link>
        <nav aria-label={siteCopy.navLabel}>
          {siteCopy.nav.map((label, index) => <Link href={`/?lang=${language}#${sectionIds[index]}`} key={sectionIds[index]}>{label}</Link>)}
        </nav>
        <div className="header-tools case-header-tools">
          <Link className="header-cv" href={cvHref} download><Download size={14} /> {language === 'de' ? 'Lebenslauf' : 'CV'}</Link>
          <div className="language-switcher" aria-label={language === 'de' ? 'Sprache wählen' : 'Choose language'}>
            <Link aria-current={language === 'de' ? 'page' : undefined} href={`/projects/${slug}?lang=de`}>DE</Link>
            <span aria-hidden="true">/</span>
            <Link aria-current={language === 'en' ? 'page' : undefined} href={`/projects/${slug}?lang=en`}>EN</Link>
          </div>
        </div>
      </header>

      <section className="case-hero">
        <div>
          <p className="section-kicker">{project.status}{project.status === 'Live' && <i className="live-dot" aria-label="Online" />}</p>
          <h1>{project.name}</h1>
          <p>{localized?.summary ?? project.summary}</p>
          <div className="case-links">
            {project.links.map((link) => {
              const linkLabel = link.kind === 'live' ? siteCopy.liveDemo : siteCopy.sourceCode;
              return <a className={buttonVariants({ variant: link.kind === 'live' ? 'default' : 'outline' })} key={link.kind} href={link.url} target="_blank" rel="noreferrer" style={link.kind === 'live' ? { color: 'white' } : undefined}>{linkLabel}{link.kind === 'live' && <i className="live-dot" aria-label="Online" />} <ArrowUpRight /></a>;
            })}
          </div>
        </div>
        <div className="case-spec">
          <span>{labels.projectType}</span><strong>{localizedType}</strong>
          <span>{labels.technology}</span><strong>{project.technologies.slice(0, 4).join(' · ')}</strong>
        </div>
      </section>

      <figure className="case-image">
        <img src={project.image} alt={localizedAlt} width={1440} height={900} />
      </figure>

      <section className="case-body">
        <div className="case-narrative">
          {narrative.map(([title, copy]) => <article key={title}><p className="section-kicker">{title}</p><p>{copy}</p></article>)}
        </div>
        <aside className="case-sidebar">
          <div className="case-panel"><Code2 /><p className="section-kicker">{labels.technologies}</p><ul>{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul></div>
          <div className="case-panel"><Layers3 /><p className="section-kicker">{labels.coreFeatures}</p><ul className="feature-list">{(localized?.features ?? project.features).map((feature) => <li key={feature}><Check />{feature}</li>)}</ul></div>
        </aside>
      </section>

      <section className="case-next">
        <p className="section-kicker">{labels.continue}</p>
        <h2>{labels.selection}</h2>
        <Link className={`case-back-link ${buttonVariants({ size: 'lg' })}`} href={`/?lang=${language}#projects`}>{labels.back} <ArrowUpRight /></Link>
      </section>
    </main>
  );
}
