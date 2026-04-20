import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'safe' | 'low' | 'critical' | 'out';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const styles = {
    safe: 'bg-[var(--status-safe-bg)] text-[var(--status-safe)] border-transparent',
    low: 'bg-[var(--status-low-bg)] text-[var(--status-low)] border-transparent',
    critical: 'bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-transparent',
    out: 'bg-[var(--status-out-bg)] text-[var(--status-out)] border-transparent',
  };

  return (
    <Badge className={cn('rounded-full', styles[status], className)}>
      {children}
    </Badge>
  );
}
