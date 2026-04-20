import { DashboardPage } from '@/components/page/DashboardPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {
  return <DashboardPage />;
}
