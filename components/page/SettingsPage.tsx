'use client';

import { useState } from 'react';
import { Building2, User, Bell, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure system preferences</p>
      </div>

      {/* Tabs - Desktop */}
      <div className="hidden md:flex items-center gap-2 border-b border-border">
        {[
          { id: 'barangay', label: 'Barangay Profile', icon: Building2 },
          { id: 'account', label: 'Account Settings', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'alerts', label: 'Alert Thresholds', icon: AlertTriangle },
          { id: 'system', label: 'System', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              <span className="text-sm">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs - Mobile */}
      <div className="md:hidden">
        <select 
          value={activeTab} 
          onChange={(e) => setActiveTab(e.target.value)} 
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="barangay">Barangay Profile</option>
          <option value="account">Account Settings</option>
          <option value="notifications">Notifications</option>
          <option value="alerts">Alert Thresholds</option>
          <option value="system">System</option>
        </select>
      </div>

      <div className="mt-6">
        {activeTab === 'barangay' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-6">Barangay Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="b-name">Barangay Name</Label>
                    <Input id="b-name" defaultValue="Barangay San Roque" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Municipality</Label>
                    <Input id="city" defaultValue="Quezon City" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'account' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-6">Your Account</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" defaultValue="Maria Santos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="maria.santos@barangay.gov" />
                  </div>
                </div>
                <Button>Update Account</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg text-foreground mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when medicines are low</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Expiry Warnings</Label>
                    <p className="text-sm text-muted-foreground">Alert for expiring medicines</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Program Reminders</Label>
                    <p className="text-sm text-muted-foreground">Remind about scheduled programs</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="pt-4">
                  <Button className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white px-8">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'alerts' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg text-foreground mb-6">Alert Threshold Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="low-threshold" className="text-sm font-medium">Low Stock Threshold (%)</Label>
                  <Input id="low-threshold" type="number" defaultValue="30" className="h-11" />
                  <p className="text-xs text-muted-foreground">Alert when stock falls below this percentage of reorder level</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="critical-threshold" className="text-sm font-medium">Critical Stock Threshold (%)</Label>
                  <Input id="critical-threshold" type="number" defaultValue="10" className="h-11" />
                  <p className="text-xs text-muted-foreground">Alert when stock is critically low</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry-days" className="text-sm font-medium">Expiry Warning Days</Label>
                  <Input id="expiry-days" type="number" defaultValue="90" className="h-11" />
                  <p className="text-xs text-muted-foreground">Warn when medicines will expire within this many days</p>
                </div>

                <div className="pt-4">
                  <Button className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white px-8">
                    Save Thresholds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'system' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-6">System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span>Dark Mode</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Automatic Backups</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
