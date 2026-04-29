'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Download, Edit, Eye, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { Medicine } from '@/types/database';
import { exportToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';

const MotionTableRow = motion.create(TableRow);

export function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    const fetchMedicines = async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');

      if (!isMounted) return;

      if (error) {
        console.error('Error fetching medicines:', error);
      } else {
        setMedicines(data || []);
      }
      setLoading(false);
    };

    fetchMedicines();
    return () => { isMounted = false; };
  }, [supabase]);

  const getStockStatus = (quantity: number, reorderLevel: number): 'safe' | 'low' | 'critical' | 'out' => {
    if (quantity === 0) return 'out';
    if (quantity <= reorderLevel / 2) return 'critical';
    if (quantity <= reorderLevel) return 'low';
    return 'safe';
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (medicine.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const status = getStockStatus(medicine.quantity, medicine.reorder_level);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    exportToCSV(medicines, 'inventory_report');
    toast.success('Inventory exported successfully');
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Preparing your inventory...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Medicine Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">{medicines.length} medicines in stock</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="size-4" />
            <span>Export</span>
          </Button>
          <Link href="/medicines/add">
            <Button>
              <Plus className="size-4" />
              <span>Add Medicine</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="safe">Safe Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="critical">Critical Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="hidden md:block"
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((medicine, index) => {
                  const status = getStockStatus(medicine.quantity, medicine.reorder_level);
                  return (
                    <MotionTableRow
                      key={medicine.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                    >
                      <TableCell className="font-medium text-foreground">{medicine.name}</TableCell>
                      <TableCell className="text-foreground">{medicine.category}</TableCell>
                      <TableCell className="text-foreground">{medicine.unit}</TableCell>
                      <TableCell className="text-foreground font-semibold">{medicine.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{medicine.reorder_level}</TableCell>
                      <TableCell className="text-muted-foreground">{medicine.expiry_date}</TableCell>
                      <TableCell>
                        <StatusBadge status={status}>
                          {status === 'safe' && 'Safe Stock'}
                          {status === 'low' && 'Low Stock'}
                          {status === 'critical' && 'Critical'}
                          {status === 'out' && 'Out of Stock'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="size-8 hover:text-primary">
                              <Eye className="size-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="size-8 hover:text-primary">
                              <Edit className="size-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </MotionTableRow>
                  );
                })}
                {filteredMedicines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-4 rounded-full bg-muted">
                          <Search className="size-8 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No medicines found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters to find what you&apos;re looking for.
                        </p>
                        {searchQuery && (
                          <Button
                            variant="link"
                            onClick={() => setSearchQuery('')}
                            className="mt-2"
                          >
                            Clear all searches
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
              delayChildren: 0.3,
            },
          },
        }}
        className="md:hidden space-y-3"
      >
        {filteredMedicines.map((medicine) => {
          const status = getStockStatus(medicine.quantity, medicine.reorder_level);
          return (
            <motion.div
              key={medicine.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.category}</p>
                    </div>
                    <StatusBadge status={status}>
                      {status === 'safe' && 'Safe'}
                      {status === 'low' && 'Low'}
                      {status === 'critical' && 'Critical'}
                      {status === 'out' && 'Out'}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="ml-1 text-foreground font-medium">{medicine.quantity} {medicine.unit}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reorder:</span>
                      <span className="ml-1 text-foreground">{medicine.reorder_level}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="ml-1 text-foreground">{medicine.expiry_date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Eye className="size-4" />
                        <span className="text-sm">View</span>
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="size-4" />
                        <span className="text-sm">Edit</span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filteredMedicines.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="p-4 rounded-full bg-muted inline-block mb-4">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No medicines found</p>
            <p className="text-sm text-muted-foreground mb-6">
              Adjust your search or filters.
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

