'use client';

import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
import { Users } from 'lucide-react';
import { ExperienceTrigger } from '@/components/experience-trigger';
import type { Language } from '@/lib/portfolio-content';
const SocialProfile = lazy(() => import('@/components/social-profile'));
export function SocialLauncher({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  return <div className="social-launch-wrap"><ExperienceTrigger style="social" className="social-launch" expanded={open} onLaunch={() => setOpen(true)}><Users size={20} />{language === 'de' ? 'Social-Profil' : 'Social Profile'} ↗</ExperienceTrigger>{open && createPortal(<Suspense fallback={<output className="social-loading" aria-live="polite">Opening profile…</output>}><SocialProfile language={language} onExit={() => setOpen(false)} /></Suspense>, document.body)}</div>;
}
