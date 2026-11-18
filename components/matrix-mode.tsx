'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'motion/react';
import { ArrowUpRight, Terminal, X } from 'lucide-react';
import { projects } from '@/lib/projects';
import { portfolioCopy, skillGroups, type Language } from '@/lib/portfolio-content';

const glyphs = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ012345789<>[]{}=+-*/';
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function MatrixMode({ language, onExit }: { language: Language; onExit: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const palette = useRef<HTMLElement>(null);
  const [view, setView] = useState<'boot'|'full'|'brief'>('boot');
  const [boot, setBoot] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [contact, setContact] = useState(false);
  const [hint, setHint] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [redRain, setRedRain] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const reduced = useReducedMotion();
  const de = language === 'de';
  const copy = portfolioCopy[language];
  const lines = de ? ['Wach auf, Yasser…', 'Die Realität ist nur eine Benutzeroberfläche.', 'Dein Portfolio wartet auf der anderen Seite.'] : ['Wake up, Yasser…', 'The Matrix has you.', 'Your portfolio is waiting on the other side.'];

  useEffect(() => {
    const node = dialog.current!; const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; };
  }, []);
  useEffect(() => {
    if (view !== 'boot') return;
    if (reduced) { setBoot(lines); return; }
    let line = 0; let char = 0;
    const timer = window.setInterval(() => {
      if (line >= lines.length) { window.clearInterval(timer); return; }
      char += 1;
      const currentLine = line;
      const typedText = lines[currentLine].slice(0, char);
      setBoot((current) => { const next = [...current]; next[currentLine] = typedText; return next; });
      if (char >= lines[currentLine].length) { line += 1; char = 0; if (line >= lines.length) window.clearInterval(timer); }
    }, 38);
    return () => window.clearInterval(timer);
  }, [view, de, reduced]);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const element = canvas.current; const ctx = element?.getContext('2d'); if (!element || !ctx) return;
    let width = 0; let height = 0; let drops: number[] = []; let frame = 0; let raf = 0; let last = 0;
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); width = innerWidth; height = innerHeight; element.width = width * dpr; element.height = height * dpr; element.style.width = `${width}px`; element.style.height = `${height}px`; ctx.setTransform(dpr,0,0,dpr,0,0); drops = Array.from({length: Math.ceil(width / 18)}, () => reduced ? Math.random() * (height / 18) : Math.random() * -50); if (reduced) paint(0); };
    const paint = (time: number) => { if (!reduced) raf = requestAnimationFrame(paint); if (!reduced && time - last < 33) return; last = time; frame++; ctx.fillStyle = 'rgba(0,0,0,.09)'; ctx.fillRect(0,0,width,height); ctx.font = '14px monospace'; ctx.fillStyle = redRain ? '#ff2525' : '#00ff41'; drops.forEach((y, i) => { const char = glyphs[Math.floor(Math.random()*glyphs.length)]; ctx.globalAlpha = .12 + Math.random() * .28; ctx.fillText(char, i * 18, y * 18); drops[i] = y * 18 > height && Math.random() > .98 ? -3 : y + .75; }); ctx.globalAlpha = 1; };
    resize(); if (!reduced) raf = requestAnimationFrame(paint); window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [redRain]);
  useEffect(() => {
    const keys: string[] = [];
    const keydown = (event: KeyboardEvent) => { const editing = (event.target as HTMLElement).closest('input,textarea'); if (event.key === '/' && !editing && view === 'full') { event.preventDefault(); setPaletteOpen((value) => !value); } keys.push(event.key.toLowerCase()); if (keys.length > konami.length) keys.shift(); if (konami.every((key, i) => keys[i] === key.toLowerCase())) { setRedRain((value) => !value); keys.length = 0; } };
    window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown);
  }, [view]);
  useEffect(() => { if (paletteOpen) palette.current?.querySelector<HTMLButtonElement>('button')?.focus(); }, [paletteOpen]);
  const download = (slug: string) => { if (loaded.includes(slug) || downloading.includes(slug)) return; setDownloading((value) => [...value, slug]); window.setTimeout(() => { setDownloading((value) => value.filter((item) => item !== slug)); setLoaded((value) => [...value, slug]); }, 950); };
  const run = (event: FormEvent) => { event.preventDefault(); const value = command.trim().toLowerCase(); if (value === 'contact' || value === 'call') { setContact(true); setHint(de ? 'VERBINDUNG HERGESTELLT' : 'CONNECTION ESTABLISHED'); } else if (value === 'help') setHint('contact · call · help · clear'); else if (value === 'clear') { setContact(false); setHint(''); } else setHint(de ? 'Unbekannter Befehl. Versuche help.' : 'Unknown command. Try help.'); setCommand(''); };
  const glitchNow = () => { setGlitch(true); window.setTimeout(() => setGlitch(false), 650); };
  const fullReady = boot.length >= lines.length && boot[lines.length-1] === lines.at(-1);
  const rain = <canvas ref={canvas} className="matrix-rain" aria-hidden="true" />;
  return createPortal(<dialog ref={dialog} className={`matrix-mode ${redRain ? 'matrix-red' : ''} ${glitch ? 'matrix-glitch' : ''}`} aria-label="Matrix portfolio mode" onCancel={(event) => { event.preventDefault(); if (paletteOpen) setPaletteOpen(false); else onExit(); }}>
    {rain}<div className="matrix-scanlines" aria-hidden="true" /><header className="matrix-header"><a href="#matrix-home" onClick={(event) => { event.preventDefault(); document.querySelector('.matrix-mode')?.scrollTo({top:0,behavior:'smooth'}); }}>Y/A<span>_REALITY.SYS</span></a><span className="matrix-online">● ONLINE</span><button type="button" className="matrix-exit" onClick={onExit} aria-label={de?'Zurück zum Hauptportfolio':'Back to main portfolio'}><X size={19}/></button></header>
    {view === 'boot' ? <main className="matrix-boot"><div className="matrix-terminal-label"><Terminal size={15}/> SYSTEM BOOT / PORTFOLIO.EXE</div><div className="matrix-boot-lines" aria-live="polite">{boot.map((line,index)=><p key={index}><span>&gt; </span>{line}{index === boot.length-1 && !fullReady && <i className="matrix-cursor"/>}</p>)}</div>{fullReady && <div className="matrix-pill-choice"><p>{de?'Wähle deine Realität.':'Choose your reality.'}</p><button type="button" className="matrix-pill red" onClick={()=>setView('full')}>● {de?'ROTE PILLE — PORTFOLIO':'RED PILL — FULL PORTFOLIO'}</button><button type="button" className="matrix-pill blue" onClick={()=>setView('brief')}>● {de?'BLAUE PILLE — KURZÜBERSICHT':'BLUE PILL — QUICK SUMMARY'}</button><button type="button" className="matrix-skip" onClick={()=>setView('full')}>{de?'Intro überspringen':'Skip intro'} ↗</button></div>}</main> : view === 'brief' ? <main className="matrix-brief"><p className="matrix-kicker">SIMULATION / SUMMARY</p><h1>YASSER<br/>ADEBAYO AKANNI<span>_</span></h1><p>{copy.role} · {copy.location}</p><p>{copy.hero}</p><p className="matrix-techline">REACT / TYPESCRIPT / NEXT.JS / ACCESSIBLE UI</p><div className="matrix-actions"><a href="mailto:ressay93@outlook.com">CONTACT ↗</a><button type="button" onClick={()=>setView('full')}>TAKE THE RED PILL ↗</button></div><button type="button" className="matrix-back" onClick={onExit}>← {de?'Zurück zum Hauptportfolio':'Back to main portfolio'}</button></main> : <main className="matrix-content" id="matrix-home">
      <section className="matrix-hero"><p className="matrix-kicker">SYSTEM BOOT COMPLETE / USER: YASSER</p><h1>WAKE UP,<br/><span className="matrix-decode" onMouseEnter={glitchNow}>YASSER AKANNI</span><i className="matrix-cursor"/></h1><div className="matrix-hero-grid"><p>{copy.hero}</p><div className="matrix-terminal-card"><div>root@portfolio:~ <span>[ACTIVE]</span></div><p>&gt; {de?'Frontend-Entwickler':'Frontend developer'}<br/>&gt; Essen, NRW<br/>&gt; React · Next.js · TypeScript</p></div></div><div className="matrix-log-ticker" aria-label="Skills system log">{['[SYS] REACT.JS','[SYS] TYPESCRIPT','[SYS] NEXT.JS','[SYS] ACCESSIBLE UI','[SYS] RESPONSIVE DESIGN'].map((log)=><span key={log}>{log}</span>)}</div></section>
      <section className="matrix-section" id="matrix-projects"><p className="matrix-kicker">01 / FILE SYSTEM</p><h2>{de?'Programme':'Programs'}</h2><div className="matrix-project-tree">{projects.map((project,index)=><article className="matrix-project" key={project.slug}><button type="button" className="matrix-file-button" onClick={()=>download(project.slug)} disabled={downloading.includes(project.slug)}><span>├── {project.slug}.exe</span><span>{loaded.includes(project.slug)?'LOADED':downloading.includes(project.slug)?'DOWNLOADING…':'CLICK TO DOWNLOAD'}</span></button><div className={`matrix-progress ${downloading.includes(project.slug)?'is-downloading':''}`} aria-label={`${project.name} download`}><i style={{width:loaded.includes(project.slug)?'100%':undefined,animationDuration:reduced?'0s':undefined}}/></div>{loaded.includes(project.slug)&&<div className="matrix-project-detail"><h3>{project.name}</h3><p>{project.summary}</p><div>{project.technologies.slice(0,6).map((tech)=><span key={tech}>{tech}</span>)}</div><nav><a href={`/projects/${project.slug}?lang=${language}`}>{de?'Details ansehen':'View details'} ↗</a>{project.links.filter((link)=>link.kind==='live').map((link)=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{de?'Live öffnen':'Open live'} ↗</a>)}</nav></div>}</article>)}</div></section>
      <section className="matrix-section" id="matrix-skills"><p className="matrix-kicker">02 / TRAINING PROGRAM</p><h2>{de?'Fähigkeiten':'Skills'} <span className="matrix-muted">// SYSTEM LOAD</span></h2><p className="matrix-disclaimer">{de?'Animierte Anzeige als Designelement, keine Kompetenzbewertung.':'Decorative load animation, not a proficiency rating.'}</p><div className="matrix-skills">{skillGroups.map((group,index)=><div key={group.title.en}><h3>{group.title[language]}</h3>{group.skills[language].slice(0,6).map((skill,i)=><div className="matrix-skill" key={skill}><span>{skill}</span><div><i className={reduced?'is-ready':''} style={{width:`${72+((index*13+i*7)%27)}%`,animationDelay:`${(index*6+i)*60}ms`}}/></div></div>)}</div>)}</div></section>
      <section className="matrix-section matrix-contact" id="matrix-contact"><p className="matrix-kicker">03 / COMMUNICATION LINK</p><h2>{de?'Kontakt':'Contact'} <span className="matrix-muted">// TERMINAL</span></h2><p>{de?'Gib „call“ oder „contact“ ein, um Kontaktwege aufzurufen.':'Type “call” or “contact” to reveal contact channels.'}</p><form onSubmit={run}><label htmlFor="matrix-command">root@portfolio:~$</label><input id="matrix-command" value={command} onChange={(event)=>setCommand(event.target.value)} onFocus={()=>setHint('contact · call · help · clear')} onKeyDown={(event)=>{if(event.key==='ArrowUp')setCommand('contact');}} autoComplete="off" spellCheck={false} placeholder="contact" list="matrix-command-hints"/><datalist id="matrix-command-hints"><option value="contact"/><option value="call"/><option value="help"/></datalist><button type="submit">↵</button></form><p className="matrix-hint" aria-live="polite">{hint}</p>{contact&&<div className="matrix-contact-links"><a href="mailto:ressay93@outlook.com">EMAIL ↗</a><a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/yasser-akanni-4b15333b3/" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div>}</section>
      <footer className="matrix-footer"><span>END OF SIMULATION / YASSER ADEBAYO AKANNI</span><button type="button" onClick={glitchNow}>TEST THE SIMULATION</button><button type="button" onClick={onExit}>← {de?'Zurück zum Hauptportfolio':'Back to main portfolio'}</button></footer>
    </main>}
    {paletteOpen && <div className="matrix-palette-backdrop" role="presentation" onClick={()=>setPaletteOpen(false)}><nav ref={palette} className="matrix-palette" aria-label="Command palette" onClick={(event)=>event.stopPropagation()} onKeyDown={(event)=>{if(event.key==='Escape'){event.preventDefault();setPaletteOpen(false);} if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const buttons=Array.from(palette.current?.querySelectorAll<HTMLButtonElement>('button')??[]);const current=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[(current+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}}}><p>COMMAND / SELECT DESTINATION</p>{[['matrix-home','HOME'],['matrix-projects','PROJECTS'],['matrix-skills','SKILLS'],['matrix-contact','CONTACT']].map(([id,label])=><button type="button" key={id} onClick={()=>{setPaletteOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}}>{label} ↵</button>)}</nav></div>}
  </dialog>, document.body);
}
