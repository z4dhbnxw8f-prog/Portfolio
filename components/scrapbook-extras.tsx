'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import type { Language } from '@/lib/portfolio-content';

export function ThemeToggle({ language }: { language: Language }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let value = false;
      try { value = localStorage.getItem('ya-scrapbook-theme') === 'dark'; } catch { /* Storage is optional. */ }
      setDark(value); document.documentElement.dataset.scrapbookTheme = value ? 'dark' : 'light';
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <button type="button" className="theme-toggle" aria-pressed={dark} aria-label={language === 'de' ? 'Dunkelmodus' : 'Dark mode'} onClick={() => { const next = !dark; setDark(next); document.documentElement.dataset.scrapbookTheme = next ? 'dark' : 'light'; try { localStorage.setItem('ya-scrapbook-theme', next ? 'dark' : 'light'); } catch { /* Optional preference. */ } }}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}

export function HeroStickers({ language }: { language: Language }) {
  const bounds = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  return <div ref={bounds} className="hero-sticker-board"><span className="hand-note">{language === 'de' ? 'psst… verschieb mich ↘' : 'psst… drag me ↘'}</span>{['React ♥', 'made in Essen', 'UI + code'].map((text, index) => <motion.button className={`drag-sticker sticker-${index}`} type="button" key={text} drag={!reduced} dragConstraints={bounds} dragElastic={.15} dragMomentum={false} whileTap={reduced ? {} : { scale: 1.08, rotate: 0 }} aria-label={`${text} — ${language === 'de' ? 'ziehbarer Sticker' : 'draggable sticker'}`}>{text}</motion.button>)}</div>;
}

export function RandomStuff({ language }: { language: Language }) {
  const [mood, setMood] = useState(1);
  const moods = ['✦', '☺', '☻', '★'];
  return <section className="section random-section"><p className="section-kicker">{language === 'de' ? 'kleine extras' : 'random stuff'}</p><div className="random-widgets"><div className="random-widget"><span>{language === 'de' ? 'im portfolio' : 'in this little corner'}</span><strong>05</strong><p>{language === 'de' ? 'Projekte. Viel gelernt.' : 'projects. lots of learning.'}</p></div><button className="random-widget mood-widget" type="button" onClick={() => setMood((current) => { const next = current % moods.length + 1; document.documentElement.dataset.scrapbookMood = String(next); return next; })} aria-label={language === 'de' ? 'Seitenfarben wechseln' : 'Shuffle the page colors'}><span>{language === 'de' ? 'seitenstimmung — klick mich' : 'page mood — click to change'}</span><strong aria-hidden="true">{moods[mood - 1]}</strong><span aria-live="polite">{mood} / 4</span></button><div className="random-widget"><span>{language === 'de' ? 'standort' : 'home base'}</span><strong>ESSEN</strong><p>NRW, {language === 'de' ? 'Deutschland' : 'Germany'} ↗</p></div></div></section>;
}

export function PlayfulCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    let lastGlyphAt = 0;
    const move = (event: PointerEvent) => {
      if (!cursor.current || !trail.current || !media.matches) return;
      cursor.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      cursor.current.dataset.hover = String(event.target instanceof Element && !!event.target.closest('a, button'));
      cursor.current.style.opacity = '1';

      const now = performance.now();
      if (now - lastGlyphAt < 42) return;
      lastGlyphAt = now;
      const glyph = document.createElement('span');
      glyph.className = 'matrix-glyph';
      glyph.textContent = Array.from({ length: 3 }, () => Math.random() < .5 ? '0' : '1').join('\n');
      glyph.style.left = `${event.clientX + (Math.random() * 14 - 7)}px`;
      glyph.style.top = `${event.clientY + 6}px`;
      trail.current.appendChild(glyph);
      glyph.animate([{ opacity: .9, transform: 'translateY(-4px)' }, { opacity: 0, transform: 'translateY(34px)' }], { duration: 580, easing: 'ease-out' }).onfinish = () => glyph.remove();
    };
    const hide = () => { if (cursor.current) cursor.current.style.opacity = '0'; };
    window.addEventListener('pointermove', move); document.addEventListener('pointerleave', hide);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); };
  }, []);
  return <><div className="matrix-trail" ref={trail} aria-hidden="true" /><div className="playful-cursor" ref={cursor} aria-hidden="true"><span /></div></>;
}
