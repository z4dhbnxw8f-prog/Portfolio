'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { X, Minus, Folder, FileText, Mail, Trash2, Monitor, Volume2, VolumeX, Gamepad2 } from 'lucide-react';
import { projects } from '@/lib/projects';
import { portfolioCopy, projectCopy, type Language } from '@/lib/portfolio-content';
import { projectScreens } from '@/lib/project-screens';
import './retro-desktop.css';

type WindowId = string;
type DesktopWindow = { id: WindowId; x: number; y: number; z: number; minimized: boolean };
const names: Record<string, string> = { about: 'about_me.txt', projects: 'projects', contact: 'contact.exe', trash: 'recycle_bin', error: 'system_message.exe', game: 'tiny_mines.exe' };

export default function RetroDesktop({ language, onExit }: { language: Language; onExit: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [start, setStart] = useState(false);
  const [boot, setBoot] = useState(true);
  const [sound, setSound] = useState(false);
  const [clock, setClock] = useState('');
  const z = useRef(10);
  const audio = useRef<AudioContext | null>(null);
  const drag = useRef<{ id: string; x: number; y: number; left: number; top: number } | null>(null);
  const copy = portfolioCopy[language];
  const cv = language === 'de' ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf';
  const de = language === 'de';
  useEffect(() => {
    const node = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setBoot(false), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850);
    const update = () => setClock(new Date().toLocaleTimeString(de ? 'de-DE' : 'en-GB', { hour: '2-digit', minute: '2-digit' }));
    update(); const interval = setInterval(update, 1000);
    return () => { clearTimeout(timer); clearInterval(interval); node.close(); document.body.style.overflow = overflow; previousFocus?.focus({ preventScroll: true }); void audio.current?.close(); };
  }, [de]);
  const beep = (startup = false, enabled = sound) => {
    if (!enabled) return;
    try {
      const context = audio.current ?? new AudioContext(); audio.current = context; void context.resume();
      const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.connect(gain); gain.connect(context.destination); oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(startup ? 440 : 660, context.currentTime);
      if (startup) oscillator.frequency.linearRampToValueAtTime(880, context.currentTime + .18);
      gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + (startup ? .35 : .07));
      oscillator.start(); oscillator.stop(context.currentTime + (startup ? .4 : .08));
    } catch { /* Audio is optional. */ }
  };
  const open = (id: string) => {
    beep(); setStart(false); const nextZ = ++z.current;
    setWindows((current) => current.some((item) => item.id === id) ? current.map((item) => item.id === id ? { ...item, minimized: false, z: nextZ } : item) : [...current, { id, x: Math.max(0, Math.min((surface.current?.clientWidth ?? innerWidth) - Math.min(610, innerWidth - 50), 30 + current.length * 25)), y: Math.min(140, 25 + current.length * 22), z: nextZ, minimized: false }]);
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>(`[data-window="${CSS.escape(id)}"] .retro-title`)?.focus());
  };
  const close = (id: string) => { beep(); setWindows((current) => current.filter((item) => item.id !== id)); requestAnimationFrame(() => dialog.current?.querySelector<HTMLButtonElement>('.retro-start')?.focus()); };
  const focus = (id: string) => { const nextZ = ++z.current; setWindows((current) => current.map((item) => item.id === id ? { ...item, z: nextZ } : item)); };
  const minimize = (id: string) => { beep(); setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item)); requestAnimationFrame(() => dialog.current?.querySelector<HTMLButtonElement>('.retro-start')?.focus()); };
  const icons = [{ id: 'about', Icon: FileText, label: 'about_me.txt' }, { id: 'projects', Icon: Folder, label: 'projects' }, { id: 'resume', Icon: FileText, label: 'resume.pdf' }, { id: 'contact', Icon: Mail, label: 'contact.exe' }, { id: 'trash', Icon: Trash2, label: 'trash' }];
  return <dialog ref={dialog} className="retro-desktop" aria-label="Yasser OS — interactive portfolio" onCancel={(event) => { event.preventDefault(); onExit(); }}>
    <div className="retro-system-header"><span><Monitor size={16} /> YASSER OS / 2026</span><button type="button" onClick={onExit}>{de ? 'Zurück zum Hauptportfolio' : 'Back to main portfolio'} <X size={15} /></button></div>
    {boot && <div className="retro-boot"><Monitor size={54} /><strong>YASSER OS</strong><p>{de ? 'Gute Ideen werden geladen…' : 'Loading good ideas…'}</p><button type="button" onClick={() => setBoot(false)}>{de ? 'Überspringen' : 'Skip boot'} ↵</button></div>}
    <div className="retro-surface" ref={surface}>
      <div className="retro-desktop-label" aria-hidden="true">your local<br />creative human. <span>☺</span></div>
      <div className="retro-icons">{icons.map(({ id, Icon, label }) => id === 'resume' ? <a className="retro-icon" key={id} href={cv} target="_blank" rel="noreferrer"><Icon size={38} /><span>{label}</span></a> : <DesktopIcon key={id} label={label} Icon={Icon} onOpen={() => open(id)} />)}</div>
      <p className="retro-hint">{de ? 'Doppelklick / Enter zum Öffnen · Mobil: antippen' : 'Double-click / Enter to open · Mobile: tap'}</p>
      <div className="retro-windows">{windows.map((win) => {
        const project = projects.find((item) => item.slug === win.id);
        const title = project?.name ?? names[win.id] ?? win.id;
        // Floating non-modal windows remain inside the outer native modal desktop.
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        return <section role="dialog" aria-modal="false" aria-label={title} data-window={win.id} className="retro-window" key={win.id} hidden={win.minimized} style={{ left: win.x, top: win.y, zIndex: win.z } as CSSProperties} onPointerDown={() => focus(win.id)}>
          <div className="retro-title" role="toolbar" aria-label={`${title} — ${de ? 'Pfeiltasten zum Verschieben' : 'arrow keys to move'}`} tabIndex={0} onKeyDown={(event) => {
            if (!event.key.startsWith('Arrow')) return; event.preventDefault();
            setWindows((current) => current.map((item) => item.id === win.id ? { ...item, x: Math.max(0, item.x + (event.key === 'ArrowRight' ? 12 : event.key === 'ArrowLeft' ? -12 : 0)), y: Math.max(0, item.y + (event.key === 'ArrowDown' ? 12 : event.key === 'ArrowUp' ? -12 : 0)) } : item));
          }} onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest('button') || matchMedia('(max-width: 700px)').matches) return;
            event.currentTarget.setPointerCapture(event.pointerId); drag.current = { id: win.id, x: event.clientX, y: event.clientY, left: win.x, top: win.y };
          }} onPointerMove={(event) => {
            const current = drag.current; if (!current || current.id !== win.id) return;
            const width = surface.current?.clientWidth ?? innerWidth; const height = surface.current?.clientHeight ?? innerHeight;
            setWindows((items) => items.map((item) => item.id === win.id ? { ...item, x: Math.max(0, Math.min(Math.max(0, width - (event.currentTarget.parentElement?.clientWidth ?? 610)), current.left + event.clientX - current.x)), y: Math.max(0, Math.min(height - 45, current.top + event.clientY - current.y)) } : item));
          }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}><span>{title}</span><div><button type="button" aria-label={`${de ? 'Minimieren' : 'Minimize'} ${title}`} onClick={() => minimize(win.id)}><Minus size={14} /></button><button type="button" aria-label={`${de ? 'Schließen' : 'Close'} ${title}`} onClick={() => close(win.id)}><X size={14} /></button></div></div>
          <div className="retro-window-body">
            {win.id === 'about' && <><p className="retro-file-path">C:\\YASSER\\about_me.txt</p><h2>hi, i’m Yasser 👋</h2><p>{copy.aboutLead}</p><p>{copy.aboutBody}</p><p>{copy.aboutTraining}</p><p><strong>{copy.location}</strong><br />{copy.stack}</p><a href={cv} target="_blank" rel="noreferrer">resume.pdf ↗</a></>}
            {win.id === 'projects' && <><p className="retro-file-path">C:\\YASSER\\projects — 5 {de ? 'Dateien' : 'items'}</p><div className="retro-explorer">{projects.map((item) => <button type="button" key={item.slug} onClick={() => open(item.slug)}><Image unoptimized src={item.image} alt="" width={320} height={200} loading="lazy" /><span><Folder size={15} /> {item.name}</span></button>)}</div></>}
            {project && <><Image unoptimized className="retro-project-image" src={projectScreens[project.slug as keyof typeof projectScreens][0].src} alt={projectCopy[project.slug][language].imageAlt} width={1800} height={1200} /><h2>{project.name}</h2><p>{projectCopy[project.slug][language].summary}</p><div className="retro-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="retro-project-links">{project.links.map((link) => <a key={link.kind} href={link.url} target="_blank" rel="noreferrer">{link.kind === 'live' ? copy.liveDemo : 'GitHub'} ↗</a>)}<a href={`/projects/${project.slug}?lang=${language}`}>{copy.caseStudy} ↗</a></div></>}
            {win.id === 'contact' && <><h2>{de ? 'Neue Nachricht' : 'New message'} ✉</h2><p>{copy.contactBody}</p><a href="mailto:ressay93@outlook.com">ressay93@outlook.com ↗</a><p><a href="tel:+4917612854755">+49 176 12854755</a></p><div className="retro-project-links"><a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/yasser-akanni-4b15333b3/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><p>{de ? 'Das Kontaktformular bleibt im Hauptportfolio verfügbar.' : 'The contact form is available in the main portfolio.'}</p></>}
            {win.id === 'trash' && <><h2>{de ? 'Verworfene UI-Ideen' : 'Rejected UI ideas'} 🗑</h2><p>{de ? 'Nur zum Spaß — keine echten gelöschten Dateien.' : 'Just for fun — no real files were deleted.'}</p><ul><li>autoplay_music_final_FINAL.mp3</li><li>100_percent_proficiency_bars.exe</li><li>another_generic_gradient.png</li></ul><button type="button" onClick={() => open('error')}>{de ? 'Auf keinen Fall klicken' : 'Definitely do not click'}</button></>}
            {win.id === 'error' && <div className="retro-error"><strong>⚠ Error: too much talent</strong><p>{de ? 'Keine Sorge. Das ist nur ein albernes Easter Egg.' : 'Don’t panic. This is just a silly Easter egg.'}</p><button type="button" onClick={() => close('error')}>OK, understood ☺</button></div>}
            {win.id === 'game' && <TinyMines language={language} />}
          </div><div className="retro-window-status">{project ? 'portfolio / project' : 'YASSER OS'} <span>{de ? 'bereit' : 'ready'} ●</span></div>
        </section>;
      })}</div>
    </div>
    {start && <nav className="retro-start-menu" aria-label={de ? 'Startmenü' : 'Start menu'}>{[...icons.filter((item) => item.id !== 'resume'), { id: 'game', Icon: Gamepad2, label: 'tiny_mines.exe' }, { id: 'error', Icon: Monitor, label: 'surprise.exe' }].map(({ id, Icon, label }) => <button type="button" key={id} onClick={() => open(id)}><Icon size={20} />{label}</button>)}<a href={cv} target="_blank" rel="noreferrer"><FileText size={20} />resume.pdf</a><button type="button" onClick={onExit}><X size={20} />{de ? 'Desktop verlassen' : 'Exit desktop'}</button></nav>}
    <footer className="retro-taskbar"><button className="retro-start" type="button" aria-expanded={start} onClick={() => { beep(); setStart((value) => !value); }}><Monitor size={18} /> start</button><div className="retro-task-tabs">{windows.map((win) => <button type="button" key={win.id} aria-pressed={!win.minimized} onClick={() => open(win.id)}>{projects.find((project) => project.slug === win.id)?.name ?? names[win.id]}</button>)}</div><button type="button" className="retro-sound" aria-pressed={sound} aria-label={de ? 'Sound einschalten' : 'Enable sound'} onClick={() => { setSound((value) => !value); beep(true, !sound); }}>{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><time>{clock}</time></footer>
  </dialog>;
}

function DesktopIcon({ label, Icon, onOpen }: { label: string; Icon: typeof Folder; onOpen: () => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const start = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  return <button className="retro-icon" type="button" style={{ translate: `${position.x}px ${position.y}px` }} onDoubleClick={onOpen} onClick={() => { if (matchMedia('(pointer: coarse)').matches) onOpen(); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(); } }} onPointerDown={(event) => { if (matchMedia('(pointer: coarse)').matches) return; event.currentTarget.setPointerCapture(event.pointerId); start.current = { x: event.clientX, y: event.clientY, left: position.x, top: position.y }; }} onPointerMove={(event) => { if (!start.current) return; setPosition({ x: Math.max(-20, Math.min(200, start.current.left + event.clientX - start.current.x)), y: Math.max(-20, Math.min(160, start.current.top + event.clientY - start.current.y)) }); }} onPointerUp={() => { start.current = null; }} onPointerCancel={() => { start.current = null; }}><Icon size={38} /><span>{label}</span></button>;
}

function TinyMines({ language }: { language: Language }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [bombs, setBombs] = useState([3, 8, 15, 21]);
  const lost = revealed.some((n) => bombs.includes(n));
  const won = !lost && revealed.length === 21;
  return <div className="tiny-mines"><h2>tiny mines ☺</h2><p>{language === 'de' ? '21 sichere Felder finden. Vier Minen vermeiden.' : 'Find 21 safe squares. Avoid four mines.'}</p><output aria-live="polite">{lost ? '💥 game over' : won ? '✦ you win!' : `${revealed.length} / 21`}</output><div className="mine-grid">{Array.from({ length: 25 }, (_, n) => { const open = revealed.includes(n); const near = bombs.filter((bomb) => Math.abs(bomb % 5 - n % 5) <= 1 && Math.abs(Math.floor(bomb / 5) - Math.floor(n / 5)) <= 1).length; return <button type="button" key={n} disabled={lost || won || open} aria-label={`${language === 'de' ? 'Feld' : 'Square'} ${n + 1}${open ? `: ${near}` : ''}`} className={open ? 'is-revealed' : ''} onClick={() => setRevealed((current) => [...current, n])}>{open ? bombs.includes(n) ? '✹' : near || '·' : '?'}</button>; })}</div><button type="button" onClick={() => { setRevealed([]); const picks = new Set<number>(); while (picks.size < 4) picks.add(Math.floor(Math.random() * 25)); setBombs([...picks]); }}>{language === 'de' ? 'Neues Spiel' : 'New game'}</button></div>;
}
