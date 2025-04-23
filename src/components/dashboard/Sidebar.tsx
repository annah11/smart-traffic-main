
import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
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
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Helper to determine if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center gap-2">
        <div className={cn("rounded-md p-1", isDarkMode ? "bg-blue-600" : "bg-blue-500")}>
          <Camera className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">FlowVision</span>
          <span className="text-xs text-muted-foreground">Traffic Control</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/" data-active={isActive("/")}>
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Traffic Map">
                  <Link to="/map" data-active={isActive("/map")}>
                    <Map className="h-4 w-4 mr-2" />
                    Traffic Map
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Camera Feeds">
                  <Link to="/cameras" data-active={isActive("/cameras")}>
                    <Camera className="h-4 w-4 mr-2" />
                    Camera Feeds
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Analytics">
                  <Link to="/analytics" data-active={isActive("/analytics")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Alerts">
                  <Link to="/alerts" data-active={isActive("/alerts")}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Alerts
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>SYSTEM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="System Status">
                  <Link to="/system-status" data-active={isActive("/system-status")}>
                    <Activity className="h-4 w-4 mr-2" />
                    System Status
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="IoT Devices">
                  <Link to="/devices" data-active={isActive("/devices")}>
                    <HardDrive className="h-4 w-4 mr-2" />
                    IoT Devices
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/settings" data-active={isActive("/settings")}>
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
