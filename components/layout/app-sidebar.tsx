'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Pill,
  ArrowRightLeft,
  Activity,
  Bell,
  FileText,
  Users,
  Settings,
  LogOut,
  HeartPulse,
  Database,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Medicines', url: '/medicines', icon: Pill },
    { title: 'Stock Transactions', url: '/transactions', icon: ArrowRightLeft },
    { title: 'Health Programs', url: '/programs', icon: Activity },
    { title: 'Alerts', url: '/alerts', icon: Bell },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Users', url: '/users', icon: Users },
    { title: 'SQL Editor', url: '/sql-editor', icon: Database },
    { title: 'Settings', url: '/settings', icon: Settings },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center p-4">
        <HeartPulse className="h-6 w-6 text-teal-600 shrink-0" />
        <span className="font-bold text-lg text-teal-800 ml-2 truncate">B-Healthcare</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/login">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
