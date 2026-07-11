import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { demoCustomer, demoAdmin } from '../data/users';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  joinedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginAsDemo: (role: 'customer' | 'admin') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password: string, role?: 'customer' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('rrs_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('rrs_user', JSON.stringify(user));
    else localStorage.removeItem('rrs_user');
  }, [user]);

  const loginAsDemo = (role: 'customer' | 'admin') => {
    setUser(role === 'admin' ? demoAdmin : demoCustomer);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await authService.login(email, password);
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('authToken', token);
        setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string, role?: 'customer' | 'admin'): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.register(name, email, password, role);
      if (response.data.success) {
        // Don't auto-login user after registration
        return { success: true };
      } else {
        return { success: false, error: response.data.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    authService.logout();
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginAsDemo, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
