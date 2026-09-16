import type { IconType } from 'react-icons';
import {
  SiCss,
  SiFirebase,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiResend,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si';

const technologyIcons: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  'Prisma ORM': SiPrisma,
  Vercel: SiVercel,
  'Vercel Serverless Function': SiVercel,
  Vite: SiVite,
  Firebase: SiFirebase,
  'Firebase Authentication': SiFirebase,
  Firestore: SiFirebase,
  HTML5: SiHtml5,
  CSS3: SiCss,
  JavaScript: SiJavascript,
  'Resend API': SiResend,
};

const technologyColors: Record<string, string> = {
  'Next.js': 'var(--accent)',
  React: '#61dafb',
  TypeScript: '#3178c6',
  PostgreSQL: '#699eca',
  Prisma: 'var(--accent)',
  'Prisma ORM': 'var(--accent)',
  Vercel: 'var(--accent)',
  'Vercel Serverless Function': 'var(--accent)',
  Vite: '#a98cff',
  Firebase: '#ffca28',
  'Firebase Authentication': '#ffca28',
  Firestore: '#ffca28',
  HTML5: '#e34f26',
  CSS3: '#38bdf8',
  JavaScript: '#f7df1e',
  'Resend API': 'var(--accent)',
};

export function TechnologyIcon({ name }: { name: string }) {
  const Icon = technologyIcons[name];
  return Icon ? <Icon className="technology-icon" style={{ color: technologyColors[name] ?? 'var(--accent)' }} aria-hidden="true" focusable="false" /> : null;
}
