'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status?: 'safe' | 'low' | 'critical' | 'out' | 'neutral';
}

export function SummaryCard({ title, value, icon: Icon, status = 'neutral' }: SummaryCardProps) {
  const statusColors = {
    safe: 'text-[var(--status-safe)]',
    low: 'text-[var(--status-low)]',
    critical: 'text-[var(--status-critical)]',
    out: 'text-[var(--status-out)]',
    neutral: 'text-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="text-3xl font-semibold text-foreground"
              >
                {value}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={cn('p-3 rounded-lg bg-muted', statusColors[status])}
            >
              <Icon className="size-6" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
