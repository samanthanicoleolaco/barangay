'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Shield, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Health Worker' | 'Staff';
  status: 'Active' | 'Inactive';
  lastActive: string;
}

const users: User[] = [
  { id: 1, name: 'Maria Santos', email: 'maria.santos@barangay.gov', role: 'Admin', status: 'Active', lastActive: '2026-04-12 14:30' },
  { id: 2, name: 'Juan dela Cruz', email: 'juan.delacruz@barangay.gov', role: 'Health Worker', status: 'Active', lastActive: '2026-04-12 13:45' },
  { id: 3, name: 'Pedro Garcia', email: 'pedro.garcia@barangay.gov', role: 'Health Worker', status: 'Active', lastActive: '2026-04-11 16:20' },
  { id: 4, name: 'Ana Reyes', email: 'ana.reyes@barangay.gov', role: 'Staff', status: 'Active', lastActive: '2026-04-10 10:15' },
  { id: 5, name: 'Rosa Mendoza', email: 'rosa.mendoza@barangay.gov', role: 'Staff', status: 'Inactive', lastActive: '2026-03-28 09:00' },
];

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage staff and access</p>
        </div>
        <Button><Plus className="size-4" /><span>Add User</span></Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <Card className="hidden md:block overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left text-sm text-muted-foreground px-6 py-3">Full Name</th>
                <th className="text-left text-sm text-muted-foreground px-6 py-3">Email</th>
                <th className="text-left text-sm text-muted-foreground px-6 py-3">Role</th>
                <th className="text-left text-sm text-muted-foreground px-6 py-3">Status</th>
                <th className="text-left text-sm text-muted-foreground px-6 py-3">Last Active</th>
                <th className="text-left text-sm text-muted-foreground px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2">{user.role === 'Admin' ? <Shield className="size-4 text-primary" /> : <UserIcon className="size-4 text-muted-foreground" />}<span className="text-sm text-foreground">{user.role}</span></div></td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-[var(--status-safe-bg)] text-[var(--status-safe)]' : 'bg-muted text-muted-foreground'}`}>{user.status}</span></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.lastActive}</td>
                  <td className="px-6 py-4"><button className="p-1.5 rounded hover:bg-muted transition-colors"><MoreVertical className="size-4 text-muted-foreground" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="md:hidden space-y-3">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1"><h3 className="font-medium text-foreground mb-1">{user.name}</h3><p className="text-sm text-muted-foreground mb-2">{user.email}</p><div className="flex items-center gap-2">{user.role === 'Admin' ? <Shield className="size-4 text-primary" /> : <UserIcon className="size-4 text-muted-foreground" />}<span className="text-sm text-foreground">{user.role}</span></div></div>
                <button className="p-1.5"><MoreVertical className="size-5 text-muted-foreground" /></button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-[var(--status-safe-bg)] text-[var(--status-safe)]' : 'bg-muted text-muted-foreground'}`}>{user.status}</span><span className="text-xs text-muted-foreground">Last: {user.lastActive}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
