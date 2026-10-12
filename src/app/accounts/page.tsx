'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  Landmark,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Receipt,
  FileText
} from 'lucide-react';

export default function FinanceAccounts() {
  const [exportedTally, setExportedTally] = useState(false);
  const { showNotification } = useNotification();

  const handleExportTally = () => {
    setExportedTally(true);
    showNotification({
      title: 'Tally XML Exported',
      message: 'Double-entry day book vouchers and ledgers exported in Tally XML format.',
      type: 'success'
    });
    setTimeout(() => setExportedTally(false), 3000);
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header matching Page 8 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">07 · Web — Finance & Accounts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Real double-entry books, posted automatically from operations
            </h1>
            <p className="text-xs text-slate-500">
              Every invoice, receipt, GRN, claim and van settlement posts its own journal entries — no re-entry into a separate accounting package.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportTally}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{exportedTally ? 'Exported Tally XML ✓' : 'Export Tally XML for CA'}</span>
            </button>
            <button
              onClick={() => showNotification({
                title: 'Period Lock Active',
                message: 'September books locked. Back-dated postings, vouchers, and edits frozen for statutory CA audit.',
                type: 'warning'
              })}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Month-end Period Lock</span>
            </button>
          </div>
        </div>

        {/* 5 Top KPI Cards matching Page 8 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Bank balance */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Bank balance
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹48.2<span className="text-base font-bold text-slate-700">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              3 accounts · reconciled to 8 Oct
            </div>
          </div>

          {/* 2. Receivables */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Receivables
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹62.4<span className="text-base font-bold text-slate-700">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              DSO <strong className="text-slate-800">11 days</strong> (Target ≤ 12 d)
            </div>
          </div>

          {/* 3. Payable to companies */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Payable to companies
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹1.06<span className="text-base font-bold text-slate-700">Cr</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-rose-600 font-semibold">
              ₹38L due this week
            </div>
          </div>

          {/* 4. GST payable (Oct est.) */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              GST payable (Oct est.)
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹4.1<span className="text-base font-bold text-slate-700">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
              ITC matched 98.6%
            </div>
          </div>

          {/* 5. Net profit MTD */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Net profit MTD
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              ₹3.9<span className="text-base font-bold text-emerald-800">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
              2.0% of sales
            </div>
          </div>
        </div>

        {/* Main Content Grid matching Page 8 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: P&L September matching exact numbers (Takes 5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                P&amp;L — September
              </h3>
              <span className="text-[10px] text-slate-500">Audited Monthly</span>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Sales (net of returns)</span>
                <span className="font-bold text-slate-900">₹6.42Cr</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Cost of goods sold</span>
                <span className="font-semibold text-slate-800">₹5.96Cr</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Scheme income (claims)</span>
                <span className="font-semibold text-teal-700">₹0.18Cr</span>
              </div>

              <div className="py-2 border-y border-slate-200 flex justify-between font-bold text-slate-900 bg-slate-50/70 px-2 rounded-md">
                <span>Gross margin</span>
                <span>₹0.64Cr · <strong className="text-emerald-700">10.0%</strong></span>
              </div>

              <div className="pt-1 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Salaries &amp; incentives</span>
                  <span className="font-medium text-slate-800">₹0.22Cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle &amp; fuel</span>
                  <span className="font-medium text-slate-800">₹0.08Cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Rent, power, other</span>
                  <span className="font-medium text-slate-800">₹0.07Cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest &amp; bank charges</span>
                  <span className="font-medium text-slate-800">₹0.05Cr</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-emerald-700 text-sm bg-emerald-50/70 p-2 rounded-lg">
                <span>Net profit</span>
                <span>₹0.22Cr · 3.4%</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Bank Recon + GST Statutory (Takes 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Bank reconciliation */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-2.5 pb-2 border-b border-slate-100">
                Bank reconciliation
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Statement lines (8 Oct)</span>
                  <span className="font-bold text-slate-900">212</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Auto-matched</span>
                  <span className="font-bold text-emerald-700">201 (94.8%)</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Needs review</span>
                  <span className="font-bold text-amber-700">11</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500 leading-snug bg-slate-50 p-2 rounded-md">
                UPI and NEFT matched to retailer by reference; unidentified credits parked in suspense
              </p>
            </div>

            {/* GST & statutory */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-2.5 pb-2 border-b border-slate-100">
                GST &amp; statutory
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">GSTR-1 (Sep)</span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Filed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">GSTR-3B (Sep)</span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Due 20 Oct
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">GSTR-2B vs purchase</span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    4 mismatches
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">TDS / TCS</span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Computed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payables to Companies + Accounting features (Takes 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Payables to companies */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-2.5 pb-2 border-b border-slate-100">
                Payables to companies
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">Company A</span>
                  <span className="text-slate-500">12 Oct</span>
                  <span className="font-bold text-slate-900">₹18.4L</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">Company B</span>
                  <span className="text-slate-500">14 Oct</span>
                  <span className="font-bold text-slate-900">₹12.9L</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">Company C</span>
                  <span className="text-teal-700 font-semibold">Advance</span>
                  <span className="font-bold text-slate-900">₹6.7L</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500 leading-snug">
                Claim credit notes adjusted before payment
              </p>
            </div>

            {/* Accounting features */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 pb-2 border-b border-slate-100">
                Accounting features
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>Chart of accounts, cost centres per company / route</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>Day book, ledgers, trial balance, balance sheet</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>Fixed assets &amp; depreciation (vans, racks)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>Expense vouchers with photo receipts</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>Period lock after month close</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
