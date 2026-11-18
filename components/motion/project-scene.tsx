'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { X, ArrowUpRight } from 'lucide-react';
import { projectCopy, type Language } from '@/lib/portfolio-content';
import type { Project } from '@/lib/projects';

export function ProjectScene({ project, language, origin, onClose }: { project: Project; language: Language; origin: RefObject<HTMLElement | null>; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = projectCopy[project.slug][language];
  const closeRef = useRef<() => void>(() => {});
  useEffect(() => {
    const node = dialog.current!;
    const trigger = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rect = origin.current?.getBoundingClientRect();
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('.scene-panel', { y: rect ? rect.top - window.innerHeight * .05 : 40, scale: .85, opacity: 0, duration: .65, ease: 'power3.out' });
        gsap.from('.scene-copy > *', { y: 25, opacity: 0, stagger: .06, delay: .25, duration: .5 });
      }
    }, node);
    let closing = false;
    closeRef.current = () => {
      if (closing) return;
      closing = true;
      const finish = () => { node.close(); onClose(); };
      if (reduced) finish();
      else gsap.to(node.querySelector('.scene-panel'), { y: 35, scale: .96, opacity: 0, duration: .3, onComplete: finish });
    };
    return () => { ctx.revert(); document.body.style.overflow = previousOverflow; trigger?.focus({ preventScroll: true }); };
  }, [project, origin, onClose]);
  return <dialog ref={dialog} className="project-scene" aria-labelledby="scene-title" onCancel={(event) => { event.preventDefault(); closeRef.current(); }} onClick={(event) => { if (event.target === event.currentTarget) closeRef.current(); }}>
    <div className="scene-panel">
      <button className="scene-close" autoFocus onClick={() => closeRef.current()} aria-label={language === 'de' ? 'Projekt schließen' : 'Close project'}><X /></button>
      <img className="scene-image" src={project.image} alt={content.imageAlt} width={1800} height={1200} />
      <div className="scene-copy"><p className="section-kicker">{content.label}</p><h2 id="scene-title">{project.name}</h2><p>{content.summary}</p>
        <div className="scene-facts">{[[language === 'de' ? 'Mein Beitrag' : 'My contribution', content.contribution], [language === 'de' ? 'Technische Entscheidung' : 'Technical decision', content.decision]].map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div>
        <ul className="tech-list">{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <div className="project-links">{project.links.map((link) => <a className="text-link" href={link.url} target="_blank" rel="noreferrer" key={link.kind}>{link.kind === 'live' ? 'Live demo' : 'GitHub'} <ArrowUpRight size={16} /></a>)}<a className="text-link" href={`/projects/${project.slug}?lang=${language}`}>{language === 'de' ? 'Vollständige Fallstudie' : 'Full case study'} <ArrowUpRight size={16} /></a></div>
      </div>
    </div>
  </dialog>;
}
