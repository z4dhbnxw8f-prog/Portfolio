'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Monitor } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';

const RetroDesktop = lazy(() => import('@/components/retro-desktop'));

export function RetroLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="retro-launch-wrap"><ExperienceTrigger style="retro" className="retro-launch" expanded={open} onLaunch={() => setOpen(true)}><Monitor size={22} />{language === 'de' ? 'Retro Desktop' : 'Retro Desktop'} ↗</ExperienceTrigger>{open && createPortal(<Suspense fallback={<output className="retro-loading" aria-live="polite">Loading Yasser OS…</output>}><RetroDesktop language={language} onExit={() => setOpen(false)} /></Suspense>, document.body)}</div>;
}
