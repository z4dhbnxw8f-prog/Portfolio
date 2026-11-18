'use client';

import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '@/lib/projects';
import { projectScreens } from '@/lib/project-screens';
import { portfolioCopy, projectCopy, type Language } from '@/lib/portfolio-content';
import { ProjectRouteLink } from '@/components/motion/project-route-link';

export function ProjectBento({ language }: { language: Language }) {
  return <div className="project-bento">{projects.map((project, index) => <BentoCard project={project} index={index} language={language} key={project.slug} />)}</div>;
}

function BentoCard({ project, index, language }: { project: Project; index: number; language: Language }) {
    const [selected, setSelected] = useState(0);
    const root = useRef<HTMLElement>(null);
    const previous = useRef(0);
    const copy = portfolioCopy[language];
    const content = projectCopy[project.slug][language];
    const images = projectScreens[project.slug as keyof typeof projectScreens];
    useLayoutEffect(() => {
      const node = root.current!;
      const layers = Array.from(node.querySelectorAll<HTMLElement>('.bento-image'));
      const old = previous.current;
      previous.current = selected;
      layers.forEach((layer, n) => { layer.hidden = n !== selected; });
      if (old === selected) return;
      const media = gsap.matchMedia();
      media.add({ motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
        const outgoing = layers[old];
        const incoming = layers[selected];
        if (!context.conditions?.motion) { outgoing.hidden = true; return; }
        outgoing.hidden = false;
        const forward = selected > old;
        const ctx = gsap.context(() => {
          gsap.timeline({ onComplete: () => { outgoing.hidden = true; } })
            .fromTo(outgoing, { xPercent: 0 }, { xPercent: forward ? -22 : 22, duration: .4, ease: 'power3.inOut' }, 0)
            .fromTo(incoming, { clipPath: forward ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)', duration: .42, ease: 'power3.inOut' }, 0)
            .fromTo(node.querySelector('h3'), { y: 7, opacity: .5 }, { y: 0, opacity: 1, duration: .15, clearProps: 'transform,opacity' }, .4);
        }, node);
        return () => ctx.revert();
      }, node);
      return () => media.revert();
    }, [selected]);

    useEffect(() => {
      if (images.length !== 1 || !root.current) return;
      const node = root.current;
      let ctx: gsap.Context | undefined;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (reduced.matches) return;
        ctx = gsap.context(() => {
          gsap.timeline()
            .fromTo(node.querySelector('.bento-image'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)', duration: .38, ease: 'power3.inOut' }, 0)
            .fromTo(node.querySelector('h3'), { y: 7, opacity: .5 }, { y: 0, opacity: 1, duration: .15, clearProps: 'transform,opacity' }, .36);
        }, node);
      }, { threshold: .1 });
      const stop = () => { if (reduced.matches) ctx?.revert(); };
      observer.observe(node); reduced.addEventListener('change', stop);
      return () => { observer.disconnect(); ctx?.revert(); reduced.removeEventListener('change', stop); };
    }, [images.length]);
    return <article ref={root} className="scrapbook-project" id={`project-${project.slug}`}>
      <div className="bento-project-top"><span>0{index + 1} / {project.status}</span><span aria-hidden="true">↗</span></div>
      <div className="showcase-visual"><ProjectRouteLink className="showcase-cover-link" slug={project.slug} href={`/projects/${project.slug}?lang=${language}`} aria-label={`${copy.caseStudy}: ${project.name}`} />{images.map((image, n) => <div key={image.src} className="bento-image" data-active-image={selected === n} hidden={selected !== n} aria-hidden={selected !== n}><Image unoptimized src={image.src} alt={image.alt[language]} width={1800} height={1200} loading="lazy" /></div>)}
      {images.length > 1 && <div className="bento-screens">{images.map((image, n) => <button key={image.src} type="button" data-screen={n} aria-pressed={selected === n} aria-label={image.alt[language]} onClick={() => setSelected(n)}>{n + 1}</button>)}</div>}</div>
      <div className="bento-project-copy"><p className="section-kicker">{content.label.slice(5)}</p><h3><ProjectRouteLink slug={project.slug} href={`/projects/${project.slug}?lang=${language}`}>{project.name}</ProjectRouteLink></h3><p>{content.summary}</p><ul className="bento-tags">{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul><div className="bento-project-links"><ProjectRouteLink slug={project.slug} href={`/projects/${project.slug}?lang=${language}`}>{copy.caseStudy} <ArrowUpRight size={15} /></ProjectRouteLink>{project.links.map((link) => <a key={link.kind} href={link.url} target="_blank" rel="noreferrer">{link.kind === 'live' ? copy.liveDemo : copy.sourceCode} ↗</a>)}</div><ProjectRouteLink className="bento-explore" slug={project.slug} href={`/projects/${project.slug}?lang=${language}`}>{language === 'de' ? 'Projekt öffnen' : 'Explore project'} ↗</ProjectRouteLink></div>
    </article>;
}
