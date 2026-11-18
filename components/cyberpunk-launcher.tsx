'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Terminal } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';
const CyberpunkMode = lazy(() => import('@/components/cyberpunk-mode'));
export function CyberpunkLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="cyber-launch-wrap"><ExperienceTrigger style="cyber" className="cyber-launch" expanded={open} onLaunch={() => setOpen(true)}><Terminal size={20} />{language === 'de' ? 'Cyberpunk Terminal' : 'Cyberpunk Terminal'} ↗</ExperienceTrigger>{open && createPortal(<Suspense fallback={<output className="cyber-loading" aria-live="polite">Initializing alternate interface…</output>}><CyberpunkMode language={language} onExit={() => setOpen(false)} /></Suspense>, document.body)}</div>;
}
