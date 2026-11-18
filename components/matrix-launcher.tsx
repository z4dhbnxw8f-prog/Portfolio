'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Terminal } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';
const MatrixMode = lazy(() => import('@/components/matrix-mode'));
export function MatrixLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="matrix-launch-wrap"><ExperienceTrigger style="cyber" className="matrix-launch" expanded={open} onLaunch={() => setOpen(true)}><Terminal size={20}/>{language === 'de' ? 'Matrix-Simulation' : 'Matrix Simulation'} ↗</ExperienceTrigger>{open && createPortal(<Suspense fallback={<output className="cyber-loading" aria-live="polite">Loading simulation…</output>}><MatrixMode language={language} onExit={() => setOpen(false)}/></Suspense>,document.body)}</div>;
}
