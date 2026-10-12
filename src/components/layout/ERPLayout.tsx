'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NewOrderModal from '../common/NewOrderModal';
import { Menu } from 'lucide-react';

interface ERPLayoutProps {
  children: React.ReactNode;
}

export default function ERPLayout({ children }: ERPLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

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

          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="bg-[#00897b] hover:bg-[#00796b] text-white px-2.5 py-1 rounded text-xs font-semibold shadow-xs"
          >
            + Order
          </button>
        </div>

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
