import type { Metadata } from 'next';
import { Geist, Geist_Mono, Space_Grotesk, Caveat, Fraunces } from 'next/font/google';
import { PortfolioModesPicker } from '@/components/portfolio-modes';
import { ProjectTransitions } from '@/components/motion/project-transitions';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';
import './cinematic.css';
import './scrapbook.css';
import '@/components/retro-desktop.css';
import './cozy.css';
import './cyberpunk.css';
import './social.css';
import './y2k.css';

const cozySerif = Fraunces({ variable: '--font-cozy', subsets: ['latin'] });

const display = Space_Grotesk({ variable: '--font-display', subsets: ['latin'] });
const handwriting = Caveat({ variable: '--font-hand', subsets: ['latin'] });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yasser-akanni.vercel.app'),
  title: 'Yasser Akanni | Qualified Junior Frontend Developer in Essen',
  description: 'Portfolio of Yasser Akanni, a qualified junior frontend developer for React, Next.js, and TypeScript in Essen, Germany. Available in English and German.',
  authors: [{ name: 'Yasser Akanni' }],
  keywords: [
    'Junior Frontend-Entwickler',
    'Junior Frontend Developer',
    'React-Entwickler',
    'Next.js-Entwickler',
    'Webentwickler',
    'TypeScript',
    'Essen',
    'NRW',
  ],
  openGraph: {
    title: 'Yasser Akanni | Qualifizierter Junior Frontend-Entwickler',
    description: 'React, Next.js und TypeScript – ergänzt durch UI/UX-Kompetenz und praktische Full-Stack-Grundlagen.',
    url: '/',
    siteName: 'Yasser Akanni Portfolio',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Yasser Akanni developer portfolio' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yasser Akanni | Qualifizierter Junior Frontend-Entwickler',
    description: 'React, Next.js und TypeScript – ergänzt durch UI/UX-Kompetenz und praktische Full-Stack-Grundlagen.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${handwriting.variable} ${cozySerif.variable} antialiased`}
      >
        <ProjectTransitions>{children}<SiteFooter /><PortfolioModesPicker /></ProjectTransitions>
      </body>
    </html>
  );
}
