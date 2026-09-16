import type { Metadata } from 'next';
import Home from '@/components/home-page';
import { portfolioCopy } from '@/lib/portfolio-content';

export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const language = (await searchParams).lang === 'de' ? 'de' : 'en';
  const copy = portfolioCopy[language];
  const title = `Yasser Akanni | ${copy.role} in Essen`;
  const description = copy.hero;
  return {
    title,
    description,
    openGraph: {
      title, description, url: `/?lang=${language}`,
      locale: language === 'de' ? 'de_DE' : 'en_GB',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: language === 'de' ? 'Entwicklerportfolio von Yasser Akanni' : 'Yasser Akanni developer portfolio' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
  };
}

export default Home;
