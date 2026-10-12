'use client';

import React from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import {
  Users,
  Award,
  MapPin,
  TrendingUp,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { MOCK_SALESMEN } from '@/data/mockData';

export default function FieldTeamPage() {
  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 14 · Field Team HR &amp; Incentives</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Salesman Beats, Compliance &amp; Daily Incentives
            </h1>
            <p className="text-xs text-slate-500">
              Incentives calculated daily across targets, UBO, Lines Per Call (LPC), and Must-Sell SKUs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold">
              14 / 15 Salesmen Active on Beat Today
            </span>
          </div>
        </div>

        {/* Salesmen Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_SALESMEN.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 text-sm">{s.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                    {s.beat}
                  </span>
                </div>

                <div className="space-y-2 text-xs py-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Calls Productive:</span>
                    <span className="font-bold text-slate-800">{s.productive} / {s.planned} ({Math.round((s.productive/s.planned)*100)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lines per call (LPC):</span>
                    <span className="font-bold text-teal-700">{s.lpc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Today&apos;s Booked Sales:</span>
                    <span className="font-black text-slate-900">₹{s.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Must-Sell Coverage:</span>
                    <span className="font-bold text-amber-700">{s.mustSellCompleted} / {s.mustSellTotal} items</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> ₹{Math.round(s.sales * 0.048).toLocaleString()} Earned
                </span>
                <span className="text-slate-400">Payroll Linked</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ERPLayout>
  );
}
