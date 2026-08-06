import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active?: boolean;
  last_login_at?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to determine base API URL for client requests
function getApiBase(): string {
  if (typeof window === 'undefined') return '/api';
  const hostname = window.location.hostname;
  const port = window.location.port;

  // In local Vite dev environment, fallback to backend port 5000 if not proxied
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '5173') {
    return 'http://localhost:5000/api';
  }

  const pathname = window.location.pathname;

  const prefixes = [
    '/provider_pathways_dashboard_v3',
    '/provider_pathways_dashboard_v2',
    '/provider_dashboard_v1',
    '/provider_pathways_dashboard_v1',
    '/provider_pathways_v2_testing',
    '/provider_pathways',
    '/provider_pathway',
    '/provider_activity'
  ];

  for (const prefix of prefixes) {
    if (pathname.startsWith(prefix)) {
      return `${prefix}/api`;
    }
  }

  return '/api';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/auth/me`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok && data.success && data.authenticated && data.admin) {
        setAdmin(data.admin);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = {};
      }

      if (res.ok && data.success && data.admin) {
        setAdmin(data.admin);
        setIsAuthenticated(true);
        setError(null);
        return { success: true };
      } else {
        let errorMessage = data.error;
        if (!errorMessage) {
          if (res.status === 401) errorMessage = 'Incorrect email or password. Please try again.';
          else if (res.status === 403) errorMessage = 'Your account has been deactivated.';
          else if (res.status === 429) errorMessage = 'Too many login attempts. Please wait 15 minutes.';
          else errorMessage = 'Invalid email or password.';
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      const errorMessage = 'Unable to connect to the server. Please check your network connection.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.warn('[AuthContext] Logout fetch warning:', err);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, isLoading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
