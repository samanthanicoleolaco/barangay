import type { Metadata } from 'next';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: {
    default: 'B-Healthcare',
    template: '%s | B-Healthcare',
  },
  description: 'Barangay Health Worker Medicine Inventory System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50/30">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
