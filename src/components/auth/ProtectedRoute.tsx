
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log('Auth status:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-secondary rounded"></div>
          <div className="h-4 w-48 bg-secondary/70 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Pass the current path as state so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};
