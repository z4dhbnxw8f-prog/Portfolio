'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Crosshair } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';
const TacticalHud = lazy(() => import('@/components/tactical-hud'));
export function TacticalLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="tactical-launch-wrap"><ExperienceTrigger style="cyber" className="tactical-launch" expanded={open} onLaunch={() => setOpen(true)}><Crosshair size={20}/>{language === 'de' ? 'Einsatz-Briefing' : 'Mission Briefing'} ↗</ExperienceTrigger>{open&&createPortal(<Suspense fallback={<output className="tactical-loading" aria-live="polite">DEPLOYING...</output>}><TacticalHud language={language} onExit={()=>setOpen(false)}/></Suspense>,document.body)}</div>;
}
