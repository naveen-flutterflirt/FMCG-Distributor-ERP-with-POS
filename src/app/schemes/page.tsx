'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ERPLayout from '@/components/layout/ERPLayout';
import { Tag, Plus, CheckCircle2, Search, Filter, ShieldAlert, ArrowRight } from 'lucide-react';

export default function SchemesCatalog() {
  const [searchTerm, setSearchTerm] = useState('');

  const schemes = [
    { id: 'SCH-01', name: 'QPS 2% Volume Discount', company: 'Company A · Personal Care', category: 'Tea 250 g', condition: 'Orders ≥ ₹5,000', benefit: '2% off invoice value', fundedBy: 'Company-funded', budgetUsed: '₹34,200 / ₹50,000', status: 'Active' },
    { id: 'SCH-02', name: 'Biscuits 12 + 1 Case Deal', company: 'Company B · Foods', category: 'Biscuit ₹10 pack', condition: 'Buy 12 cases', benefit: '1 case free (60 units)', fundedBy: 'Company-funded', budgetUsed: '₹68,400 / ₹1,00,000', status: 'Active' },
    { id: 'SCH-03', name: 'Cooler Display Asset Subsidy', company: 'Company C · Beverages', category: 'Cold Beverages', condition: 'Planogram verified', benefit: '₹500 / outlet monthly', fundedBy: 'Company-funded', budgetUsed: '₹22,500 / ₹30,000', status: 'Active' },
    { id: 'SCH-04', name: 'CleanMax Combo Bar Pack', company: 'Company D · Home Care', category: 'Detergent & Bars', condition: '1 Carton combo', benefit: 'Free 75 g dish bar per 4-pack', fundedBy: 'Distributor-funded', budgetUsed: '₹12,400 / ₹20,000', status: 'Active' },
    { id: 'SCH-05', name: 'First Order Welcome Bonus', company: 'Company A · Personal Care', category: 'All Brands', condition: 'New outlet KYC complete', benefit: '₹250 flat bill discount', fundedBy: 'Company-funded', budgetUsed: '₹8,750 / ₹15,000', status: 'Active' },
    { id: 'SCH-06', name: 'Festive Stock-up Slab', company: 'Company B · Foods', category: 'Atta & Oils', condition: 'Orders ≥ ₹25,000', benefit: '3.5% back via credit note', fundedBy: 'Company-funded', budgetUsed: '₹89,000 / ₹1,20,000', status: 'Active' },
  ];

  const filtered = schemes.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">06 · Web — Scheme Engine & Master</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Active Trade Schemes & Eligibility Rules
            </h1>
            <p className="text-xs text-slate-500">
              Auto-applied on Salesman App, Retailer App, and Counter POS. Budget locks stop schemes automatically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/claims"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Company Claims Register</span>
            </Link>
          </div>
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scheme name or company..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Total Active: <strong className="text-slate-900">41 schemes</strong></span>
            <span>Company-Funded: <strong className="text-teal-700">36</strong></span>
            <span>Distributor-Funded: <strong className="text-slate-900">5</strong></span>
          </div>
        </div>

        {/* Grid of Schemes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{s.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.fundedBy === 'Company-funded' ? 'bg-teal-50 text-teal-700 border border-teal-200/50' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {s.fundedBy}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{s.company}</p>

                <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Condition:</span>
                    <span className="font-semibold text-slate-800">{s.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payout / Perk:</span>
                    <span className="font-bold text-emerald-700">{s.benefit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget Spent:</span>
                    <span className="font-medium text-slate-700">{s.budgetUsed}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Enforced at POS
                </span>
                <Link href="/claims" className="text-teal-700 font-semibold hover:underline flex items-center gap-1">
                  Claim lines <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ERPLayout>
  );
}
