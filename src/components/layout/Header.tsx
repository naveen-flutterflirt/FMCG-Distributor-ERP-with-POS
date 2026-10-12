'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Bell,
  Building2,
  Menu,
  Calculator,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { COMPANIES } from '@/data/mockData';

interface HeaderProps {
  onToggleMobile: () => void;
  selectedCompany: string;
  onSelectCompany: (companyId: string) => void;
  onOpenNewOrderModal?: () => void;
}

export default function Header({
  onToggleMobile,
  selectedCompany,
  onSelectCompany,
  onOpenNewOrderModal
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input matching Page 4: "Search outlet, SKU, invoice..." */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search outlet, SKU, invoice..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Company Dropdown: "Company: All ▾" */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          <span className="font-medium hidden sm:inline text-slate-600">Company:</span>
          <select
            value={selectedCompany}
            onChange={(e) => onSelectCompany(e.target.value)}
            aria-label="Filter by Company"
            className="bg-transparent font-semibold text-slate-900 border-none focus:outline-hidden text-xs cursor-pointer"
          >
            {COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* POS Counter Billing Quick Action */}
        <Link
          href="/pos"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
          title="Direct Cash-and-Carry POS Terminal"
        >
          <Calculator className="w-3.5 h-3.5 text-teal-700" />
          <span>POS Terminal</span>
        </Link>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="System Alerts & Notifications"
            aria-label="View system alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800">
                <span>Operational Alerts</span>
                <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-bold">
                  3 Critical
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="flex gap-2.5 p-2 bg-amber-50/60 rounded-lg border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Van 2 Shortage −₹1,240</p>
                    <p className="text-[11px] text-slate-600">Imran Khan - Route R6 Industrial Area needs cashier sign-off.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 p-2 bg-rose-50/60 rounded-lg border border-rose-100">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Company B Claim Window</p>
                    <p className="text-[11px] text-slate-600">Closes in 6 days for September schemes (₹2.14L at stake).</p>
                  </div>
                </div>
                <div className="flex gap-2.5 p-2 bg-teal-50/60 rounded-lg border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Bank Auto-Match 94.8%</p>
                    <p className="text-[11px] text-slate-600">201 of 212 statements matched automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary "+ New order" Button matching Page 4 */}
        <button
          onClick={onOpenNewOrderModal}
          className="flex items-center gap-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New order</span>
        </button>
      </div>
    </header>
  );
}
