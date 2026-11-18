'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

/** The framework owns navigation; shared-element animation is optional. */
export function ProjectRouteLink({ slug, onClick, ...props }: ComponentProps<typeof Link> & { slug: string }) {
  return <Link {...props} data-project-route={slug} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target === '_blank') return;
    document.dispatchEvent(new CustomEvent('portfolio:project-open', { detail: event.currentTarget }));
  }} />;
}
