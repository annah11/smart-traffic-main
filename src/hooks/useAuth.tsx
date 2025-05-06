
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

// Define the auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    // In a real app, this would call an API
    // For now, we'll simulate user creation with localStorage
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find((u: any) => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
    };
    
    // Store in "database"
    localStorage.setItem('users', JSON.stringify([...existingUsers, { ...newUser, password }]));
    
    // Update auth state
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    
    return newUser;
  };

  // Login existing user
  const login = async (email: string, password: string): Promise<User | null> => {
    // In a real app, this would call an API
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const matchedUser = existingUsers.find(
      (u: any) => u.email === email && u.password === password
    );
    
    if (!matchedUser) {
      throw new Error('Invalid credentials');
    }
    
    const loggedInUser: User = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role
    };
    
    // Update auth state
    setUser(loggedInUser);
    localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    
    return loggedInUser;
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
