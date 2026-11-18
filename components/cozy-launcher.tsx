'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookHeart } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';
const CozyJournal = lazy(() => import('@/components/cozy-journal'));
export function CozyLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="cozy-launch-wrap"><ExperienceTrigger style="cozy" className="cozy-launch" expanded={open} onLaunch={() => setOpen(true)}><BookHeart size={21} />{language === 'de' ? 'Cozy Journal' : 'Cozy Journal'} ♡</ExperienceTrigger>{open && createPortal(<Suspense fallback={<output className="cozy-loading" aria-live="polite">Opening a little journal…</output>}><CozyJournal language={language} onExit={() => setOpen(false)} /></Suspense>, document.body)}</div>;
}
