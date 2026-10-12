'use client';

import React from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  Percent,
  CheckCircle2
} from 'lucide-react';

export default function ReportsPage() {
  const { showNotification } = useNotification();
  const kpis = [
    { kpi: 'Secondary sales vs target', definition: 'Billed value ÷ company target, by brand', owner: 'Owner, ASM', target: '100% monthly', current: '68% (Day 9/26)', status: 'On Track' },
    { kpi: 'UBO / ECO', definition: 'Unique outlets billed in month ÷ active outlets', owner: 'ASM', target: '≥ 80%', current: '75.8% (2,412/3,180)', status: 'On Track' },
    { kpi: 'Productive calls %', definition: 'Visits with an order ÷ planned visits', owner: 'Salesman', target: '≥ 70%', current: '73.4%', status: 'Compliant' },
    { kpi: 'Lines per call (LPC)', definition: 'Order lines ÷ productive calls', owner: 'Salesman', target: '≥ 6', current: '6.4 (▲ 0.5 vs lm)', status: 'Exceeded' },
    { kpi: 'Must-sell coverage', definition: 'Outlets billed each must-sell SKU ÷ outlets billed', owner: 'ASM', target: '≥ 60%', current: '62.5%', status: 'Compliant' },
    { kpi: 'Fill rate', definition: 'Ordered lines supplied in full', owner: 'Godown', target: '≥ 97%', current: '98.2%', status: 'Compliant' },
    { kpi: 'Days of stock', definition: 'Stock value ÷ avg daily sales at cost', owner: 'Owner', target: '10–15 d', current: '12.4 d', status: 'Optimal' },
    { kpi: 'DSO', definition: 'Receivables ÷ avg daily credit sales', owner: 'Accounts', target: '≤ 12 d', current: '11 d', status: 'Compliant' },
    { kpi: 'Claim recovery', definition: 'Claims settled ÷ claimable value', owner: 'Claims', target: '≥ 95%', current: '84.0% (₹94.4L/₹1.12Cr)', status: 'Action Required' },
    { kpi: 'Van variance', definition: 'Stock + cash differences ÷ van sales', owner: 'Cashier', target: '< 0.1%', current: '0.08%', status: 'Compliant' },
    { kpi: 'Cost to serve', definition: 'Salaries + fleet + godown ÷ sales', owner: 'Owner', target: '< 5%', current: '4.2%', status: 'Compliant' },
    { kpi: 'Net margin by company', definition: 'Margin + scheme income − allocated costs', owner: 'Owner', target: 'Per company', current: '3.4% net (P&L Sep)', status: 'Profitable' },
  ];

  const standardReports = [
    'Daily sales register & DSR summary',
    'Beat-wise / outlet-wise sales, zero-billed outlets',
    'Brand & SKU performance vs last year',
    'Stock ledger, ageing, near-expiry',
    'Outstanding & collection ageing',
    'Scheme utilisation & claim register',
    'Salesman incentive statement',
    'Trial balance, P&L, balance sheet, GST returns',
  ];

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">12 · Sales KPIs &amp; MIS Reports</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              The Numbers FMCG Companies — and Owners — Judge You By
            </h1>
            <p className="text-xs text-slate-500">
              Standardized FMCG distributor scorecard, company DMS compliance, and auto-generated MIS registers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification({
                title: 'MIS Export Ready',
                message: 'Daily Sales Register (DSR), Beat-wise zero-billed analysis, and SKU brand performance downloaded as formatted Excel.',
                type: 'success'
              })}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export MIS Pack (Excel)</span>
            </button>
          </div>
        </div>

        {/* KPIs Table matching Page 14 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Executive FMCG Performance Metrics
            </h3>
            <span className="text-xs text-slate-500">Updated Real-Time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">KPI</th>
                  <th className="py-2.5 px-3">Definition</th>
                  <th className="py-2.5 px-2">Owner</th>
                  <th className="py-2.5 px-3">Industry Target</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Current MTD</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kpis.map((k, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{k.kpi}</td>
                    <td className="py-3 px-3 text-slate-600">{k.definition}</td>
                    <td className="py-3 px-2 text-slate-700 font-medium">{k.owner}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{k.target}</td>
                    <td className="py-3 px-3 font-black text-slate-900">{k.current}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        k.status === 'Action Required'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standard Reports Grid */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-3">
            Standard Reports &amp; Audit Downloads
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {standardReports.map((r, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:border-teal-400 cursor-pointer">
                <span className="font-medium text-slate-700">{r}</span>
                <Download className="w-3.5 h-3.5 text-teal-700 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
