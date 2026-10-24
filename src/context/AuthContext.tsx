'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    try {
      const storedToken = localStorage.getItem('fmcg_auth_token');
      const storedUser = localStorage.getItem('fmcg_auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error reading auth from storage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Login failed' };
      }

      const receivedToken = data.data.token;
      const receivedUser = data.data.user;

      setToken(receivedToken);
      setUser(receivedUser);

      localStorage.setItem('fmcg_auth_token', receivedToken);
      localStorage.setItem('fmcg_auth_user', JSON.stringify(receivedUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Cannot connect to backend server' };
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: resData.message || 'Registration failed' };
      }

      const receivedToken = resData.data.token;
      const receivedUser = resData.data.user;

      setToken(receivedToken);
      setUser(receivedUser);

      localStorage.setItem('fmcg_auth_token', receivedToken);
      localStorage.setItem('fmcg_auth_user', JSON.stringify(receivedUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Cannot connect to backend server' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fmcg_auth_token');
    localStorage.removeItem('fmcg_auth_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
