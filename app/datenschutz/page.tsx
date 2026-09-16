import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/privacy-page';

export async function generateMetadata({ searchParams }: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const isGerman = (await searchParams).lang === 'de';
  const title = `${isGerman ? 'Datenschutzerklärung' : 'Privacy policy'} | Yasser Akanni`;
  const description = isGerman
    ? 'Datenschutzerklärung für das Portfolio von Yasser Akanni.'
    : 'Privacy policy for Yasser Akanni’s portfolio.';
  return { title, description, openGraph: { title, description, url: `/datenschutz?lang=${isGerman ? 'de' : 'en'}` }, twitter: { title, description } };
}

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
