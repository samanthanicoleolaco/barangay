import { UsersPage } from '@/components/page/UsersPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
};

export default function Page() {
  return <UsersPage />;
}
