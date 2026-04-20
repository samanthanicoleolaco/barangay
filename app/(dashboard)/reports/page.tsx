import { ReportsPage } from '@/components/page/ReportsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports',
};

export default function Page() {
  return <ReportsPage />;
}
