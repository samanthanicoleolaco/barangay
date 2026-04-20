'use client';

import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, XCircle, Package, Clock, ArrowRight } from 'lucide-react';

interface Alert {
  id: number;
  medicine: string;
  category: string;
  issue: string;
  severity: 'low' | 'critical' | 'out';
  quantity: number;
  reorderLevel: number;
  expiryDate?: string;
  action: string;
}

const alerts: Alert[] = [
  { id: 1, medicine: 'Amlodipine 5mg', category: 'Antihypertensive', issue: 'Out of Stock', severity: 'out', quantity: 0, reorderLevel: 60, action: 'Order immediately' },
  { id: 2, medicine: 'Metformin 500mg', category: 'Antidiabetic', issue: 'Critical Stock', severity: 'critical', quantity: 8, reorderLevel: 60, action: 'Urgent reorder needed' },
  { id: 3, medicine: 'Losartan 50mg', category: 'Antihypertensive', issue: 'Low Stock', severity: 'low', quantity: 18, reorderLevel: 60, action: 'Schedule reorder' },
  { id: 4, medicine: 'Ascorbic Acid 500mg', category: 'Vitamin', issue: 'Low Stock', severity: 'low', quantity: 22, reorderLevel: 100, action: 'Schedule reorder' },
  { id: 5, medicine: 'Salbutamol 2mg', category: 'Bronchodilator', issue: 'Low Stock', severity: 'low', quantity: 45, reorderLevel: 50, action: 'Schedule reorder' },
];

const severityOrder = { out: 0, critical: 1, low: 2 };
const sortedAlerts = [...alerts].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

export function AlertPage() {
  const outOfStockCount = 1;
  const criticalCount = 1;
  const lowStockCount = 3;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Medicine stock risk monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[var(--status-out-bg)] to-[var(--status-out-bg)]/50 border-[var(--status-out)]/30">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--status-out)]/80 mb-1">Out of Stock</p>
                <p className="text-3xl font-semibold text-[var(--status-out)]">{outOfStockCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--status-out)]/20">
                <XCircle className="size-6 text-[var(--status-out)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--status-critical-bg)] to-[var(--status-critical-bg)]/50 border-[var(--status-critical)]/30">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--status-critical)]/80 mb-1">Critical Stock</p>
                <p className="text-3xl font-semibold text-[var(--status-critical)]">{criticalCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--status-critical)]/20">
                <AlertTriangle className="size-6 text-[var(--status-critical)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[var(--status-low-bg)] to-[var(--status-low-bg)]/50 border-[var(--status-low)]/30">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--status-low)]/80 mb-1">Low Stock</p>
                <p className="text-3xl font-semibold text-[var(--status-low)]">{lowStockCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--status-low)]/20">
                <Package className="size-6 text-[var(--status-low)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Medicine</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Quantity Left</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium text-foreground">{alert.medicine}</TableCell>
                    <TableCell className="text-foreground">{alert.category}</TableCell>
                    <TableCell className="text-foreground">{alert.issue}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        alert.severity === 'out' ? 'text-[var(--status-out)]' :
                        alert.severity === 'critical' ? 'text-[var(--status-critical)]' :
                        'text-[var(--status-low)]'
                      }`}>
                        {alert.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{alert.reorderLevel}</TableCell>
                    <TableCell className="text-muted-foreground">{alert.expiryDate || '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={alert.severity}>
                        {alert.severity === 'out' && 'Out of Stock'}
                        {alert.severity === 'critical' && 'Critical'}
                        {alert.severity === 'low' && 'Low Stock'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        {alert.action}
                        <ArrowRight className="size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden space-y-3">
        {sortedAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={
              alert.severity === 'out'
                ? 'bg-[var(--status-out-bg)]/30 border-[var(--status-out)]/30'
                : alert.severity === 'critical'
                ? 'bg-[var(--status-critical-bg)]/30 border-[var(--status-critical)]/30'
                : 'bg-[var(--status-low-bg)]/30 border-[var(--status-low)]/30'
            }
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{alert.medicine}</h3>
                  <p className="text-sm text-muted-foreground">{alert.category}</p>
                </div>
                <StatusBadge status={alert.severity}>
                  {alert.severity === 'out' && 'Out'}
                  {alert.severity === 'critical' && 'Critical'}
                  {alert.severity === 'low' && 'Low'}
                </StatusBadge>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-muted-foreground" />
                  <span className="text-foreground">{alert.issue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Quantity: <span className="text-foreground font-medium">{alert.quantity}</span> / Reorder: {alert.reorderLevel}
                  </span>
                </div>
                {alert.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Expires: {alert.expiryDate}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full">
                {alert.action}
                <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
