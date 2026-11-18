'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { RetroLauncher } from '@/components/retro-launcher';
import { CozyLauncher } from '@/components/cozy-launcher';
import { CyberpunkLauncher } from '@/components/cyberpunk-launcher';
import { SocialLauncher } from '@/components/social-launcher';
import { Y2KLauncher } from '@/components/y2k-launcher';
import { MatrixLauncher } from '@/components/matrix-launcher';
import { PirateLauncher } from '@/components/pirate-launcher';
import type { Language } from '@/lib/portfolio-content';

type OpenDetail = { trigger: HTMLButtonElement };

export function PortfolioModesButton({ language, placement = 'header', beforeOpen }: { language: Language; placement?: 'header' | 'hero' | 'menu'; beforeOpen?: () => void }) {
  return <button type="button" className={`portfolio-modes-button modes-button-${placement}`} aria-haspopup="dialog" onClick={(event) => {
    const trigger = event.currentTarget;
    beforeOpen?.();
    requestAnimationFrame(() => window.dispatchEvent(new CustomEvent<OpenDetail>('portfolio:open-modes', { detail: { trigger } })));
  }}>{placement === 'hero' ? (language === 'de' ? 'Anderen Look ausprobieren ↗' : 'Try another look ↗') : (language === 'de' ? 'Portfolio-Modi' : 'Portfolio Modes')}</button>;
}

/** One persistent picker; launched modes can render portals after it closes. */
export function PortfolioModesPicker() {
  const language: Language = useSearchParams().get('lang') === 'de' ? 'de' : 'en';
  const [used, setUsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 90, right: 24 });
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const show = (event: Event) => {
      const button = (event as CustomEvent<OpenDetail>).detail.trigger;
      trigger.current = button;
      const anchor = button.classList.contains('modes-button-header') ? button : document.querySelector<HTMLElement>('.modes-button-header:not([hidden])') ?? button;
      const rect = anchor?.getBoundingClientRect();
      setPosition({ top: Math.min(rect ? rect.bottom + 14 : 90, 130), right: Math.max(16, Math.min(rect ? innerWidth - rect.right : 24, innerWidth - Math.min(520, innerWidth - 32) - 16)) });
      setUsed(true); setOpen(true);
    };
    const launch = () => setOpen(false);
    window.addEventListener('portfolio:open-modes', show); window.addEventListener('portfolio:mode-launch', launch);
    return () => { window.removeEventListener('portfolio:open-modes', show); window.removeEventListener('portfolio:mode-launch', launch); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const node = dialog.current!; const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; const button = trigger.current; if (button?.closest('dialog') && !(button.closest('dialog') as HTMLDialogElement).open) document.querySelector<HTMLButtonElement>('.cinematic-menu-trigger')?.focus({ preventScroll: true }); else button?.focus({ preventScroll: true }); };
  }, [open]);
  if (!used) return null;
  return createPortal(<dialog ref={dialog} className="portfolio-mode-picker scrapbook" style={{ top: position.top, right: position.right }} aria-labelledby="mode-picker-title" aria-describedby="mode-picker-description" onCancel={(event) => { event.preventDefault(); setOpen(false); }}>
    <div className="mode-picker-top"><button type="button" onClick={() => setOpen(false)} aria-label={language === 'de' ? 'Auswahl schließen' : 'Close mode picker'}><X size={19} /></button></div>
    <h2 id="mode-picker-title">{language === 'de' ? 'gleiches portfolio. andere welten.' : 'same portfolio. different worlds.'}</h2><p id="mode-picker-description">{language === 'de' ? 'Wähle einen Look, um meine Arbeit zu entdecken.' : 'Choose a look to explore my work.'}</p>
    <div className="mode-picker-grid"><RetroLauncher language={language} /><CozyLauncher language={language} /><CyberpunkLauncher language={language} /><SocialLauncher language={language} /><div className="mode-picker-bonus"><span>{language === 'de' ? 'BONUS-WELT' : 'BONUS WORLD'}</span><Y2KLauncher language={language} /></div><MatrixLauncher language={language} /><PirateLauncher language={language} /></div>
  </dialog>, document.body);
}
