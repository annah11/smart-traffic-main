import React, { useState } from "react";
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
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { state } = useSidebar();
  const isDarkMode = theme === "dark";
  const auth = getAuth();
  const user = auth.currentUser;
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
      setLogoutOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center gap-2">
        <Link to="/account" className="cursor-pointer">
          <Avatar className="h-9 w-9">
            {user?.photoURL && <AvatarImage src={user.photoURL} alt="Profile" />}
            <AvatarFallback>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
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
                  <Link to="/dashboard" data-active={isActive("/dashboard")}>
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
              <SidebarMenuButton onClick={() => setLogoutOpen(true)} tooltip="Log out">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
