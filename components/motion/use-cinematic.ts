'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useCinematic(root: RefObject<HTMLElement | null>, language: string) {
  useEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    const disposers: (() => void)[] = [];
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = root.current!;
      const intro = scope.querySelector<HTMLElement>('.intro-curtain');
      let seen = false;
      try { seen = sessionStorage.getItem('ya-intro') === '1'; sessionStorage.setItem('ya-intro', '1'); } catch { /* Storage can be disabled. */ }
      const skipButton = scope.querySelector<HTMLButtonElement>('.intro-skip');
      // Absolute positions keep the complete sequence at 1.8 seconds.
      // Session revisits and language changes leave the hero fully visible.
      if (!seen && !scope.classList.contains('scrapbook')) {
        const finish = () => {
          if (skipButton === document.activeElement) {
            const heading = scope.querySelector<HTMLElement>('.hero h1');
            heading?.setAttribute('tabindex', '-1');
            heading?.focus({ preventScroll: true });
          }
          gsap.set(skipButton, { display: 'none' });
        };
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });
        gsap.set(skipButton, { display: 'block' });
        if (intro) {
          gsap.set(intro, { display: 'grid' });
          timeline.fromTo('.intro-word', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .25 }, 0)
            .to(intro, { yPercent: -100, duration: .5, ease: 'power3.inOut' }, .15)
            .set(intro, { display: 'none' }, .65);
        }
        timeline.from('.hero-name-word', { yPercent: 115, rotate: 2, stagger: .12, duration: .75 }, .4)
          .from('.role-text', { yPercent: 115, duration: .65 }, .65)
          .from('.hero h1, .hero-lead, .hero-actions', { y: 18, opacity: 0, stagger: .07, duration: .55 }, 1)
          .from('.profile-photo', { clipPath: 'inset(100% 0 0 0)', duration: 1.05, ease: 'power3.inOut' }, .75)
          .from('.site-header', { y: -24, opacity: 0, duration: .45 }, .9);
        const skip = () => { timeline.progress(1); };
        const handleKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape' && timeline.progress() < 1) skip();
        };
        skipButton?.addEventListener('click', skip);
        document.addEventListener('keydown', handleKey);
        disposers.push(() => {
          skipButton?.removeEventListener('click', skip);
          document.removeEventListener('keydown', handleKey);
        });
      }
      const wipe = scope.querySelector('.navigation-wipe');
      let navigating = false;
      const navigate = (event: MouseEvent) => {
        if (scope.classList.contains('scrapbook')) return;
        const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link || link.closest('.cinematic-menu') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        const target = document.getElementById(link.hash.slice(1));
        if (!target || !wipe) return;
        event.preventDefault();
        if (navigating) return;
        navigating = true;
        const forward = target.getBoundingClientRect().top >= 0;
        gsap.timeline({ onComplete: () => { navigating = false; } })
          .set(wipe, { transformOrigin: forward ? 'bottom' : 'top' })
          .to(wipe, { scaleY: 1, duration: .3, ease: 'power3.in' })
          .call(() => {
            const offset = scope.querySelector('header')?.getBoundingClientRect().height ?? 84;
            window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - offset, behavior: 'instant' });
            history.pushState(null, '', link.hash);
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          })
          .set(wipe, { transformOrigin: forward ? 'top' : 'bottom' })
          .to(wipe, { scaleY: 0, duration: .45, ease: 'power3.out' });
      };
      scope.addEventListener('click', navigate);
      disposers.push(() => scope.removeEventListener('click', navigate));
      gsap.utils.toArray<HTMLElement>('.section-heading, .project-card, .skill-group, .about-copy, .practice-map, .contact-copy, .contact-form, .career-detail', scope).forEach((element) => {
        gsap.from(element, { y: 40, opacity: .25, duration: .8, scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
      });
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .15 } });
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        scope.querySelectorAll<HTMLElement>('.primary-action, .hero-actions > a, .contact-links a').forEach((element) => {
          const move = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();
            gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * .12, y: (event.clientY - rect.top - rect.height / 2) * .2, duration: .3, overwrite: 'auto' });
          };
          const leave = () => { gsap.to(element, { x: 0, y: 0, duration: .4, overwrite: 'auto' }); };
          element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
          disposers.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); });
        });
        scope.querySelectorAll<HTMLElement>('.project-preview').forEach((element) => {
          const move = (event: PointerEvent) => {
            const rect = element.getBoundingClientRect();
            gsap.to(element.querySelector('.project-orbit'), { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2, duration: .3, overwrite: 'auto' });
          };
          element.addEventListener('pointermove', move);
          disposers.push(() => element.removeEventListener('pointermove', move));
        });
      }
    }, root);
    return () => { disposers.forEach((dispose) => dispose()); media.revert(); };
  }, [root, language]);
}
