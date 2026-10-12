'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  Warehouse,
  AlertTriangle,
  Clock,
  Layers,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Truck
} from 'lucide-react';
import { MOCK_SKUS } from '@/data/mockData';

export default function GodownStockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  const filtered = MOCK_SKUS.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">03 &amp; 16 · Godown &amp; Warehouse Inventory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Stock Ledger, Batches &amp; Expiry Monitor
            </h1>
            <p className="text-xs text-slate-500">
              FIFO batch allocations, godown vs mobile van locations, and stock cover alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification({
                title: 'Barcode Scanner Activated',
                message: 'Ready for Goods Receipt Note (GRN) inward scanning. Shortage or damage will auto-trigger manufacturer debit notes.',
                type: 'info'
              })}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Inward GRN by Scan</span>
            </button>
          </div>
        </div>

        {/* 3 Top Stock Alerts matching Page 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-rose-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                SKUs below 5 days cover
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">23 SKUs</div>
              <span className="text-[11px] text-slate-500">Requires PO to manufacturer</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                Near expiry (60 d)
              </span>
              <div className="text-2xl font-black text-amber-700 mt-1">₹2.9L</div>
              <span className="text-[11px] text-slate-500">Push via retail schemes / clearance</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Damaged stock awaiting claim
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">₹1.4L</div>
              <span className="text-[11px] text-slate-500">Audit certificate queued</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Stock Inventory Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search SKU name, code, barcode..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-slate-600">
              Total SKUs: <strong className="text-slate-900">{filtered.length} items</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">SKU &amp; Code</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-2 text-right">MRP</th>
                  <th className="py-2.5 px-2 text-right">Distributor Rate</th>
                  <th className="py-2.5 px-3 text-right">Godown Cases</th>
                  <th className="py-2.5 px-2 text-right">Loose Pcs</th>
                  <th className="py-2.5 px-2 text-center">GST %</th>
                  <th className="py-2.5 px-3 text-center">Focus Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Code: {s.code} • Barcode: {s.barcode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{s.company}</td>
                    <td className="py-3 px-2 text-right text-slate-800 font-semibold">₹{s.mrp}</td>
                    <td className="py-3 px-2 text-right text-slate-900 font-bold">₹{s.rate.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">{s.stockCases} cs</td>
                    <td className="py-3 px-2 text-right text-slate-600">{s.stockPcs} pcs</td>
                    <td className="py-3 px-2 text-center text-slate-600 font-medium">{s.gstPercent}%</td>
                    <td className="py-3 px-3 text-center">
                      {s.mustSell ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          ★ Must-Sell SKU
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Regular</span>
                      )}
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
