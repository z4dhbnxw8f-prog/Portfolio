import type { Metadata } from 'next';
import { PrivacyPage } from '@/components/privacy-page';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Yasser Akanni',
  description: 'Datenschutzerklärung für das Portfolio von Yasser Akanni.',
};

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
