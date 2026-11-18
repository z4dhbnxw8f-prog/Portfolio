'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import { projectScreens } from '@/lib/project-screens';
import { portfolioCopy, projectCopy, type Language } from '@/lib/portfolio-content';
import { ProjectRouteLink } from '@/components/motion/project-route-link';
import { TechnologyIcon } from '@/components/technology-icon';

export function ProjectSlideshow({ language }: { language: Language }) {
  const root = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [screens, setScreens] = useState<Record<string, number>>({});
  const previous = useRef(0);
  const direction = useRef(1);
  const suppressClick = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const copy = portfolioCopy[language];
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('ya-project-journey') ?? 'null');
      const index = projects.findIndex((project) => project.slug === saved?.slug);
      if (index >= 0) {
        previous.current = index;
        activeRef.current = index;
        setActive(index);
        const images = projectScreens[saved.slug as keyof typeof projectScreens];
        if (Number.isInteger(saved.screen) && saved.screen >= 0 && saved.screen < images.length) setScreens({ [saved.slug]: saved.screen });
      }
    } catch { /* The initial slide is the storage-free fallback. */ }
    setEnhanced(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    if (!enhanced || !root.current) return;
    const slides = Array.from(root.current.querySelectorAll<HTMLElement>('.showcase-slide'));
    const oldIndex = previous.current;
    previous.current = active;
    slides.forEach((slide, index) => { slide.hidden = index !== active; });
    const incoming = slides[active];
    const outgoing = slides[oldIndex];
    if (oldIndex === active) return;
    const finish = () => {
      slides.forEach((slide, index) => { slide.hidden = index !== activeRef.current; });
    };
    // Move focus out of an outgoing slide before making it inaccessible.
    if (outgoing.contains(document.activeElement)) root.current.focus({ preventScroll: true });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    outgoing.hidden = false;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const sign = direction.current;
        gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish })
          .fromTo(outgoing, { opacity: 1 }, { opacity: 0, duration: .35 }, 0)
          .fromTo(outgoing.querySelector('.showcase-image'), { xPercent: 0, scale: 1 }, { xPercent: -sign * 18, scale: .98, duration: .55 }, 0)
          .fromTo(incoming, { opacity: 1 }, { opacity: 1, duration: .6 }, 0)
          .fromTo(incoming.querySelector('.showcase-visual'), { clipPath: sign > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)', duration: .6, ease: 'power3.inOut' }, 0)
          .fromTo(incoming.querySelector('.showcase-image'), { xPercent: sign * 10, scale: 1.04 }, { xPercent: 0, scale: 1, duration: .6 }, 0)
          .fromTo(incoming.querySelector('.showcase-number'), { y: sign * 15, opacity: 0 }, { y: 0, opacity: 1, duration: .32 }, .08)
          .fromTo(incoming.querySelector('h3'), { yPercent: sign * 100 }, { yPercent: 0, duration: .36 }, .14)
          .fromTo(incoming.querySelector('.showcase-description'), { y: sign * 12, opacity: 0 }, { y: 0, opacity: 1, duration: .35 }, .22)
          .fromTo(incoming.querySelectorAll('.showcase-detail, .showcase-links'), { opacity: 0 }, { opacity: 1, duration: .25 }, .3)
          .fromTo(root.current!.querySelector('[aria-current="true"] .showcase-progress-fill'), { scaleX: 0 }, { scaleX: 1, duration: .6 }, 0);
      }, root);
      return () => { ctx.revert(); finish(); };
    });
    return () => media.revert();
  }, [active, enhanced]);

  const select = (next: number, sign = next > activeRef.current ? 1 : -1) => {
    const normalized = (next + projects.length) % projects.length;
    if (normalized === activeRef.current) return;
    direction.current = sign;
    activeRef.current = normalized;
    setActive(normalized);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.metaKey || event.ctrlKey || (event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    const current = activeRef.current;
    const next = event.key === 'ArrowRight' ? (current + 1) % projects.length : event.key === 'ArrowLeft' ? (current + projects.length - 1) % projects.length : event.key === 'Home' ? 0 : event.key === 'End' ? projects.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    select(next, event.key === 'ArrowLeft' || event.key === 'Home' ? -1 : 1);
  };

  // WAI carousel region is focusable so arrow keys work without moving through every link.
  // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
  return <section ref={root} className={`project-showcase${enhanced ? ' is-enhanced' : ''}`} aria-roledescription={language === 'de' ? 'Karussell' : 'carousel'} aria-label={copy.projectsKicker} tabIndex={0} onKeyDown={onKeyDown}>
    <div className="showcase-toolbar"><span>{language === 'de' ? 'FÜNF PROJEKTE. FÜNF PERSPEKTIVEN.' : 'FIVE PROJECTS. FIVE PERSPECTIVES.'}</span><span>{String(active + 1).padStart(2, '0')} / 05</span></div>
    <div className="showcase-stage" onTouchStart={(event) => {
      if ((event.target as HTMLElement).closest('button, a:not([data-project-route])') || event.touches.length !== 1) { touch.current = null; return; }
      suppressClick.current = false;
      touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={(event) => {
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      touch.current = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) { suppressClick.current = true; select((activeRef.current + (dx < 0 ? 1 : -1) + projects.length) % projects.length, dx < 0 ? 1 : -1); } 
    }}>
      {projects.map((project, index) => {
        const content = projectCopy[project.slug][language];
        const images = projectScreens[project.slug as keyof typeof projectScreens];
        const imageIndex = screens[project.slug] ?? 0;
        const screen = images[imageIndex];
        // WAI carousel slides use a named group and slide roledescription.
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        return <article className="showcase-slide" id={`project-${project.slug}`} key={project.slug} role="group" aria-roledescription={language === 'de' ? 'Folie' : 'slide'} aria-label={`${index + 1} / 5: ${project.name}`} aria-hidden={enhanced && index !== active ? true : undefined} inert={enhanced && index !== active ? true : undefined} hidden={enhanced && index !== active}>
          <div className="showcase-visual"><ProjectRouteLink className="showcase-cover-link" slug={project.slug} href={`/projects/${project.slug}?lang=${language}`} aria-label={`${copy.caseStudy}: ${project.name}`} onClick={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }} /><Image unoptimized className="showcase-image" src={screen.src} alt={screen.alt[language]} width={1800} height={1200} loading={index === 0 ? 'eager' : 'lazy'} draggable={false} />
            <div className="showcase-image-tools"><ProjectRouteLink slug={project.slug} href={`/projects/${project.slug}?lang=${language}`}>{language === 'de' ? 'Projekt öffnen' : 'Explore project'} <ArrowUpRight size={16} /></ProjectRouteLink>
              {images.length > 1 && <div className="showcase-screen-picker" aria-label={language === 'de' ? 'Screenshots' : 'Screenshots'}>{images.map((image, n) => <button type="button" key={image.src} data-screen={n} aria-label={image.alt[language]} aria-pressed={n === imageIndex} onClick={() => setScreens((current) => ({ ...current, [project.slug]: n }))}>{String(n + 1).padStart(2, '0')}</button>)}</div>}
            </div>
          </div>
          <div className="showcase-copy"><div className="showcase-meta"><span className="showcase-number">{String(index + 1).padStart(2, '0')}</span><span>{content.label.slice(5)} <i className="live-dot" aria-label="Online" /></span></div>
            <div className="showcase-title-mask"><h3><ProjectRouteLink slug={project.slug} href={`/projects/${project.slug}?lang=${language}`}>{project.name}</ProjectRouteLink></h3></div>
            <p className="showcase-description">{content.summary}</p>
            <div className="showcase-detail"><div className="outcome-badges">{content.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}</div><ul className="project-highlights">{content.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}</ul><ul className="tech-list">{project.technologies.map((tech) => <li key={tech}><TechnologyIcon name={tech} />{tech}</li>)}</ul></div>
            <div className="showcase-links">{project.links.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.kind}>{link.kind === 'live' ? copy.liveDemo : copy.sourceCode} <ArrowUpRight size={15} /></a>)}<ProjectRouteLink slug={project.slug} href={`/projects/${project.slug}?lang=${language}`}>{copy.caseStudy} <ArrowUpRight size={15} /></ProjectRouteLink></div>
          </div>
        </article>;
      })}
    </div>
    {enhanced && <div className="showcase-controls"><div className="showcase-progress" aria-label={language === 'de' ? 'Projekt wählen' : 'Choose project'}>{projects.map((project, index) => <button type="button" key={project.slug} aria-label={`${index + 1}: ${project.name}`} aria-current={index === active ? 'true' : undefined} onClick={() => select(index)}><span className="showcase-progress-track"><span className="showcase-progress-fill" /></span><span>{String(index + 1).padStart(2, '0')}</span><span className="showcase-progress-name">{project.name}</span></button>)}</div><div className="showcase-arrows"><button type="button" onClick={() => select((activeRef.current + 4) % 5, -1)} aria-label={language === 'de' ? 'Vorheriges Projekt' : 'Previous project'}><ChevronLeft /></button><button type="button" className="showcase-next" onClick={() => select((activeRef.current + 1) % 5, 1)} aria-label={language === 'de' ? 'Nächstes Projekt' : 'Next project'}><ChevronRight /></button></div></div>}
    <p className="sr-only" aria-live="polite" aria-atomic="true">{enhanced ? `${active + 1} / 5: ${projects[active].name}` : ''}</p>
    {enhanced && <p className="showcase-hint">{language === 'de' ? 'Pfeiltasten ← → oder wischen · Kein automatischer Wechsel' : 'Arrow keys ← → or swipe to explore · No autoplay'}</p>}
  </section>;
}
