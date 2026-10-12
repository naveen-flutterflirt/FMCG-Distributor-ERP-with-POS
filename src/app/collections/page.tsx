'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  IndianRupee,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Building2,
  FileText
} from 'lucide-react';
import { MOCK_OUTLETS } from '@/data/mockData';

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 07 · Credit &amp; Collections</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Retailer Ledger &amp; Ageing Receivables
            </h1>
            <p className="text-xs text-slate-500">
              Credit control under 21 days, automated bill-level receipts, and payment link dispatches.
            </p>
          </div>

          <button
            onClick={() => showNotification({
              title: 'Reminders Queued',
              message: 'Bulk WhatsApp payment reminders with dynamic UPI QR links have been dispatched to retailers with overdue balances.',
              type: 'success'
            })}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send WhatsApp Reminders</span>
          </button>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Outstanding
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹62.4L</div>
            <span className="text-[11px] text-slate-500">Across 3,180 billed retailers</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              DSO (Days Sales Outstanding)
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">11 days</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Target ≤ 12 days (Compliant)</span>
          </div>

          <div className="bg-white border border-rose-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
              Overdue &gt; 21 Days
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1">₹9.8L</div>
            <span className="text-[11px] text-rose-600 font-semibold">Auto-blocked at Billing Desk</span>
          </div>
        </div>

        {/* Outstanding Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Retailer Credit Ledger &amp; Due Dates
            </h3>
            <span className="text-xs text-slate-500 font-medium">Sorted by highest overdue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Outlet Name</th>
                  <th className="py-2.5 px-3">Route / Beat</th>
                  <th className="py-2.5 px-3 text-right">Credit Limit</th>
                  <th className="py-2.5 px-3 text-right">Balance Due</th>
                  <th className="py-2.5 px-3 text-center">Overdue Days</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_OUTLETS.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{o.name}</td>
                    <td className="py-3 px-3 text-slate-600">{o.route}</td>
                    <td className="py-3 px-3 text-right text-slate-700">₹{o.creditLimit.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">₹{o.currentBalance.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-semibold ${o.overdueDays > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        {o.overdueDays > 0 ? `${o.overdueDays} days` : '0 days'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        o.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {o.status === 'active' ? 'Clear' : 'Credit Hold'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => showNotification({
                          title: 'Payment Receipt Captured',
                          message: `Payment collected for ${o.name}. Ledger credited and day-end bank reconciliation updated.`,
                          type: 'success'
                        })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px]"
                      >
                        Record Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
