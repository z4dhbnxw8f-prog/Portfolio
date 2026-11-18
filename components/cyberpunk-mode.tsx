'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Command, Search, Terminal, X } from 'lucide-react';
import { projects } from '@/lib/projects';
import { projectScreens } from '@/lib/project-screens';
import { portfolioCopy, projectCopy, skillGroups, type Language } from '@/lib/portfolio-content';

export default function CyberpunkMode({ language, onExit }: { language: Language; onExit: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const palette = useRef<HTMLDialogElement>(null);
  const paletteInput = useRef<HTMLInputElement>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const [typed, setTyped] = useState('');
  const [command, setCommand] = useState('');
  const [contact, setContact] = useState(false);
  const [response, setResponse] = useState('');
  const [uptime, setUptime] = useState(0);
  const reduced = useReducedMotion();
  const de = language === 'de';
  const copy = portfolioCopy[language];
  const intro = "> hello, world. i'm Yasser Akanni";
  const sections = [{ id: 'cyber-home', name: de ? 'Start' : 'Home', code: '01' }, { id: 'cyber-about', name: de ? 'Über mich' : 'About', code: '02' }, { id: 'cyber-projects', name: de ? 'Fallakten / Projekte' : 'Case files / Projects', code: '03' }, { id: 'cyber-skills', name: de ? 'Systemstatus / Kompetenzen' : 'System status / Skills', code: '04' }, { id: 'cyber-contact', name: de ? 'Kontakt' : 'Contact', code: '05' }];
  const filtered = sections.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const node = dialog.current!; const opener = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    const timer = setInterval(() => setUptime((value) => value + 1), 1000);
    const key = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      const editing = (event.target as HTMLElement).closest('input, textarea, [contenteditable=true]');
      if ((event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !editing)) {
        event.preventDefault(); setPaletteOpen((value) => !value);
      }
    };
    node.addEventListener('keydown', key);
    return () => { node.removeEventListener('keydown', key); clearInterval(timer); node.close(); document.body.style.overflow = overflow; opener?.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    if (reduced) return;
    let count = 0;
    const timer = setInterval(() => { count += 1; setTyped(intro.slice(0, count)); if (count >= intro.length) clearInterval(timer); }, 26);
    return () => clearInterval(timer);
  }, [reduced]);
  useEffect(() => {
    if (!paletteOpen) return;
    const node = palette.current!;
    node.showModal(); paletteInput.current?.focus();
    return () => node.close();
  }, [paletteOpen]);
  const jump = (id: string) => {
    setPaletteOpen(false);
    requestAnimationFrame(() => {
      const target = dialog.current?.querySelector<HTMLElement>(`#${id}`);
      target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      target?.focus({ preventScroll: true });
    });
  };
  const run = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = command.trim().toLowerCase();
    if (value === 'contact') { setContact(true); setResponse(de ? 'VERBINDUNG HERGESTELLT. Kontaktwege unten.' : 'CONNECTION ESTABLISHED. Contact channels below.'); }
    else if (value === 'help') setResponse(de ? 'Verfügbare Befehle: contact, help, clear' : 'Available commands: contact, help, clear');
    else if (value === 'clear') { setContact(false); setResponse(''); }
    else setResponse(de ? 'Unbekannter Befehl. Versuche contact oder help.' : 'Unknown command. Try contact or help.');
    setCommand('');
  };
  const ready = reduced || typed.length === intro.length;
  const reveal = reduced ? {} : { initial: { opacity: .6, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .1 }, transition: { duration: .35 } };
  return <dialog ref={dialog} className="cyber-mode" aria-label="Yasser / cyberpunk portfolio" onCancel={(event) => { event.preventDefault(); onExit(); }}>
    <div className="cyber-texture" aria-hidden="true" /><header className="cyber-header"><a href="#cyber-home" onClick={(event) => { event.preventDefault(); jump('cyber-home'); }}>Y/A<span>_ONLINE</span></a><div><button type="button" onClick={() => { setQuery(''); setHighlight(0); setPaletteOpen(true); }}><Command size={15} /><span>{de ? 'Navigation' : 'Navigate'}</span><kbd>⌘K /</kbd></button><button type="button" className="cyber-exit" autoFocus onClick={onExit} aria-label={de ? 'Zurück zum Hauptportfolio' : 'Back to main portfolio'}><X size={18} /></button></div></header>
    <main className="cyber-content"><section className="cyber-hero" id="cyber-home" tabIndex={-1}><p className="cyber-eyebrow">PORTFOLIO / ALT_03 / 2026</p><p className="cyber-terminal-intro"><span className="sr-only">{intro}</span><span aria-hidden="true">{reduced ? intro : typed}<span className="cyber-caret">▌</span></span></p><motion.div className="cyber-hero-layout" initial={false} animate={{ opacity: ready ? 1 : .45 }} transition={{ duration: reduced ? 0 : .25 }}><div><h1 className="cyber-glitch">YASSER<br /><span>AKANNI</span><i aria-hidden="true">.</i></h1><p className="cyber-role">{copy.role} / {copy.stack}</p><p>{copy.hero}</p><div className="cyber-actions"><button type="button" onClick={() => jump('cyber-projects')}>{de ? 'Fallakten öffnen' : 'Open case files'} <ArrowUpRight size={17} /></button><a href={de ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf'} download>{copy.downloadCv} ↗</a></div></div><figure className="cyber-portrait"><Image src="/images/cyberpunk/neon-samurai-rain.webp" alt="Yasser Akanni in a neon lit cyberpunk city at night" width={1400} height={788} /><figcaption>SUBJECT_001 / {copy.location}</figcaption></figure></motion.div></section>
    <motion.section className="cyber-about cyber-section" id="cyber-about" tabIndex={-1} {...reveal}><div className="cyber-section-label">02 / IDENTITY</div><div><h2 className="cyber-glitch">{de ? 'KEINE VORLAGE.' : 'NO DEFAULT TEMPLATE.'}</h2><p>{copy.aboutLead}</p><p>{copy.aboutBody}</p><p>{copy.aboutTraining}</p></div></motion.section>
    <section className="cyber-section" id="cyber-projects" tabIndex={-1}><div className="cyber-section-label">03 / CASE_FILES</div><h2 className="cyber-glitch">{de ? 'AUSGEWÄHLTE AKTEN' : 'SELECTED CASE FILES'}</h2><p className="cyber-file-hint">{de ? 'Hover, Fokus oder Tippen öffnet die Akte. Alle Links bleiben zugänglich.' : 'Hover, focus, or tap to open a file. All links stay accessible.'}</p><div className="cyber-files">{projects.map((project, index) => {
      const content = projectCopy[project.slug][language]; const image = projectScreens[project.slug as keyof typeof projectScreens][0];
      return <motion.article className="cyber-file" key={project.slug} {...reveal}><div className="cyber-file-heading"><span>FILE_00{index + 1}</span><span>PUBLIC / {project.status.toUpperCase()}</span></div><a href={`/projects/${project.slug}?lang=${language}`} className="cyber-file-image" aria-label={`${copy.caseStudy}: ${project.name}`}><Image src={image.src} alt={image.alt[language]} width={1800} height={1200} loading="lazy" /><span aria-hidden="true">OPEN FILE ↗</span></a><div className="cyber-file-copy"><p className="cyber-eyebrow">{content.label.slice(5)}</p><h3><a href={`/projects/${project.slug}?lang=${language}`}><span className="cyber-redacted">{project.name}</span></a></h3><p>{content.summary}</p><div className="cyber-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="cyber-file-links"><a href={`/projects/${project.slug}?lang=${language}`}>{copy.caseStudy} ↗</a>{project.links.map((link) => <a key={link.kind} href={link.url} target="_blank" rel="noreferrer">{link.kind === 'live' ? copy.liveDemo : 'GitHub'} ↗</a>)}</div></div></motion.article>;
    })}</div></section>
    <motion.section className="cyber-section" id="cyber-skills" tabIndex={-1} {...reveal}><div className="cyber-section-label">04 / SYSTEM_STATUS</div><h2 className="cyber-glitch">{de ? 'DER STACK' : 'THE STACK'}</h2><div className="cyber-telemetry"><div><span>SESSION UPTIME</span><strong>{String(Math.floor(uptime / 60)).padStart(2,'0')}:{String(uptime % 60).padStart(2,'0')}</strong><i /></div><div><span>COFFEE_LEVEL / SIMULATED</span><strong>87%</strong><i /></div><div><span>BUGS_SQUASHED / SIMULATED</span><strong>404</strong><i /></div></div><p className="cyber-sim-note">{de ? 'Spielerische Telemetrie. Kaffee und Bug-Zähler sind dekorativ, keine echten Leistungsdaten oder Kompetenzbewertungen.' : 'Playful telemetry. Coffee and bug counters are decorative, not real performance data or proficiency ratings.'}</p><div className="cyber-skill-grid">{skillGroups.map((group) => <div key={group.title.en}><h3>{group.title[language]}</h3><div className="cyber-tags">{group.skills[language].map((skill) => <span key={skill}>{skill}</span>)}</div></div>)}</div></motion.section>
    <section className="cyber-section cyber-contact" id="cyber-contact" tabIndex={-1}><div className="cyber-section-label">05 / CONNECT</div><h2 className="cyber-glitch">{de ? 'VERBINDUNG AUFBAUEN.' : 'ESTABLISH A CONNECTION.'}</h2><div className="cyber-contact-terminal"><div className="cyber-terminal-bar"><Terminal size={16} /> contact@portfolio:~</div><p>{de ? 'Tippe contact und drücke Enter. Oder klicke auf Ausführen.' : 'Type contact and press Enter. Or use Run contact below.'}</p><form onSubmit={run}><label htmlFor="cyber-command">yasser@web:~$</label><input id="cyber-command" value={command} onChange={(event) => setCommand(event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="contact" aria-label={de ? 'Terminalbefehl' : 'Terminal command'} /><button type="submit" aria-label={de ? 'Befehl ausführen' : 'Run command'}>↵</button></form><div className="cyber-command-help"><button type="button" onClick={() => { setContact(true); setResponse(de ? 'VERBINDUNG HERGESTELLT.' : 'CONNECTION ESTABLISHED.'); }}>{de ? 'contact ausführen' : 'Run contact'}</button><span>contact · help · clear</span></div><output className="cyber-terminal-response" aria-live="polite">{response}</output>{contact && <div className="cyber-contact-result"><a href="mailto:ressay93@outlook.com">EMAIL → ressay93@outlook.com</a><a href="tel:+4917612854755">PHONE → +49 176 12854755</a><a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/yasser-akanni-4b15333b3/" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div>}</div></section>
    <footer className="cyber-footer"><span>YASSER AKANNI / {de ? 'ALLE SYSTEME BEREIT' : 'ALL SYSTEMS READY'}</span><a href={`/datenschutz?lang=${language}`}>{de ? 'Datenschutz' : 'Privacy'} ↗</a><button type="button" onClick={onExit}>{de ? 'Zurück zum Hauptportfolio' : 'Back to main portfolio'} ↗</button></footer></main>
    <dialog ref={palette} className="cyber-palette" aria-label={de ? 'Schnellnavigation' : 'Command palette'} onCancel={(event) => { event.preventDefault(); event.stopPropagation(); setPaletteOpen(false); }}><div className="cyber-palette-head"><Search size={18} /><input ref={paletteInput} value={query} onChange={(event) => { setQuery(event.target.value); setHighlight(0); }} aria-label={de ? 'Abschnitt suchen' : 'Find a section'} aria-controls="cyber-command-list" placeholder={de ? 'Abschnitt suchen…' : 'Find a section…'} onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setHighlight((n) => filtered.length ? (n + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length : 0); } if (event.key === 'Enter' && filtered[highlight]) { event.preventDefault(); jump(filtered[highlight].id); } }} /><button type="button" aria-label={de ? 'Palette schließen' : 'Close palette'} onClick={() => setPaletteOpen(false)}><X size={17} /></button></div><nav id="cyber-command-list" aria-label={de ? 'Abschnitte' : 'Sections'}>{filtered.map((item,index) => <button type="button" key={item.id} data-highlighted={highlight === index} onPointerMove={() => setHighlight(index)} onClick={() => jump(item.id)}><span>{item.code} / {item.name}</span><ArrowUpRight size={17} /></button>)}{!filtered.length && <p>{de ? 'Keine Treffer.' : 'No matching sections.'}</p>}</nav><p className="cyber-palette-hint">↑ ↓ / ENTER / ESC</p></dialog>
  </dialog>;
}
