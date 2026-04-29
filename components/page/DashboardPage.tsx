'use client';

import { useEffect, useState } from 'react';
import { SummaryCard } from '@/components/summary-card';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pill, AlertTriangle, XCircle, Package, Activity, TrendingUp, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import type { Medicine, StockTransaction } from '@/types/database';

export function DashboardPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      // Fetch medicines for summary cards and chart
      const { data: medData, error: medError } = await supabase
        .from('medicines')
        .select('*');

      // Fetch recent transactions
      const { data: transData, error: transError } = await supabase
        .from('stock_transactions')
        .select('*, medicine:medicines(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!isMounted) return;

      if (medError) console.error('Error fetching medicines:', medError);
      else setMedicines(medData || []);

      if (transError) console.error('Error fetching transactions:', transError);
      else setTransactions(transData || []);

      setLoading(false);
    };

    fetchData();
    return () => { isMounted = false; };
  }, [supabase]);

  // Calculate statistics
  const getStockStatus = (quantity: number, reorderLevel: number): 'safe' | 'low' | 'critical' | 'out' => {
    if (quantity === 0) return 'out';
    if (quantity <= reorderLevel / 2) return 'critical';
    if (quantity <= reorderLevel) return 'low';
    return 'safe';
  };

  const stats = medicines.reduce(
    (acc, med) => {
      const status = getStockStatus(med.quantity, med.reorder_level);
      acc[status]++;
      return acc;
    },
    { safe: 0, low: 0, critical: 0, out: 0 }
  );

  const stockData = [
    { name: 'Safe', value: stats.safe },
    { name: 'Low', value: stats.low },
    { name: 'Critical', value: stats.critical },
    { name: 'Out', value: stats.out },
  ];

  // Placeholder for usage data (could be calculated from transactions in a real app)
  const usageData = [
    { month: 'Jan', usage: 450 },
    { month: 'Feb', usage: 520 },
    { month: 'Mar', usage: 480 },
    { month: 'Apr', usage: 610 },
  ];

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Fetching the latest information...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Barangay Health Worker</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          <span>{format(new Date(), 'MMMM d, yyyy')}</span>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <SummaryCard title="Total Medicines" value={medicines.length.toString()} icon={Pill} status="neutral" />
        <SummaryCard title="Low Stock" value={stats.low.toString()} icon={AlertTriangle} status="low" />
        <SummaryCard title="Critical Stock" value={stats.critical.toString()} icon={Package} status="critical" />
        <SummaryCard title="Out of Stock" value={stats.out.toString()} icon={XCircle} status="out" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-accent/20 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="p-3 rounded-lg bg-primary/20"
              >
                <Activity className="size-6 text-primary" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Stock Health Analysis</h3>
                <p className="text-sm text-foreground/80 mb-3">
                  {stats.out > 0 
                    ? `Warning: ${stats.out} medicines are out of stock. Immediate reorder recommended.`
                    : stats.critical > 0 
                    ? `Heads up: ${stats.critical} medicines are at critical levels.`
                    : "Current inventory levels are within normal parameters."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="safe">{stats.safe} Safe</StatusBadge>
                  {stats.low > 0 && <StatusBadge status="low">{stats.low} Low</StatusBadge>}
                  {stats.critical > 0 && <StatusBadge status="critical">{stats.critical} Critical</StatusBadge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Urgent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicines
                .filter(m => getStockStatus(m.quantity, m.reorder_level) !== 'safe')
                .slice(0, 3)
                .map((alert) => (
                  <motion.div
                    key={alert.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-muted border border-border"
                  >
                    <p className="text-sm font-medium text-foreground mb-1">{alert.name}</p>
                    <StatusBadge status={getStockStatus(alert.quantity, alert.reorder_level)}>
                      {alert.quantity === 0 ? 'Out of Stock' : `${alert.quantity} remaining`}
                    </StatusBadge>
                  </motion.div>
                ))}
              {medicines.filter(m => getStockStatus(m.quantity, m.reorder_level) !== 'safe').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No urgent alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-foreground">{transaction.medicine?.name}</TableCell>
                      <TableCell className="text-foreground">{transaction.type}</TableCell>
                      <TableCell className={`font-medium ${transaction.quantity > 0 ? 'text-[var(--status-safe)]' : 'text-[var(--status-critical)]'}`}>
                        {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(transaction.created_at), 'MMM d, h:mm a')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No recent transactions</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{transaction.medicine?.name}</p>
                    <span className={`text-sm font-semibold ${transaction.quantity > 0 ? 'text-[var(--status-safe)]' : 'text-[var(--status-critical)]'}`}>
                      {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{transaction.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.created_at), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <CardTitle>Medicine Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="usage" stroke="#0d9488" strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

