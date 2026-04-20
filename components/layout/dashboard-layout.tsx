'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Pill,
  ArrowLeftRight,
  Heart,
  Bell,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/medicines', icon: Pill, label: 'Medicines' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Stock Transactions' },
  { path: '/programs', icon: Heart, label: 'Health Programs' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/medicines', icon: Pill, label: 'Medicines' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/programs', icon: Heart, label: 'Programs' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="hidden lg:flex lg:flex-col lg:w-64 bg-sidebar border-r border-sidebar-border"
      >
        <div className="p-6 border-b border-sidebar-border">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">B-Healthcare</h1>
              <p className="text-xs text-muted-foreground">Medicine Inventory</p>
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
              >
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="p-4 border-t border-sidebar-border"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <LogOut className="size-5" />
            )}
            <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
          >
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                  <Pill className="size-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-sidebar-foreground">B-Healthcare</h1>
                  <p className="text-xs text-muted-foreground">Medicine Inventory</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="size-6 text-sidebar-foreground" />
              </motion.button>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <Icon className="size-5 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <LogOut className="size-5" />
                )}
                <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-6 text-foreground" />
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Pill className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">B-Healthcare</span>
          </div>
          <div className="size-6" />
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Bottom Navigation */}
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 flex items-center justify-around z-30"
        >
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[64px] ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="size-5 shrink-0" />
                  </motion.div>
                  <span className="text-xs">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </motion.nav>
      </div>
    </div>
  );
}
