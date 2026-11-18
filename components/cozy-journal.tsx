/* oxlint-disable jsx-a11y/media-has-caption -- Visitors choose local audio; no caption track is supplied. */
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check, Heart, Music2, X } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { projects } from '@/lib/projects';
import { projectScreens } from '@/lib/project-screens';
import { portfolioCopy, projectCopy, type Language } from '@/lib/portfolio-content';

export default function CozyJournal({ language, onExit }: { language: Language; onExit: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mood, setMood] = useState('☺');
  const [track, setTrack] = useState<{ name: string; url: string } | null>(null);
  const de = language === 'de';
  const copy = portfolioCopy[language];
  const { scrollY } = useScroll({ container: dialog });
  const parallax = useTransform(scrollY, [0, 600], [0, 24]);
  useEffect(() => {
    const node = dialog.current!; const opener = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; opener?.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => () => { if (track) URL.revokeObjectURL(track.url); }, [track]);
  useEffect(() => {
    if (reduced || !matchMedia('(pointer: fine)').matches) return;
    const node = dialog.current!; const trailNode = trail.current; let last = 0; let index = 0;
    const sparkle = (event: PointerEvent) => {
      if (performance.now() - last < 75) return;
      last = performance.now();
      const star = trail.current?.children[index++ % 8] as HTMLElement | undefined;
      if (!star) return;
      star.getAnimations().forEach((animation) => animation.cancel());
      star.style.left = `${event.clientX}px`; star.style.top = `${event.clientY}px`;
      star.animate([{ opacity: .75, transform: 'translate(-50%,-50%) scale(.7)' }, { opacity: 0, transform: 'translate(-50%,-110%) scale(1.2)' }], { duration: 650, fill: 'forwards' });
    };
    node.addEventListener('pointermove', sparkle);
    return () => { node.removeEventListener('pointermove', sparkle); trailNode?.querySelectorAll('span').forEach((star) => star.getAnimations().forEach((animation) => animation.cancel())); };
  }, [reduced]);
  const reveal = reduced ? {} : { initial: { opacity: .6, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .12 }, transition: { duration: .55 } };
  return <dialog ref={dialog} className="cozy-journal" aria-label={de ? 'Yassers digitales Journal' : 'Yasser’s digital journal'} onCancel={(event) => { event.preventDefault(); onExit(); }}>
    <div className="cozy-orb cozy-orb-one" aria-hidden="true" /><div className="cozy-orb cozy-orb-two" aria-hidden="true" />
    <header className="cozy-top"><a href="#journal-home" onClick={(event) => { event.preventDefault(); dialog.current?.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' }); }}>yasser’s journal <Heart size={16} /></a><button type="button" className="cozy-close" autoFocus onClick={onExit}>{de ? 'Portfolio' : 'Back to main portfolio'} <X size={18} /></button></header>
    <main className="cozy-content"><section className="cozy-hero" id="journal-home"><div><p className="cozy-note">{de ? 'schön, dass du da bist ♡' : 'a little corner of the internet ♡'}</p><h1>{de ? 'hi, ich bin' : 'hi, i’m'}<br /><em>Yasser.</em><span aria-hidden="true">✧</span></h1><p>{copy.hero}</p><div className="cozy-actions"><a href="#journal-work" onClick={(event) => { event.preventDefault(); dialog.current?.querySelector('#journal-work')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); }}>{de ? 'Meine Projekte' : 'A few things I’ve made'} <ArrowUpRight size={17} /></a><a href={de ? '/Yasser-Akanni-CV-German.pdf' : '/Yasser-Akanni-CV-English.pdf'} download>{copy.downloadCv}</a></div><p className="cozy-location">{copy.location} · {copy.stack}</p></div>
    <motion.div className="cozy-collage" style={reduced ? undefined : { y: parallax }}><motion.figure className="cozy-portrait cozy-polaroid" animate={reduced ? {} : { y: [0,-7,0], rotate: [-4,-2,-4] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><Image src="/yasser-akanni-profile-20261012.png" alt="Yasser Akanni" width={856} height={1836} /><figcaption>{de ? 'ein freundliches Hallo aus Essen' : 'a little hello from Essen'}</figcaption></motion.figure><figure className="cozy-mini-polaroid cozy-polaroid"><Image src="/projects/screens/penee-dashboard-laptop.png" alt={de ? 'Penee Dashboard' : 'Penee dashboard'} width={1800} height={1200} /><figcaption>ideas → interfaces</figcaption></figure><span className="cozy-doodle star-one" aria-hidden="true">✦</span><span className="cozy-doodle star-two" aria-hidden="true">✧</span><span className="cozy-note collage-note">{de ? 'mit Liebe zum Detail ↖' : 'made with a little care ↖'}</span></motion.div></section>
    <motion.section className="cozy-about cozy-glass" {...reveal}><p className="cozy-note">{de ? 'eine Seite über mich' : 'a page about me'}</p><div className="cozy-journal-columns"><div><h2>{de ? 'mehr als nur code.' : 'a human behind the code.'}</h2><p>{copy.aboutLead}</p><p>{copy.aboutBody}</p><p>{copy.aboutTraining}</p><h3>{de ? 'Dinge, die mir beim Entwickeln wichtig sind' : 'things i love building around'}</h3><ul className="cozy-checklist">{(de ? ['Verständliche Nutzerabläufe', 'Sorgfältige Interfaces', 'Barrierefreie Webanwendungen'] : ['Clear user flows', 'Thoughtful interfaces', 'Accessible web experiences']).map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></div><div className="cozy-widgets"><div className="cozy-mood"><h3>{de ? 'deine Stimmung heute' : 'your mood today'}</h3><div>{['☺','♡','☀','☁'].map((emoji) => <button type="button" key={emoji} aria-pressed={mood === emoji} aria-label={`${de ? 'Stimmung wählen' : 'Choose mood'} ${emoji}`} onClick={() => setMood(emoji)}>{emoji}</button>)}</div><p className="cozy-note">{de ? 'alle Stimmungen sind willkommen' : 'all moods welcome here'}</p></div><div className="cozy-playlist"><Music2 size={22} /><h3>{de ? 'dein Soundtrack' : 'your cozy soundtrack'}</h3><p>{de ? 'Wähle einen Song von deinem Gerät. Die Datei bleibt in deinem Browser.' : 'Pick a song from your device. The file stays in your browser.'}</p><label className="cozy-audio-picker">{de ? 'Audiodatei wählen' : 'Choose an audio file'}<input type="file" accept="audio/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setTrack({ name: file.name, url: URL.createObjectURL(file) }); }} /></label>{track && <><p className="cozy-track-name">{track.name}</p><audio src={track.url} controls preload="metadata" /></>}</div></div></div></motion.section>
    <section className="cozy-work" id="journal-work"><p className="cozy-note">{de ? 'ein paar meiner Arbeiten' : 'little projects, real purpose'}</p><h2>{copy.projectsKicker.toLowerCase()} <span aria-hidden="true">✷</span></h2><div className="cozy-project-grid">{projects.map((project, index) => { const content = projectCopy[project.slug][language]; const image = projectScreens[project.slug as keyof typeof projectScreens][0]; return <motion.article className="cozy-project cozy-polaroid" key={project.slug} {...reveal}><span className="cozy-tape" aria-hidden="true" /><a href={`/projects/${project.slug}?lang=${language}`}><Image src={image.src} alt={image.alt[language]} width={1800} height={1200} loading="lazy" /></a><div><p className="cozy-project-number">0{index+1} / {content.label.slice(5)}</p><h3><a href={`/projects/${project.slug}?lang=${language}`}>{project.name}</a></h3><p>{content.summary}</p><div className="cozy-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="cozy-project-links"><a href={`/projects/${project.slug}?lang=${language}`}>{copy.caseStudy} ↗</a>{project.links.map((link) => <a key={link.kind} href={link.url} target="_blank" rel="noreferrer">{link.kind === 'live' ? copy.liveDemo : 'GitHub'} ↗</a>)}</div></div></motion.article>; })}</div></section>
    <motion.section className="cozy-postcard" {...reveal}><span className="cozy-stamp" aria-hidden="true">✉<small>WITH CARE</small></span><div className="cozy-letter-heading"><p className="cozy-note">{de ? 'meine Inbox ist offen' : 'my inbox is a friendly place'}</p><h2>{de ? 'schreib mir einen Brief.' : 'send me a little letter.'}</h2><p>{copy.contactBody}</p><a href="mailto:ressay93@outlook.com">ressay93@outlook.com ↗</a></div><ContactForm language={language} privacyText={copy.privacy} idPrefix="journal-" /></motion.section>
    <footer className="cozy-footer"><span>Yasser Akanni · {de ? 'Mit Sorgfalt gebaut' : 'Made with care'} ♡</span><div><a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/yasser-akanni-4b15333b3/" target="_blank" rel="noreferrer">LinkedIn</a><a href={`/datenschutz?lang=${language}`}>{de ? 'Datenschutz' : 'Privacy'}</a></div></footer></main>
    <div ref={trail} className="cozy-sparkle-trail" aria-hidden="true">{Array.from({ length: 8 }, (_, n) => <span key={n}>✧</span>)}</div>
  </dialog>;
}
