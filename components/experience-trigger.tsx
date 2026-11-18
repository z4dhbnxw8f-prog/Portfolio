'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Style = 'retro' | 'cozy' | 'cyber' | 'social';

/** A light CSS preview; the full experience still loads only on activation. */
export function ExperienceTrigger({ style, className, expanded, onLaunch, children }: { style: Style; className: string; expanded: boolean; onLaunch: () => void; children: ReactNode }) {
  const [launching, setLaunching] = useState(false);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (pending.current) clearTimeout(pending.current); }, []);
  return <button type="button" className={`${className} experience-trigger preview-${style}${launching ? ' is-launching' : ''}`} aria-haspopup="dialog" aria-expanded={expanded} aria-busy={launching} onClick={() => {
    if (pending.current || expanded) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { window.dispatchEvent(new Event('portfolio:mode-launch')); onLaunch(); return; }
    setLaunching(true);
    pending.current = setTimeout(() => { pending.current = null; setLaunching(false); window.dispatchEvent(new Event('portfolio:mode-launch')); onLaunch(); }, 220);
  }}><span className="experience-trigger-label">{children}</span><span className="experience-preview" aria-hidden="true"><span className="preview-surface"><span className="preview-topline"><i /><i /><i /></span>{style === 'retro' && <><span className="preview-window-title">yasser.exe <b>×</b></span><span className="preview-window-body">hello, world ☺<i /><i /></span></>}{style === 'cozy' && <><span className="preview-page"><b>dear internet,</b><i /><i /><em>with love ♡</em></span><span className="preview-flower">✿</span></>}{style === 'cyber' && <span className="preview-terminal">&gt; hello, world.<br />&gt; yasser_<span className="preview-cursor">▌</span></span>}{style === 'social' && <><span className="preview-profile"><i /><b>yasser.akanni<small>5 projects / Essen</small></b></span><span className="preview-posts"><i /><i /><i /></span></>}</span></span></button>;
}
