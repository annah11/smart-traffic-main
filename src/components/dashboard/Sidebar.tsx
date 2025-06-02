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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Home,
  Map,
  Camera,
  BarChart3,
  AlertTriangle,
  Activity,
  HardDrive,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { state } = useSidebar();
  const isDarkMode = theme === "dark";

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    const auth = getAuth();
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/adminlogin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center gap-2">
        <div className={cn("rounded-md p-1", isDarkMode ? "bg-blue-600" : "bg-blue-500")}>
          <Camera className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">smart traffic</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin Dashboard">
                  <Link to="/admindashboard" data-active={isActive("/admindashboard")}>
                    <User className="h-4 w-4 mr-2" />
                    Admin Dashboard
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
        <SidebarGroupContent className="w-full">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
