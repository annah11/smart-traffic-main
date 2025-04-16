
import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { 
  BarChart3, 
  Camera, 
  Settings, 
  Home, 
  Map, 
  AlertTriangle,
  Activity,
  HardDrive,
  Bell,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-traffic-blue p-1">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">FlowVision</span>
            <span className="text-xs text-muted-foreground">Traffic Control</span>
          </div>
          <button className="ml-auto h-8 w-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center" data-active={true}>
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/map" className="flex items-center">
                    <Map className="h-4 w-4 mr-2" />
                    Traffic Map
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/cameras" className="flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Camera Feeds
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/analytics" className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/alerts" className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Alerts
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <div className="sidebar-group-label mb-2">
            <span className="flex-1 text-xs font-medium uppercase text-sidebar-foreground/70">SYSTEM</span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/system-status" className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    System Status
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/devices" className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2" />
                    IoT Devices
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">AT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-muted-foreground">Traffic Control</span>
            </div>
          </div>
          <button className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
