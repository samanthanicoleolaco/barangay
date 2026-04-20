'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Calendar, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const monthlyUsage = [
  { id: 'jan', month: 'Jan', usage: 450 },
  { id: 'feb', month: 'Feb', usage: 520 },
  { id: 'mar', month: 'Mar', usage: 480 },
  { id: 'apr', month: 'Apr', usage: 610 },
];

const categoryUsage = [
  { id: 'analgesic', name: 'Analgesic', value: 320 },
  { id: 'antibiotic', name: 'Antibiotic', value: 180 },
  { id: 'antihypertensive', name: 'Antihypertensive', value: 240 },
  { id: 'vitamin', name: 'Vitamin', value: 150 },
];

const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'];

const topMedicines = [
  { name: 'Paracetamol 500mg', used: 520, category: 'Analgesic' },
  { name: 'Amoxicillin 500mg', used: 380, category: 'Antibiotic' },
  { name: 'Losartan 50mg', used: 340, category: 'Antihypertensive' },
  { name: 'Vitamin C 500mg', used: 280, category: 'Vitamin' },
  { name: 'Ibuprofen 400mg', used: 250, category: 'Analgesic' },
];

const expiringMedicines = [
  { name: 'Amoxicillin 250mg', quantity: 45, expiryDate: '2026-04-30', daysLeft: 18 },
  { name: 'Metformin 850mg', quantity: 30, expiryDate: '2026-05-15', daysLeft: 33 },
  { name: 'Cetirizine 10mg', quantity: 60, expiryDate: '2026-06-20', daysLeft: 69 },
];

export function ReportsPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics and printable summaries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
          <Button>
            <Download className="size-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Medicines</p>
            <p className="text-2xl lg:text-3xl font-semibold text-foreground">190</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">This Month Usage</p>
            <p className="text-2xl lg:text-3xl font-semibold text-foreground">610</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Stock Value</p>
            <p className="text-2xl lg:text-3xl font-semibold text-foreground">₱85K</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Expiring Soon</p>
            <p className="text-2xl lg:text-3xl font-semibold text-foreground">3</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <CardTitle>Monthly Medicine Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyUsage}>
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
                  <Bar dataKey="usage" fill="#0d9488" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <CardTitle>Usage by Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {categoryUsage.map((entry) => (
                      <Cell key={entry.id} fill={COLORS[categoryUsage.indexOf(entry) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e4e4e7',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Used Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topMedicines.map((med) => (
              <div key={med.name} className="flex items-center gap-4">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {topMedicines.indexOf(med) + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{med.used}</p>
                  <p className="text-xs text-muted-foreground">units used</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiring Medicine Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm text-muted-foreground pb-3">Medicine</th>
                  <th className="text-left text-sm text-muted-foreground pb-3">Quantity</th>
                  <th className="text-left text-sm text-muted-foreground pb-3">Expiry Date</th>
                  <th className="text-left text-sm text-muted-foreground pb-3">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiringMedicines.map((med) => (
                  <tr key={med.name} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-foreground">{med.name}</td>
                    <td className="py-3 text-sm text-foreground">{med.quantity}</td>
                    <td className="py-3 text-sm text-muted-foreground">{med.expiryDate}</td>
                    <td className="py-3">
                      <span className={`text-sm font-medium ${
                        med.daysLeft < 30 ? 'text-[var(--status-critical)]' : 'text-[var(--status-low)]'
                      }`}>
                        {med.daysLeft} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {expiringMedicines.map((med) => (
              <div key={med.name} className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium text-foreground mb-2">{med.name}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="ml-1 text-foreground">{med.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="ml-1 text-foreground">{med.expiryDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`font-medium ${
                      med.daysLeft < 30 ? 'text-[var(--status-critical)]' : 'text-[var(--status-low)]'
                    }`}>
                      {med.daysLeft} days left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
