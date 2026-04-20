import { MedicinesPage } from '@/components/page/MedicinesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medicines',
};

export default function Page() {
  return <MedicinesPage />;
}
