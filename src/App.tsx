// src/App.tsx

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
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// 🔒 Protected Route
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
              <Route path="/dashboard" element={<Index />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/adminsignup" element={<AdminSignup />} />
              
              {/* ✅ Admin-Only Access */}
             <Route
  path="/admindashboard"
  element={
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  }
/>


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
