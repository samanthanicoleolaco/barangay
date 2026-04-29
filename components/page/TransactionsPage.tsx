'use client';

import { useState } from 'react';
import { Plus, Calendar, Search, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/status-badge';

interface Transaction {
  id: string;
  medicine: string;
  type: 'Stock In' | 'Stock Out' | 'Used for Program' | 'Expired' | 'Adjustment';
  quantity: number;
  date: string;
  time: string;
  remarks: string;
  staff: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', medicine: 'Paracetamol 500mg', type: 'Stock In', quantity: 100, date: '2026-04-11', time: '14:30', remarks: 'New delivery', staff: 'Maria Santos' },
  { id: '2', medicine: 'Amoxicillin 500mg', type: 'Used for Program', quantity: 50, date: '2026-04-11', time: '10:15', remarks: 'Vaccination program', staff: 'Juan dela Cruz' },
  { id: '3', medicine: 'Vitamin C 500mg', type: 'Stock In', quantity: 200, date: '2026-04-10', time: '16:45', remarks: 'Monthly supply', staff: 'Maria Santos' },
  { id: '4', medicine: 'Ibuprofen 400mg', type: 'Stock Out', quantity: 30, date: '2026-04-10', time: '09:20', remarks: 'Dispensed to patients', staff: 'Pedro Garcia' },
  { id: '5', medicine: 'Losartan 50mg', type: 'Used for Program', quantity: 25, date: '2026-04-09', time: '13:00', remarks: 'Senior checkup', staff: 'Juan dela Cruz' },
  { id: '6', medicine: 'Metformin 500mg', type: 'Expired', quantity: 15, date: '2026-04-09', time: '11:30', remarks: 'Expired batch removed', staff: 'Maria Santos' },
];

const MotionTableRow = motion.create(TableRow);

export function TransactionsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesFilter = typeFilter === 'all' || t.type === typeFilter;
    const matchesSearch = t.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExport = () => {
    exportToCSV(mockTransactions, 'transaction_history');
    toast.success('Transaction history exported successfully');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Stock Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all medicine movements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex" onClick={handleExport}>
            <Download className="size-4" />
            <span>Export</span>
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="size-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-4">New Transaction</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Medicine</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Paracetamol 500mg</SelectItem>
                        <SelectItem value="2">Amoxicillin 500mg</SelectItem>
                        <SelectItem value="3">Vitamin C 500mg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Transaction Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stock In">Stock In</SelectItem>
                        <SelectItem value="Stock Out">Stock Out</SelectItem>
                        <SelectItem value="Used for Program">Used for Program</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Quantity</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Remarks</label>
                    <Input placeholder="Optional notes" />
                  </div>
                  <div className="md:col-span-2 flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Transaction
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="date"
              className="pl-9 sm:w-[180px]"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Stock In">Stock In</SelectItem>
              <SelectItem value="Stock Out">Stock Out</SelectItem>
              <SelectItem value="Used for Program">Program Use</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="hidden md:block overflow-hidden border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[200px]">Medicine</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction, index) => {
                const isPositive = transaction.type === 'Stock In' || transaction.type === 'Adjustment';
                const statusType = transaction.type === 'Stock In' ? 'safe' :
                                  transaction.type === 'Expired' ? 'critical' :
                                  transaction.type === 'Adjustment' ? 'low' : 'out';

                return (
                  <MotionTableRow
                    key={transaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell className="font-medium text-foreground">{transaction.medicine}</TableCell>
                    <TableCell>
                      <StatusBadge status={statusType} className="capitalize">
                        {transaction.type}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : '-'}{transaction.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{transaction.date}</span>
                        <span className="text-xs text-muted-foreground">{transaction.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{transaction.staff}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {transaction.remarks}
                    </TableCell>
                  </MotionTableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-3">
        {filteredTransactions.map((transaction) => {
          const isPositive = transaction.type === 'Stock In' || transaction.type === 'Adjustment';
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{transaction.medicine}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.type}</p>
                    </div>
                    <span className={`text-lg font-bold tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : '-'}{transaction.quantity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 py-3 border-t border-border/50 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs">Staff</span>
                      <span className="text-foreground">{transaction.staff}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-xs">Date</span>
                      <span className="text-foreground">{transaction.date}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-xs">Remarks</span>
                      <p className="text-foreground truncate">{transaction.remarks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
