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
  title: 'Yasser Akanni | Junior Frontend and Full-Stack Developer',
  description: 'Portfolio of Yasser Akanni, a junior frontend and full-stack web developer with UI/UX design skills based in Essen, Germany.',
  openGraph: {
    title: 'Yasser Akanni | Junior Frontend and Full-Stack Developer',
    description: 'Frontend and full-stack development portfolio focused on clear, accessible digital products.',
    url: '/',
    siteName: 'Yasser Akanni Portfolio',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Yasser Akanni developer portfolio' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yasser Akanni | Junior Frontend and Full-Stack Developer',
    description: 'Frontend and full-stack development portfolio focused on clear, accessible digital products.',
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
      </body>
    </html>
  );
}
