'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { Skeleton, SkeletonCard } from '@/components/common/Skeleton';
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
  FileText,
  RefreshCw,
  Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FinanceAccounts() {
  const [loading, setLoading] = useState(true);
  const [exportingTally, setExportingTally] = useState(false);
  const [lockingPeriod, setLockingPeriod] = useState(false);
  const [periodLocked, setPeriodLocked] = useState(false);
  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  // Dynamic States default to 0 for true tenant isolation
  const [overview, setOverview] = useState<any>({
    kpis: {
      bankBalance: 0,
      receivables: 0,
      dsoDays: 0,
      payables: 0,
      dueThisWeek: 0,
      gstPayable: 0,
      itcMatchedPercentage: 0,
      netProfitMtd: 0,
      netProfitPercent: 0
    },
    payablesList: []
  });

  const [pnl, setPnl] = useState<any>({
    month: 'Current Month',
    sales: 0,
    cogs: 0,
    schemeIncome: 0,
    grossMargin: 0,
    grossMarginPercent: '0.0',
    expenses: {
      salaries: 0,
      vehicleFuel: 0,
      rentPower: 0,
      interestCharges: 0,
      total: 0
    },
    netProfit: 0,
    netProfitPercent: '0.0'
  });

  const [bankRecon, setBankRecon] = useState<any>({
    statementLines: 0,
    autoMatched: 0,
    autoMatchedPercent: '0.0',
    needsReview: 0
  });

  const fetchAccountsData = async () => {
    if (authLoading) return;
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      };

      const [resOverview, resPnl, resRecon] = await Promise.all([
        fetch(`${API_BASE}/accounts/overview`, { headers }),
        fetch(`${API_BASE}/accounts/pnl`, { headers }),
        fetch(`${API_BASE}/accounts/bank-recon`, { headers })
      ]);

      if (resOverview.ok) {
        const d = await resOverview.json();
        if (d.success && d.data) setOverview(d.data);
      }
      if (resPnl.ok) {
        const d = await resPnl.json();
        if (d.success && d.data) setPnl(d.data);
      }
      if (resRecon.ok) {
        const d = await resRecon.json();
        if (d.success && d.data) setBankRecon(d.data);
      }
    } catch (err) {
      console.error('Failed to load accounts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsData();
  }, [token, authLoading]);

  const handleExportTally = async () => {
    try {
      setExportingTally(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/accounts/tally-xml`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) throw new Error('Failed to generate Tally XML');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tally_DayBook_${new Date().toISOString().slice(0, 10)}.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showNotification({
        title: 'Tally XML Downloaded',
        message: 'Double-entry day book vouchers and ledgers exported in Tally XML format.',
        type: 'success'
      });
    } catch (err: any) {
      showNotification({
        title: 'Export Failed',
        message: err.message || 'Unable to download Tally XML',
        type: 'error'
      });
    } finally {
      setExportingTally(false);
    }
  };

  const handlePeriodLock = async () => {
    try {
      setLockingPeriod(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/accounts/lock-period`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ month: 'September', year: '2026' })
      });

      const data = await res.json();
      if (data.success) {
        setPeriodLocked(true);
        showNotification({
          title: 'Period Lock Active',
          message: data.data.message || 'September books locked. Back-dated postings, vouchers, and edits frozen for statutory CA audit.',
          type: 'warning'
        });
      }
    } catch (err: any) {
      showNotification({
        title: 'Period Lock Failed',
        message: err.message || 'Could not lock period',
        type: 'error'
      });
    } finally {
      setLockingPeriod(false);
    }
  };

  // Helper formatter for Indian Rupees
  const formatLakhsCr = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header */}
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
              onClick={fetchAccountsData}
              disabled={loading}
              title="Refresh ledger"
              className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={handleExportTally}
              disabled={exportingTally}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {exportingTally ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{exportingTally ? 'Exporting...' : 'Export Tally XML for CA'}</span>
            </button>
            <button
              onClick={handlePeriodLock}
              disabled={lockingPeriod || periodLocked}
              className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                periodLocked ? 'bg-slate-700' : 'bg-[#0d9488] hover:bg-[#0f766e]'
              }`}
            >
              {lockingPeriod ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              <span>{periodLocked ? 'Books Locked ✓' : 'Month-end Period Lock'}</span>
            </button>
          </div>
        </div>

        {/* 5 Top KPI Cards */}
        {loading && !overview ? (
          <SkeletonCard count={5} className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Bank balance */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Bank balance
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatLakhsCr(overview?.kpis?.bankBalance || 0)}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              Live reconciled balance
            </div>
          </div>

          {/* 2. Receivables */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Receivables
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatLakhsCr(overview?.kpis?.receivables || 0)}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              DSO <strong className="text-slate-800">{overview?.kpis?.dsoDays || 0} days</strong>
            </div>
          </div>

          {/* 3. Payable to companies */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Payable to companies
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatLakhsCr(overview?.kpis?.payables || 0)}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-rose-600 font-semibold">
              {formatLakhsCr(overview?.kpis?.dueThisWeek || 0)} due this week
            </div>
          </div>

          {/* 4. GST payable */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              GST payable
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatLakhsCr(overview?.kpis?.gstPayable || 0)}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
              ITC matched {overview?.kpis?.itcMatchedPercentage || 0}%
            </div>
          </div>

          {/* 5. Net profit MTD */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Net profit MTD
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              {formatLakhsCr(overview?.kpis?.netProfitMtd || 0)}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
              {overview?.kpis?.netProfitPercent || 0}% of sales
            </div>
          </div>
        </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: P&L September (Takes 5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                P&amp;L — {pnl?.month || 'September'}
              </h3>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Live Dynamic
              </span>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Sales (net of returns)</span>
                <span className="font-bold text-slate-900">{formatLakhsCr(pnl?.sales || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Cost of goods sold (COGS)</span>
                <span className="font-semibold text-slate-800">{formatLakhsCr(pnl?.cogs || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Scheme income (claims)</span>
                <span className="font-semibold text-teal-700">{formatLakhsCr(pnl?.schemeIncome || 0)}</span>
              </div>

              <div className="py-2 border-y border-slate-200 flex justify-between font-bold text-slate-900 bg-slate-50/70 px-2 rounded-md">
                <span>Gross margin</span>
                <span>
                  {formatLakhsCr(pnl?.grossMargin || 0)} ·{' '}
                  <strong className="text-emerald-700">{pnl?.grossMarginPercent || '0.0'}%</strong>
                </span>
              </div>

              <div className="pt-1 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Salaries &amp; incentives</span>
                  <span className="font-medium text-slate-800">{formatLakhsCr(pnl?.expenses?.salaries || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle &amp; fuel</span>
                  <span className="font-medium text-slate-800">{formatLakhsCr(pnl?.expenses?.vehicleFuel || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rent, power, other</span>
                  <span className="font-medium text-slate-800">{formatLakhsCr(pnl?.expenses?.rentPower || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest &amp; bank charges</span>
                  <span className="font-medium text-slate-800">{formatLakhsCr(pnl?.expenses?.interestCharges || 0)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-emerald-700 text-sm bg-emerald-50/70 p-2 rounded-lg">
                <span>Net profit</span>
                <span>
                  {formatLakhsCr(pnl?.netProfit || 0)} · {pnl?.netProfitPercent || '0.0'}%
                </span>
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
                  <span>Statement lines (live)</span>
                  <span className="font-bold text-slate-900">{bankRecon?.statementLines || 0}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Auto-matched</span>
                  <span className="font-bold text-emerald-700">
                    {bankRecon?.autoMatched || 0} ({bankRecon?.autoMatchedPercent || '0.0'}%)
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Needs review</span>
                  <span className="font-bold text-amber-700">{bankRecon?.needsReview || 0}</span>
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
                  <span className="text-slate-700">GSTR-1 (Sales)</span>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                    pnl?.monthSales > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}>
                    {pnl?.monthSales > 0 ? 'Ready to file' : 'No sales'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">GSTR-3B (Current)</span>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                    overview?.kpis?.gstPayable > 0
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}>
                    {overview?.kpis?.gstPayable > 0 ? 'Due 20th' : 'Nil'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">GSTR-2B vs purchase ITC</span>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                    overview?.kpis?.itcMatchedPercentage > 0
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}>
                    {overview?.kpis?.itcMatchedPercentage > 0 ? `${overview.kpis.itcMatchedPercentage}% matched` : '0 purchases'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">TDS / TCS</span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                    {pnl?.monthSales > 0 ? 'Auto-computed' : 'No records'}
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
                {overview?.payablesList && overview.payablesList.length > 0 ? (
                  overview.payablesList.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="truncate max-w-[110px]">
                        <span className="font-semibold text-slate-800 block truncate">{item.companyName}</span>
                        <span className="text-[10px] text-slate-400 block">{item.companyCode}</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatLakhsCr(item.amount)}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    No pending supplier purchase payables.
                  </div>
                )}
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
