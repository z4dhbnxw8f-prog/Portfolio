import { redirect } from 'next/navigation';

export default async function CertificatesPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const language = (await searchParams).lang === 'de' ? 'de' : 'en';
  redirect(`/?lang=${language}#qualifications`);
}
