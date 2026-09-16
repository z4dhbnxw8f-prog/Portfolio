import type { Metadata } from 'next';

import { PrivacyPage } from '@/components/privacy-page';

export const metadata: Metadata = {
  title: 'Privacy policy | Yasser Akanni',
  description: 'Privacy policy for the portfolio of Yasser Akanni.',
  openGraph: { title: 'Privacy policy | Yasser Akanni', url: '/privacy' },
  twitter: { title: 'Privacy policy | Yasser Akanni' },
};

export default function PrivacyRoute() {
  return <PrivacyPage language="en" />;
}
