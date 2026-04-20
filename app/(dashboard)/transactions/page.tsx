import { TransactionsPage } from '@/components/page/TransactionsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default function Page() {
  return <TransactionsPage />;
}
