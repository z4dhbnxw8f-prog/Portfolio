/* oxlint-disable next/no-img-element */
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Check, Code2, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { getProject, projects } from '@/lib/projects';

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found' };
  return {
    title: `${project.name} Case Study | Yasser Akanni`,
    description: project.summary,
    openGraph: {
      title: `${project.name} Case Study | Yasser Akanni`,
      description: project.summary,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} Case Study | Yasser Akanni`,
      description: project.summary,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const narrative = [
    ['Overview', project.summary],
    ['Problem', project.problem],
    ['Goal', project.goal],
    ['My role', project.role],
    ['UX and design process', project.ux],
    ['Architecture', project.architecture],
    ['Challenges', project.challenges],
    ['Solutions', project.solutions],
    ['What I learned', project.learnings],
    ['Result', project.result],
  ];

  return (
    <main className="case-study">
      <header className="case-header">
        <Link className="wordmark" href="/" aria-label="Back to Yasser Akanni portfolio"><span>YA</span><span className="wordmark-name">Yasser Akanni</span></Link>
        <Link className={buttonVariants({ variant: 'outline' })} href="/#projects"><ArrowLeft /> All projects</Link>
      </header>

      <section className="case-hero">
        <div>
          <p className="section-kicker">{project.kicker} · {project.status}</p>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          <div className="case-links">
            {project.links.map((link) => <a className={buttonVariants({ variant: link.label === 'Live demo' ? 'default' : 'outline' })} key={link.label} href={link.url} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight /></a>)}
          </div>
        </div>
        <div className="case-spec">
          <span>Project type</span><strong>{project.type}</strong>
          <span>Technology</span><strong>{project.technologies.slice(0, 4).join(' · ')}</strong>
        </div>
      </section>

      <figure className="case-image">
        <img src={project.image} alt={project.imageAlt} width={1440} height={900} />
      </figure>

      <section className="case-body">
        <div className="case-narrative">
          {narrative.map(([title, copy]) => <article key={title}><p className="section-kicker">{title}</p><p>{copy}</p></article>)}
        </div>
        <aside className="case-sidebar">
          <div className="case-panel"><Code2 /><p className="section-kicker">Technologies</p><ul>{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul></div>
          <div className="case-panel"><Layers3 /><p className="section-kicker">Core features</p><ul className="feature-list">{project.features.map((feature) => <li key={feature}><Check />{feature}</li>)}</ul></div>
        </aside>
      </section>

      <section className="case-next">
        <p className="section-kicker">Continue exploring</p>
        <h2>See the complete project selection.</h2>
        <Link className={buttonVariants({ size: 'lg' })} href="/#projects">Back to projects <ArrowUpRight /></Link>
      </section>
    </main>
  );
}
