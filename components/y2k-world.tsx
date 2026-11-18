'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, BookOpen, Check, ChevronLeft, ChevronRight, Globe, Mail, MessageCircle, Sparkles, X } from 'lucide-react';
import { projects, type Project } from '@/lib/projects';
import { portfolioCopy, projectCopy, skillGroups, type Language } from '@/lib/portfolio-content';
import { projectScreens } from '@/lib/project-screens';

type Entry = { name: string; message: string };

function AeroDialog({ label, className, onClose, children }: { label: string; className: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const node = ref.current!; const opener = document.activeElement as HTMLElement; const previous = document.body.style.overflow; node.showModal(); document.body.style.overflow = 'hidden'; return () => { node.close(); document.body.style.overflow = previous; opener?.focus({ preventScroll: true }); }; }, []);
  return <dialog ref={ref} className={`aero-world ${className}`} aria-label={label} onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }}>{children}</dialog>;
}

export default function Y2KWorld({ language, onExit }: { language: Language; onExit: () => void }) {
  const [visits, setVisits] = useState(1);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<string | null>(null);
  const [chat, setChat] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [saved, setSaved] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const reduced = useReducedMotion(); const de = language === 'de'; const copy = portfolioCopy[language];
  const initialized = useRef(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (initialized.current) return;
      initialized.current = true;
      try {
        const rawCount = Number(localStorage.getItem('ya-aero-visits'));
        const count = (Number.isSafeInteger(rawCount) && rawCount >= 0 ? rawCount : 0) + 1;
        setVisits(count); localStorage.setItem('ya-aero-visits', String(count));
        const raw = JSON.parse(localStorage.getItem('ya-aero-guestbook') ?? '[]');
        if (Array.isArray(raw)) setEntries(raw.filter((item: unknown): item is Entry => typeof item === 'object' && item !== null && 'name' in item && 'message' in item && typeof item.name === 'string' && typeof item.message === 'string').slice(-8));
        const seen = localStorage.getItem('ya-aero-boot');
        if (!seen && !matchMedia('(prefers-reduced-motion: reduce)').matches) setLoading(true);
        localStorage.setItem('ya-aero-boot', '1');
      } catch { setStorageAvailable(false); }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { if (!loading) return; const timer = setTimeout(() => setLoading(false), 900); return () => clearTimeout(timer); }, [loading]);
  const sign = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const rawName = data.get('name'); const rawMessage = data.get('message');
    const name = typeof rawName === 'string' ? rawName.trim().slice(0,40) : ''; const message = typeof rawMessage === 'string' ? rawMessage.trim().slice(0,180) : '';
    if (!name || !message) return;
    const next = [...entries, { name, message }].slice(-8); setEntries(next);
    try { localStorage.setItem('ya-aero-guestbook', JSON.stringify(next)); } catch { setStorageAvailable(false); }
    form.reset(); setSaved(true);
  };
  const selected = projects.find((item) => item.slug === project);
  const reveal = reduced ? {} : { initial: { opacity: .65, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: .45 } };
  return <AeroDialog className="aero-main-world" label="Yasser’s world wide web — Y2K mode" onClose={onExit}>
    <div className="aero-cloud cloud-one" aria-hidden="true" /><div className="aero-cloud cloud-two" aria-hidden="true" />
    <header className="aero-header"><a href="#aero-home"><Globe size={21} /> yasser.net<span>WORLD WIDE WEB</span></a><button type="button" className="aero-button aero-close" onClick={onExit} aria-label={de ? 'Zurück zum Hauptportfolio' : 'Back to main portfolio'}><X size={19} /></button></header>
    {loading && !reduced && <div className="aero-boot"><div className="aero-glass"><Globe size={34} /><h2>Connecting to the future…</h2><p>{de ? 'Dekoratives Intro. Keine echte Ladeanzeige.' : 'Decorative intro. Not a real loading indicator.'}</p><div className="aero-loading-track"><span /></div><button type="button" className="aero-button" onClick={() => setLoading(false)}>{de ? 'Überspringen' : 'Skip intro'} ↗</button></div></div>}
    <main className="aero-content"><section className="aero-hero" id="aero-home"><div className="aero-welcome"><Sparkles size={16} /> Welcome to my world wide web <Sparkles size={16} /></div><div className="aero-hero-layout"><div><p className="aero-eyebrow">CREATIVE HUMAN / FRONTEND DEVELOPER</p><h1 className="aero-chrome">YASSER<br />AKANNI<span>✦</span></h1><p className="aero-role">{copy.role} · {copy.location}</p><p>{copy.hero}</p><div className="aero-hero-actions"><a href="#aero-work" className="aero-button">{de ? 'Projekte entdecken' : 'Explore my apps'} <ArrowUpRight size={17} /></a><a href={de ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf'} className="aero-button aero-button-silver" download>{copy.downloadCv}</a></div><div className="aero-counter"><span>{de ? 'BESUCHE IN DIESEM BROWSER' : 'VISITS IN THIS BROWSER'}</span><output>{String(visits).padStart(6,'0')}</output></div></div><div className="aero-orbit"><motion.div className="aero-orb orb-aqua" animate={reduced ? {} : { y: [0,-16,0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} /><motion.div className="aero-orb orb-pink" animate={reduced ? {} : { y: [0,12,0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} /><span className="aero-flare flare-one" aria-hidden="true">✧</span><span className="aero-flare flare-two" aria-hidden="true">✦</span><figure className="aero-portrait aero-glass"><Image src="/yasser-akanni-profile-20261012.png" alt="Yasser Akanni" width={856} height={1836} /><figcaption>hello from Essen ☺</figcaption></figure></div></div></section>
    <div className="aero-marquee" aria-label="React · Next.js · TypeScript · UI/UX · PostgreSQL"><div aria-hidden="true">{[0,1].map((n) => <span key={n}>✦ REACT ✦ NEXT.JS ✦ TYPESCRIPT ✦ UI/UX ✦ POSTGRESQL ✦ MADE WITH CARE </span>)}</div></div>
    <motion.section className="aero-about aero-glass" {...reveal}><p className="aero-eyebrow">USER PROFILE / YASSER AKANNI</p><h2>{de ? 'der Mensch hinter dem Interface.' : 'the human behind the interface.'}</h2><div><p>{copy.aboutLead}</p><p>{copy.aboutBody} {copy.aboutTraining}</p></div></motion.section>
    <section className="aero-work" id="aero-work"><p className="aero-eyebrow">APPLICATION LIBRARY / 05 ITEMS</p><h2>{de ? 'kleine Icons. echte Projekte.' : 'little icons. real projects.'}</h2><div className="aero-app-grid">{projects.map((item,index) => <motion.button type="button" className={`aero-app app-${index}`} key={item.slug} onClick={() => setProject(item.slug)} whileHover={reduced ? {} : { y: -8, scale: 1.025 }} whileTap={reduced ? {} : { scale: .97 }} transition={{ type: 'spring', stiffness: 360, damping: 20 }}><span className="aero-app-icon"><span>{['P','IV','CS','SB','Y'][index]}</span><i aria-hidden="true">✦</i></span><strong>{item.name}</strong><small>{projectCopy[item.slug][language].label.slice(5)}</small></motion.button>)}</div></section>
    <motion.section className="aero-specs aero-glass" {...reveal}><p className="aero-eyebrow">TECHNICAL SPECIFICATIONS</p><h2>{de ? 'entwickelt für gute Interfaces.' : 'built for thoughtful interfaces.'}</h2><div className="aero-real-specs">{skillGroups.map((group) => <div key={group.title.en}><h3>{group.title[language]}</h3><p>{group.skills[language].join(' · ')}</p></div>)}</div><div className="aero-fun-specs"><span><strong>Creativity</strong>100 GB*</span><span><strong>Interface speed</strong>turbo*</span><span><strong>Good vibes</strong>enabled*</span></div><p className="aero-small">{de ? '* Spielerische Produktetiketten — keine gemessenen Kompetenzen oder Leistungswerte.' : '* Playful product labels — not measured skills or performance ratings.'}</p></motion.section>
    <section className="aero-bottom-grid"><motion.div className="aero-guestbook aero-glass" {...reveal}><div className="aero-widget-title"><BookOpen size={20} /><h2>{de ? 'Gästebuch' : 'guestbook'}</h2></div><p className="aero-small">{de ? 'Nur in deinem Browser. Nicht veröffentlicht oder hochgeladen.' : 'Only in your browser. Not published or uploaded.'}</p><div className="aero-guest-entries">{entries.length ? entries.map((entry,index) => <div key={`${index}-${entry.name}`}><strong>{entry.name}</strong><p>{entry.message}</p></div>) : <p>{de ? 'Noch keine Notizen. Hinterlasse ein kleines Hallo ♡' : 'No notes yet. Leave a little hello ♡'}</p>}</div><form onSubmit={sign}><label htmlFor="aero-guest-name">{de ? 'Name oder Alias' : 'Name or alias'}</label><input id="aero-guest-name" name="name" maxLength={40} required autoComplete="name" /><label htmlFor="aero-guest-message">{de ? 'Deine Notiz' : 'Your note'}</label><textarea id="aero-guest-message" name="message" maxLength={180} rows={3} required /><button type="submit" className="aero-button">{de ? 'Gästebuch signieren' : 'Sign guestbook'} <Check size={16} /></button></form>{saved && <output className="aero-save-status" aria-live="polite">{storageAvailable ? (de ? 'In diesem Browser gespeichert ♡' : 'Saved in this browser ♡') : (de ? 'Nur für diese Sitzung gespeichert.' : 'Saved for this session only.')}</output>}</motion.div>
    <motion.div className="aero-chat aero-glass" {...reveal}><div className="aero-chat-title"><MessageCircle size={20} /><strong>Yasser Messenger</strong><span>_ □ ×</span></div><div className="aero-chat-status"><span />{de ? 'Offen für neue Möglichkeiten' : 'Open to new opportunities'}</div><div className="aero-chat-message"><small>yasser says:</small><h2>{de ? 'lass uns reden ☺' : 'let’s talk ☺'}</h2><p>{copy.contactBody}</p></div><button type="button" className="aero-button" onClick={() => setChat(true)}><Mail size={17} />{de ? 'Gespräch beginnen' : 'Start conversation'}</button>{chat && <div className="aero-chat-reply"><p>{de ? 'Wähle einen echten Kontaktweg:' : 'Choose a real way to say hello:'}</p><a href="mailto:ressay93@outlook.com">ressay93@outlook.com ↗</a><a href="https://www.linkedin.com/in/yasser-akanni-4b15333b3/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer">GitHub ↗</a><a href="tel:+4917612854755">+49 176 12854755</a></div>}<p className="aero-small">{de ? 'Kein Live-Chat. Dein Mailprogramm oder die gewählte Website wird geöffnet.' : 'Not a live chat. Opens your email app or selected website.'}</p></motion.div></section>
    <footer className="aero-footer"><span>© Yasser Akanni / best viewed with a little optimism ✧</span><a href={`/datenschutz?lang=${language}`}>{de ? 'Datenschutz' : 'Privacy'}</a><button type="button" onClick={onExit}>{de ? 'Zurück zum Hauptportfolio' : 'Back to main portfolio'} ↗</button></footer></main>
    {selected && <AeroProject project={selected} language={language} onClose={() => setProject(null)} />}
  </AeroDialog>;
}

function AeroProject({ project, language, onClose }: { project: Project; language: Language; onClose: () => void }) {
  const [screen, setScreen] = useState(0); const images = projectScreens[project.slug as keyof typeof projectScreens]; const content = projectCopy[project.slug][language]; const copy = portfolioCopy[language]; const reduced = useReducedMotion();
  return <AeroDialog className="aero-project-panel" label={project.name} onClose={onClose}><header className="aero-project-title"><strong>{project.name}.app</strong><button type="button" className="aero-button aero-close" onClick={onClose} aria-label={language === 'de' ? 'Projekt schließen' : 'Close project'}><X size={19} /></button></header><div className="aero-project-body"><div className="aero-project-image"><motion.div key={images[screen].src} initial={reduced ? false : { opacity: .4 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .2 }}><Image src={images[screen].src} alt={images[screen].alt[language]} width={1800} height={1200} /></motion.div></div>{images.length > 1 && <div className="aero-image-controls"><button type="button" className="aero-button aero-button-silver" aria-label={language === 'de' ? 'Vorheriger Screenshot' : 'Previous screenshot'} onClick={() => setScreen((n) => (n + images.length - 1) % images.length)}><ChevronLeft size={18} /></button><output aria-live="polite">{screen+1} / {images.length}</output><button type="button" className="aero-button aero-button-silver" aria-label={language === 'de' ? 'Nächster Screenshot' : 'Next screenshot'} onClick={() => setScreen((n) => (n+1)%images.length)}><ChevronRight size={18} /></button></div>}<h2>{project.name}</h2><p>{content.summary}</p><div className="aero-project-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="aero-project-links"><a href={`/projects/${project.slug}?lang=${language}`} className="aero-button">{copy.caseStudy} ↗</a>{project.links.map((link) => <a key={link.kind} href={link.url} target="_blank" rel="noreferrer" className="aero-button aero-button-silver">{link.kind === 'live' ? copy.liveDemo : 'GitHub'} ↗</a>)}</div></div></AeroDialog>;
}
