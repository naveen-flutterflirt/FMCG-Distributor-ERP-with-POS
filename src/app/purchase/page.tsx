'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  ShoppingCart,
  FileCheck2,
  Plus,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function PurchasePage() {
  const { showNotification } = useNotification();
  const purchaseOrders = [
    { id: 'PO-2026-401', company: 'Company A · Personal Care', date: '06 Oct 2026', totalAmount: 1840000, status: 'In Transit', grnStatus: 'Pending GRN Scan', itemsCount: 42, dispatchRef: 'DIS-A-9921' },
    { id: 'PO-2026-402', company: 'Company B · Foods', date: '04 Oct 2026', totalAmount: 1290000, status: 'Received & Verified', grnStatus: 'GRN-8812 Created', itemsCount: 65, dispatchRef: 'DIS-B-4412' },
    { id: 'PO-2026-403', company: 'Company C · Beverages', date: '01 Oct 2026', totalAmount: 670000, status: 'Completed', grnStatus: 'GRN-8790 Created', itemsCount: 18, dispatchRef: 'DIS-C-1092' },
    { id: 'PO-2026-404', company: 'Company D · Home Care', date: '28 Sep 2026', totalAmount: 920000, status: 'Completed', grnStatus: 'Debit Note Raised', itemsCount: 29, dispatchRef: 'DIS-D-0199' },
  ];

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 13 · Primary Purchase &amp; GRN</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Purchase from FMCG Companies
            </h1>
            <p className="text-xs text-slate-500">
              Direct primary PO placement, company e-invoice JSON auto-import, GRN shortage detection &amp; debit note generation.
            </p>
          </div>

          <button
            onClick={() => showNotification({
              title: 'Suggested PO Generated',
              message: 'Suggested purchase order computed based on 10-day stock cover run rate, safety buffers, and Company scheme slabs.',
              type: 'success'
            })}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Suggested PO</span>
          </button>
        </div>

        {/* POs list */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Primary Inward Registers &amp; In-Transit Goods
            </h3>
            <span className="text-[11px] text-teal-700 font-semibold">
              Live Company DMS Link
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">Company (Principal)</th>
                  <th className="py-2.5 px-3">PO Date</th>
                  <th className="py-2.5 px-2 text-center">SKU Lines</th>
                  <th className="py-2.5 px-3 text-right">PO Value</th>
                  <th className="py-2.5 px-3">Dispatch Ref</th>
                  <th className="py-2.5 px-3 text-center">GRN Status</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{po.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{po.company}</td>
                    <td className="py-3 px-3 text-slate-600">{po.date}</td>
                    <td className="py-3 px-2 text-center font-medium text-slate-700">{po.itemsCount}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">₹{po.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{po.dispatchRef}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[11px] font-semibold text-slate-700">{po.grnStatus}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        po.status === 'In Transit'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {po.status}
                      </span>
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
