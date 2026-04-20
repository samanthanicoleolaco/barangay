import { AlertPage } from '@/components/page/AlertPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alerts',
};

export default function Page() {
  return <AlertPage />;
}
