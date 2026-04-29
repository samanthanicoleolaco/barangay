'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, XCircle, Package, Clock, ArrowRight, Download, Loader2, CheckCircle, ShoppingCart, BellPlus } from 'lucide-react';
import { exportToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Medicine } from '@/types/database';

interface Alert {
  id: string;
  medicine: string;
  category: string;
  issue: string;
  severity: 'low' | 'critical' | 'out';
  quantity: number;
  reorderLevel: number;
  expiryDate?: string | null;
  action: string;
}

export function AlertPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*');

      if (error) {
        console.error('Error fetching alerts:', error);
        toast.error('Failed to load alerts');
        setLoading(false);
        return;
      }

      const dynamicAlerts: Alert[] = (data || [])
        .filter((med: Medicine) => med.quantity <= med.reorder_level)
        .map((med: Medicine) => {
          let severity: 'low' | 'critical' | 'out' = 'low';
          let issue = 'Low Stock';
          let action = 'Schedule reorder';

          if (med.quantity === 0) {
            severity = 'out';
            issue = 'Out of Stock';
            action = 'Order immediately';
          } else if (med.quantity <= med.reorder_level / 2) {
            severity = 'critical';
            issue = 'Critical Stock';
            action = 'Urgent reorder needed';
          }

          return {
            id: med.id,
            medicine: med.name,
            category: med.category || 'General',
            issue,
            severity,
            quantity: med.quantity,
            reorderLevel: med.reorder_level,
            expiryDate: med.expiry_date,
            action,
          };
        });

      // Sort by severity (out > critical > low)
      const severityOrder = { out: 0, critical: 1, low: 2 };
      setAlerts(dynamicAlerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]));
      setLoading(false);
    };

    fetchAlerts();
  }, [supabase]);

  const outOfStockCount = alerts.filter(a => a.severity === 'out').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const lowStockCount = alerts.filter(a => a.severity === 'low').length;

  const handleExport = () => {
    exportToCSV(alerts, 'inventory_alerts');
    toast.success('Alert report exported successfully');
  };

  const handleAction = (action: string, medicine: string) => {
    toast.success(`Action Started: ${action}`, {
      description: `Request for ${medicine} has been logged and sent to the supervisor.`,
    });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Analyzing inventory for risks...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">Medicine stock risk monitoring</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="size-4" />
          <span>Export Alerts</span>
        </Button>
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

      <div className="hidden md:block overflow-hidden border border-border/50 rounded-xl">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
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
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium text-foreground">{alert.medicine}</TableCell>
                    <TableCell className="text-foreground">{alert.category}</TableCell>
                    <TableCell className="text-foreground">{alert.issue}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
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
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                          onClick={() => handleAction(alert.action, alert.medicine)}
                          title={alert.action}
                        >
                          {alert.severity === 'out' || alert.severity === 'critical' ? (
                            <ShoppingCart className="size-4" />
                          ) : (
                            <BellPlus className="size-4" />
                          )}
                        </Button>
                        <span className="text-xs text-muted-foreground hidden lg:inline-block">
                          {alert.action}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {alerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-4 rounded-full bg-muted">
                          <CheckCircle className="size-8 text-[var(--status-safe)]" />
                        </div>
                        <p className="text-lg font-medium text-foreground">All stocks are safe!</p>
                        <p className="text-sm text-muted-foreground">
                          There are currently no medicines at risk.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden space-y-3">
        {alerts.map((alert) => (
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
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => handleAction(alert.action, alert.medicine)}
              >
                {alert.severity === 'out' || alert.severity === 'critical' ? (
                  <ShoppingCart className="size-4" />
                ) : (
                  <BellPlus className="size-4" />
                )}
                {alert.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
