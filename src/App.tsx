import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Index from "./pages/Index";
import Login from "./pages/login";
import AdminLogin from "./pages/adminlogin";
import AdminSignup from "./pages/adminsignup";
import UserSignup from "./pages/usersignup";
import AdminDashboard from "./pages/AdminDashboard";
import AlertsView from "./pages/AlertsView";
import CameraFeedsView from "./pages/CameraFeedsView";
import SettingsView from "./pages/SettingsView";
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/Account";
import ForgotPassword from "./pages/ForgotPassword";
import SystemStatusView from "./pages/SystemStatusView";
import IoTDevicesView from "./pages/IoTDevicesView";
import DeviceLogsView from "./pages/DeviceLogs"; // NEW: Log details page
import { TrafficMap } from "./pages/Trafficmap"; // ✅ Named import for TrafficMap
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/adminsignup" element={<AdminSignup />} />

              {/* Admin-only route */}
              <Route
                path="/admindashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              {/* Public or logged-in accessible routes */}
              <Route path="/dashboard" element={<Index />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/alerts" element={<AlertsView />} />
              <Route path="/cameras" element={<CameraFeedsView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/system-status" element={<SystemStatusView />} />
              <Route path="/devices" element={<IoTDevicesView />} />
              <Route path="/logs/:deviceId" element={<DeviceLogsView />} />
              <Route path="/map" element={<TrafficMap />} /> {/* ✅ Traffic Map route */}

              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-center" autoClose={3000} />
          </main>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
