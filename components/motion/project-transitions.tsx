'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

type Journey = { slug: string; home: string; scroll: number; image: string; screen: number };
type Pending = { slug: string; direction: 'open' | 'back'; shell: HTMLElement | null; image: string; alt: string };
const storageKey = 'ya-project-journey';

/** Retains an image layer across real router navigations, including popstate. */
export function ProjectTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const route = `${pathname}?${params.toString()}`;
  const journey = useRef<Journey | null>(null);
  const pending = useRef<Pending | null>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hidden = useRef<HTMLElement | null>(null);
  const previousRoute = useRef(route);

  useEffect(() => {
    const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clear = () => {
      animation.current?.kill();
      pending.current?.shell?.remove();
      document.querySelectorAll('.shared-project-layer').forEach((layer) => layer.remove());
      if (hidden.current) hidden.current.style.removeProperty('visibility');
      hidden.current = null;
      pending.current = null;
      if (timeout.current) clearTimeout(timeout.current);
    };
    const capture = (element: HTMLElement | null, slug: string, direction: 'open' | 'back') => {
      clear();
      const image = element?.querySelector<HTMLImageElement>('[data-active-image="true"] img, :scope > img');
      let shell: HTMLElement | null = null;
      if (element && image && !reduced()) {
        const rect = element.getBoundingClientRect();
        shell = document.createElement('div');
        shell.className = 'shared-project-layer';
        shell.setAttribute('aria-hidden', 'true');
        const visual = image.cloneNode(true) as HTMLImageElement;
        visual.removeAttribute('id'); visual.removeAttribute('loading');
        visual.className = 'shared-project-image';
        visual.style.cssText = '';
        shell.appendChild(visual);
        Object.assign(shell.style, { position: 'fixed', pointerEvents: 'none', zIndex: '400', overflow: 'hidden', boxSizing: 'border-box', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, background: getComputedStyle(element).background, borderRadius: getComputedStyle(element).borderRadius, padding: getComputedStyle(element).padding });
        document.body.appendChild(shell);
        hidden.current = element;
        element.style.visibility = 'hidden';
      }
      pending.current = { slug, direction, shell, image: image?.getAttribute('src') ?? '', alt: image?.alt ?? '' };
      // A failed navigation must never leave a stale layer covering the page.
      timeout.current = setTimeout(clear, 7000);
    };
    const click = (event: MouseEvent | CustomEvent<HTMLAnchorElement>) => {
      const link = event instanceof CustomEvent ? event.detail : (event.target as Element).closest<HTMLAnchorElement>('a[data-project-back]');
      if (!link || (event instanceof MouseEvent && (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) || link.target === '_blank' || link.hasAttribute('download')) return;
      if (pending.current) clear();
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      if (link.hasAttribute('data-project-back')) {
        if (!journey.current) return; // Direct links retain their ordinary home destination.
        event.preventDefault();
        capture(document.querySelector<HTMLElement>('[data-case-visual]'), journey.current.slug, 'back');
        routerRef.current.back();
        return;
      }
      const slug = link.dataset.projectRoute!;
      const visual = document.querySelector<HTMLElement>(`#project-${CSS.escape(slug)} .showcase-visual`);
      if (!visual) return;
      const image = visual.querySelector('[data-active-image="true"] img, :scope > img')?.getAttribute('src') ?? '';
      const screen = Number(visual.querySelector('[data-screen][aria-pressed="true"]')?.getAttribute('data-screen') ?? 0);
      journey.current = { slug, home: location.pathname + location.search + location.hash, scroll: window.scrollY, image, screen };
      try { sessionStorage.setItem(storageKey, JSON.stringify(journey.current)); } catch { /* Optional restoration. */ }
      capture(visual, slug, 'open');
      // ProjectRouteLink performs the real navigation even if animation fails.
    };
    const pop = () => {
      if (pending.current) {
        animation.current?.kill();
        pending.current.direction = location.pathname === '/' ? 'back' : 'open';
        if (hidden.current) hidden.current.style.removeProperty('visibility');
        hidden.current = null;
        return;
      }
      const current = journey.current;
      if (!current) return;
      if (location.pathname === '/') capture(document.querySelector<HTMLElement>('[data-case-visual]'), current.slug, 'back');
      else if (location.pathname === `/projects/${current.slug}`) capture(document.querySelector<HTMLElement>(`#project-${CSS.escape(current.slug)} .showcase-visual`), current.slug, 'open');
    };
    const prepare = (event: Event) => { try { click(event as CustomEvent<HTMLAnchorElement>); } catch { clear(); } };
    document.addEventListener('portfolio:project-open', prepare);
    document.addEventListener('click', click);
    window.addEventListener('popstate', pop);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const changeMotion = () => { if (motion.matches) animation.current?.progress(1); };
    motion.addEventListener('change', changeMotion);
    return () => { clear(); document.removeEventListener('portfolio:project-open', prepare); document.removeEventListener('click', click); window.removeEventListener('popstate', pop); motion.removeEventListener('change', changeMotion); };
  }, []);

  useLayoutEffect(() => {
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    const transition = pending.current;
    if (!transition) return;
    if (hidden.current) hidden.current.style.removeProperty('visibility');
    hidden.current = null;
    const current = journey.current;
    // Keep the navigation watchdog until the animation also finishes.
    // Wait for client slideshow restoration and server route contents to commit.
    let frame = 0;
    let attempts = 0;
    const settle = () => {
      if (pending.current !== transition) return;
      const back = transition.direction === 'back';
      const casePage = document.querySelector<HTMLElement>(`[data-case-slug="${CSS.escape(transition.slug)}"]`);
      const card = document.getElementById(`project-${transition.slug}`);
      const target = back ? card?.querySelector<HTMLElement>('.showcase-visual') : casePage?.querySelector<HTMLElement>('[data-case-visual]');
      if ((!target || target.getBoundingClientRect().width === 0) && attempts++ < 60) { frame = requestAnimationFrame(settle); return; }
      if (back && current) window.scrollTo({ top: current.scroll, behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      const focus = back ? card?.querySelector<HTMLElement>('[data-project-route]') : casePage?.querySelector<HTMLElement>('h1');
      const shell = transition.shell;
      const finish = () => {
        if (timeout.current) clearTimeout(timeout.current);
        shell?.remove();
        target?.style.removeProperty('visibility');
        hidden.current = null;
        pending.current = null;
        if (focus) { focus.setAttribute('tabindex', back ? '0' : '-1'); focus.focus({ preventScroll: true }); }
      };
      if (!target || !shell || matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
      // Use the exact selected screenshot throughout the shared image flight.
      const targetImage = target.querySelector<HTMLImageElement>('img');
      if (!back && targetImage && transition.image) { targetImage.src = transition.image; targetImage.alt = transition.alt; }
      hidden.current = target;
      target.style.visibility = 'hidden';
      const state = Flip.getState(shell, { props: 'borderRadius,padding' });
      const bounds = target.getBoundingClientRect();
      gsap.set(shell, { clearProps: 'transform' });
      gsap.set(shell, { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height, borderRadius: getComputedStyle(target).borderRadius, padding: getComputedStyle(target).padding });
      animation.current = gsap.timeline({ onComplete: finish });
      animation.current.add(Flip.from(state, { duration: .6, ease: 'power3.inOut', scale: true }), 0);
      if (!back && casePage) {
        animation.current.fromTo(casePage.querySelectorAll('.case-hero h1, .case-intro, .case-hero .case-links, .case-hero .case-spec, .case-tech-tags li'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .055, clearProps: 'transform,opacity' }, .3);
      }
    };
    frame = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(frame);
  }, [route]);

  return <>{children}</>;
}
