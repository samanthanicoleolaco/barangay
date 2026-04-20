import { ProgramsPage } from '@/components/page/ProgramsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programs',
};

export default function Page() {
  return <ProgramsPage />;
}
