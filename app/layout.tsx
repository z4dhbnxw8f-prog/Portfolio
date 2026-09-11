import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  metadataBase: new URL('https://yasser-akanni-portfolio.yazzieboiihome.chatgpt.site'),
  title: 'Yasser Akanni | Junior Frontend-Entwickler in Essen',
  description: 'Portfolio von Yasser Akanni, Junior Frontend-Entwickler für React, Next.js und TypeScript in Essen, NRW. Deutsch und Englisch verfügbar.',
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
    title: 'Yasser Akanni | Junior Frontend-Entwickler',
    description: 'React, Next.js und TypeScript – ergänzt durch UI/UX-Kompetenz und praktische Full-Stack-Grundlagen.',
    url: '/',
    siteName: 'Yasser Akanni Portfolio',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Yasser Akanni developer portfolio' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yasser Akanni | Junior Frontend-Entwickler',
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
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
