import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Shield, Database, Monitor } from "lucide-react";

const SettingsView = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" />
                System Settings
              </h1>
              <p className="text-muted-foreground">Configure system preferences and notifications</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>Configure how you receive alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts in browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Alert Sound</Label>
                      <p className="text-sm text-muted-foreground">Play sound for critical alerts</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>Manage security settings and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Additional security layer</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    <CardTitle>Data Management</CardTitle>
                  </div>
                  <CardDescription>Configure data retention and backup settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Retention Period</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Daily system backups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    <CardTitle>Display</CardTitle>
                  </div>
                  <CardDescription>Customize your viewing experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default View</Label>
                    <Select defaultValue="grid">
                      <SelectTrigger>
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid View</SelectItem>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="map">Map View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Dense layout with smaller elements</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SettingsView;