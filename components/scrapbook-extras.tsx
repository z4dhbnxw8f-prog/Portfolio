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
  const [mood, setMood] = useState(0);
  const moods = ['✦', '☺', '☻', '★'];
  return <section className="section random-section"><p className="section-kicker">{language === 'de' ? 'kleine extras' : 'random stuff'}</p><div className="random-widgets"><div className="random-widget"><span>{language === 'de' ? 'im portfolio' : 'in this little corner'}</span><strong>05</strong><p>{language === 'de' ? 'Projekte. Viel gelernt.' : 'projects. lots of learning.'}</p></div><button className="random-widget mood-widget" type="button" onClick={() => setMood((current) => (current + 1) % moods.length)} aria-label={language === 'de' ? 'Seitenstimmung wechseln' : 'Change the page mood'}><span>{language === 'de' ? 'seitenstimmung — klick mich' : 'page mood — click to change'}</span><strong aria-hidden="true">{moods[mood]}</strong><span aria-live="polite">{mood + 1} / 4</span></button><div className="random-widget"><span>{language === 'de' ? 'standort' : 'home base'}</span><strong>ESSEN</strong><p>NRW, {language === 'de' ? 'Deutschland' : 'Germany'} ↗</p></div></div></section>;
}

export function PlayfulCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const move = (event: PointerEvent) => { if (!cursor.current || !media.matches) return; cursor.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`; cursor.current.dataset.hover = String(!!(event.target as Element).closest('a, button')); cursor.current.style.opacity = '1'; };
    const hide = () => { if (cursor.current) cursor.current.style.opacity = '0'; };
    window.addEventListener('pointermove', move); document.addEventListener('pointerleave', hide);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); };
  }, []);
  return <div className="playful-cursor" ref={cursor} aria-hidden="true"><span /></div>;
}
