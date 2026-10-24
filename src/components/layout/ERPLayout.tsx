'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import NewOrderModal from '../common/NewOrderModal';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ERPLayoutProps {
  children: React.ReactNode;
}

export default function ERPLayout({ children }: ERPLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !token && pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, token, pathname, router]);

  // Loading splash while checking token
  if (loading || (!token && pathname !== '/login')) {
    return (
      <div className="min-h-screen bg-[#072428] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-teal-200">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f4f8] flex text-slate-800 font-sans">
      {/* Exact Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-56 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 bg-[#072428] text-white border-b border-[#0c383e] shadow-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 -ml-1 text-[#8ea8a2] hover:text-white rounded-md hover:bg-[#0c3339] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-6 h-6 rounded-md bg-[#00897b] flex items-center justify-center text-white font-bold text-sm leading-none">
              +
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              [Distributor] ERP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="bg-[#00897b] hover:bg-[#00796b] text-white px-2.5 py-1 rounded text-xs font-semibold shadow-xs"
            >
              + Order
            </button>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-red-300 hover:text-white rounded bg-red-950/40"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
      />
    </div>
  );
}
