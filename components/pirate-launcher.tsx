'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Compass } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';
const PirateVoyage = lazy(() => import('@/components/pirate-voyage'));
export function PirateLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="pirate-launch-wrap"><ExperienceTrigger style="retro" className="pirate-launch" expanded={open} onLaunch={() => setOpen(true)}><Compass size={20}/>{language === 'de' ? 'Große Web-Abenteuerfahrt' : 'Grand Web Voyage'} ↗</ExperienceTrigger>{open && createPortal(<Suspense fallback={<output className="pirate-loading" aria-live="polite">Setting sail…</output>}><PirateVoyage language={language} onExit={() => setOpen(false)}/></Suspense>,document.body)}</div>;
}
