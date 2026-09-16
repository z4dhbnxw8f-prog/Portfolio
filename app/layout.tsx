import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-jbo-cv-portfolio.vercel.app'),
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
