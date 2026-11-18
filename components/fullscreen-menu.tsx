'use client';

import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import gsap from 'gsap';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PortfolioModesButton } from '@/components/portfolio-modes';
import { portfolioCopy, type Language } from '@/lib/portfolio-content';

const sections = ['top', 'projects', 'skills', 'about', 'contact'];

type Props = {
  language: Language;
  activeSection?: string;
  onLanguageChange?: (language: Language) => void;
  languageUrls?: { de: string; en: string };
  homeUrl?: string;
};

export function FullscreenMenu({ language, activeSection = 'top', onLanguageChange, languageUrls, homeUrl = '' }: Props) {
  const id = useId();
  const opener = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const closing = useRef(false);
  const exit = useRef<gsap.core.Timeline | null>(null);
  const copy = portfolioCopy[language];

  useEffect(() => {
    if (!open) return;
    const node = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    closing.current = false;
    node.showModal();
    document.body.style.overflow = 'hidden';
    node.querySelector<HTMLAnchorElement>('[aria-current="location"]')?.focus({ preventScroll: true });
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      if (context.conditions?.motion) {
        gsap.fromTo(node, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .65, ease: 'power3.inOut' });
        gsap.fromTo(node.querySelectorAll('.menu-link-inner'), { yPercent: 115, rotate: 2 }, { yPercent: 0, rotate: 0, stagger: .065, duration: .7, delay: .2, ease: 'power3.out' });
        gsap.fromTo(node.querySelectorAll('.menu-top, .menu-bottom, .menu-aside'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .05, duration: .4, delay: .35 });
        gsap.to(node.querySelector('.menu-orb'), { xPercent: 12, yPercent: -10, rotation: 25, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      } else {
        exit.current?.progress(1);
        gsap.set(node, { clipPath: 'none' });
      }
    }, node);
    return () => {
      exit.current?.kill();
      media.revert();
      node.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = (section?: string, href?: string) => {
    if (closing.current) return;
    closing.current = true;
    const node = dialog.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = section && !homeUrl ? document.getElementById(section) : null;
    const move = () => {
      if (!target) return;
      const offset = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 84;
      window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - offset, behavior: 'instant' });
      history.pushState(null, '', `#${section}`);
    };
    const finish = () => {
      node.close();
      setOpen(false);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      } else if (href) window.location.assign(href);
      else opener.current?.focus({ preventScroll: true });
    };
    if (reduced) { move(); finish(); return; }
    gsap.killTweensOf([node, ...node.querySelectorAll('.menu-link-inner, .menu-top, .menu-bottom, .menu-aside')]);
    exit.current = gsap.timeline({ onComplete: finish })
      .to(node.querySelectorAll('.menu-link-inner'), { yPercent: -110, stagger: .025, duration: .25, ease: 'power2.in' }, 0)
      .call(move, [], .2)
      .to(node, { clipPath: 'inset(0 0 100% 0)', duration: .5, ease: 'power3.inOut' }, .15);
  };
  const select = (event: MouseEvent<HTMLAnchorElement>, section: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    close(section, event.currentTarget.href);
  };

  return <>
    <button className="cinematic-menu-trigger" ref={opener} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}><span>{language === 'de' ? 'Menü' : 'Menu'}</span><Menu size={17} /></button>
    <dialog ref={dialog} id={id} className="cinematic-menu" aria-label={copy.navLabel} onCancel={(event) => { event.preventDefault(); close(); }}>
      <div className="menu-orb" aria-hidden="true" /><div className="menu-grid" aria-hidden="true" />
      <div className="menu-top"><span>YASSER AKANNI<span className="menu-accent">®</span></span><button className="menu-close" type="button" autoFocus onClick={() => close()} aria-label={language === 'de' ? 'Menü schließen' : 'Close menu'}>{language === 'de' ? 'Schließen' : 'Close'}<X size={20} /></button></div>
      <div className="menu-layout"><nav className="fullscreen-navigation" aria-label={copy.navLabel}>
        {sections.map((section, index) => <a href={`${homeUrl}#${section}`} key={section} className="menu-section-link" aria-current={activeSection === section ? 'location' : undefined} onClick={(event) => select(event, section)}><span className="menu-link-inner"><span className="menu-link-number">{String(index + 1).padStart(2, '0')}</span><span className="menu-link-label">{copy.nav[index]}</span><ArrowUpRight className="menu-link-arrow" aria-hidden="true" /></span></a>)}
      </nav><aside className="menu-aside"><PortfolioModesButton language={language} placement="menu" beforeOpen={() => { dialog.current?.close(); setOpen(false); }} /><span className="menu-eyebrow">{language === 'de' ? 'AKTUELLER ABSCHNITT' : 'CURRENT CHAPTER'}</span><span className="menu-current">{String(Math.max(0, sections.indexOf(activeSection)) + 1).padStart(2, '0')}<small> / 05</small></span><p>{copy.location}<br />{copy.stack}</p><a href="mailto:ressay93@outlook.com">{copy.hireMe} ↗</a></aside></div>
      <div className="menu-bottom"><span>DESIGN × DEVELOPMENT / 2026</span><fieldset className="menu-languages"><legend className="sr-only">{language === 'de' ? 'Sprache wählen' : 'Choose language'}</legend>{(['de', 'en'] as const).map((lang) => onLanguageChange ? <button type="button" key={lang} aria-pressed={language === lang} onClick={() => onLanguageChange(lang)}>{lang.toUpperCase()}</button> : <a href={languageUrls?.[lang] ?? `/?lang=${lang}`} aria-current={language === lang ? 'page' : undefined} key={lang}>{lang.toUpperCase()}</a>)}</fieldset></div>
    </dialog>
  </>;
}
