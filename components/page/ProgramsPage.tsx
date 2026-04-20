'use client';

import { StatusBadge } from '@/components/status-badge';
import { Calendar, Users, CheckCircle, Clock, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Program {
  id: number;
  name: string;
  schedule: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  medicines: { name: string; quantity: number; available: number; status: 'safe' | 'low' | 'critical' }[];
}

const programs: Program[] = [
  { id: 1, name: 'Senior Citizen Monthly Check-up', schedule: 'Today', date: '2026-04-12', status: 'ongoing', participants: 45, medicines: [{ name: 'Losartan 50mg', quantity: 45, available: 18, status: 'low' }, { name: 'Metformin 500mg', quantity: 30, available: 5, status: 'critical' }, { name: 'Aspirin 100mg', quantity: 45, available: 0, status: 'critical' }] },
  { id: 2, name: 'Vaccination Day', schedule: 'April 15, 2026', date: '2026-04-15', status: 'upcoming', participants: 80, medicines: [{ name: 'Paracetamol 500mg', quantity: 100, available: 500, status: 'safe' }, { name: 'Vitamin C 500mg', quantity: 80, available: 22, status: 'low' }] },
  { id: 3, name: 'Deworming Program', schedule: 'April 18, 2026', date: '2026-04-18', status: 'upcoming', participants: 120, medicines: [{ name: 'Albendazole 400mg', quantity: 120, available: 150, status: 'safe' }, { name: 'Vitamin A Capsules', quantity: 120, available: 200, status: 'safe' }] },
  { id: 4, name: 'Maternal Care Program', schedule: 'April 8, 2026', date: '2026-04-08', status: 'completed', participants: 25, medicines: [{ name: 'Folic Acid 5mg', quantity: 25, available: 100, status: 'safe' }, { name: 'Iron Supplements', quantity: 25, available: 80, status: 'safe' }] },
];

export function ProgramsPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Health Programs</h1>
        <p className="text-sm text-muted-foreground mt-1">Active barangay healthcare activities</p>
      </div>

      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{program.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="size-4" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-4" />
                      <span>{program.participants} participants</span>
                    </div>
                  </div>
                </div>
                <div>
                  {program.status === 'ongoing' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--status-info-bg)] text-[var(--status-info)]">
                      <Clock className="size-3" />
                      Ongoing
                    </span>
                  )}
                  {program.status === 'upcoming' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <Calendar className="size-3" />
                      Upcoming
                    </span>
                  )}
                  {program.status === 'completed' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--status-safe-bg)] text-[var(--status-safe)]">
                      <CheckCircle className="size-3" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="size-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">Medicine Requirements</h4>
                </div>
                <div className="space-y-2">
                  {program.medicines.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{med.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Need: {med.quantity} | Available: {med.available}
                        </p>
                      </div>
                      <StatusBadge status={med.status}>
                        {med.status === 'safe' && 'Ready'}
                        {med.status === 'low' && 'Low'}
                        {med.status === 'critical' && 'Critical'}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="md:hidden space-y-4">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardContent className="pt-4">
              <div className="mb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground flex-1">{program.name}</h3>
                  {program.status === 'ongoing' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--status-info-bg)] text-[var(--status-info)]"><Clock className="size-3" />Ongoing</span>}
                  {program.status === 'upcoming' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">Upcoming</span>}
                  {program.status === 'completed' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--status-safe-bg)] text-[var(--status-safe)]"><CheckCircle className="size-3" />Done</span>}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="size-4" /><span>{program.schedule}</span></div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="size-4" /><span>{program.participants} participants</span></div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Medicine Requirements</p>
                <div className="space-y-2">
                  {program.medicines.map((med, index) => (
                    <div key={index} className="flex items-start justify-between p-2 rounded-lg bg-muted">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.quantity} needed · {med.available} available</p>
                      </div>
                      <StatusBadge status={med.status}>
                        {med.status === 'safe' && 'Ready'}
                        {med.status === 'low' && 'Low'}
                        {med.status === 'critical' && 'Critical'}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
