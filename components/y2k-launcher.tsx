'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Globe } from 'lucide-react';
import type { Language } from '@/lib/portfolio-content';
const Y2KWorld = lazy(() => import('@/components/y2k-world'));
export function Y2KLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="aero-launch-wrap"><button type="button" className="aero-launch" aria-haspopup="dialog" aria-expanded={open} onClick={() => { window.dispatchEvent(new Event('portfolio:mode-launch')); setOpen(true); }}><Globe size={21} />{language === 'de' ? 'Y2K-Welt' : 'Y2K World'} ✦</button>{open && createPortal(<Suspense fallback={<output className="aero-lazy-status" aria-live="polite">Connecting to Y2K…</output>}><Y2KWorld language={language} onExit={() => setOpen(false)} /></Suspense>, document.body)}</div>;
}
