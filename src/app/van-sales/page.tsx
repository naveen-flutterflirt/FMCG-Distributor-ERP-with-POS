'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import {
  Truck,
  Printer,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Send,
  HelpCircle,
  FileSpreadsheet,
  Coins,
  ShieldAlert
} from 'lucide-react';
import { MOCK_VAN_TRIP } from '@/data/mockData';

export default function VanLoadoutSettlement() {
  const [trip, setTrip] = useState(MOCK_VAN_TRIP);
  const [isSettled, setIsSettled] = useState(false);
  const [denominationsOpen, setDenominationsOpen] = useState(false);
  const [cashCounted, setCashCounted] = useState(trip.cashCounted);

  // Recalculate cash to deposit
  const cashToDeposit = trip.cashSales + trip.oldDuesCollected - trip.expenses;
  const variance = cashCounted - cashToDeposit;

  const handleCloseSettlement = () => {
    setIsSettled(true);
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header matching Page 6 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">05 · Web — Van Load-Out & Settlement</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Morning load, evening settle — stock and cash to the rupee
            </h1>
            <p className="text-xs text-slate-500">
              Mobile warehouse reconciliation with automated physical count verification, damage sorting, and cash shortage detection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
            <button
              onClick={handleCloseSettlement}
              disabled={isSettled}
              className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs ${
                isSettled ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0f766e] hover:bg-[#115e59] cursor-pointer'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSettled ? 'Settlement Closed & Locked' : 'Close settlement'}</span>
            </button>
          </div>
        </div>

        {/* Van Profile Bar matching Page 6 banner */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">
                Van 2 · Imran
              </span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-600 font-medium">Route R6 Industrial Area</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-500">Fri 9 Oct</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <div>Loaded: <strong className="text-slate-800">08:10</strong></div>
            <div>Returned: <strong className="text-slate-800">19:25</strong></div>
            <div>
              Status:{' '}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isSettled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isSettled ? 'Settled & Verified' : 'Pending Sign-off'}
              </span>
            </div>
          </div>
        </div>

        {/* Stock Reconciliation Table matching Page 6 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Daily Stock Variance & Container Sheet
            </h3>
            <span className="text-[11px] text-slate-500">
              Formula: Expected Back = Loaded − Sold − Free + Good Return
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-2 text-right">Loaded</th>
                  <th className="py-2.5 px-2 text-right">Sold</th>
                  <th className="py-2.5 px-2 text-right">Free (scheme)</th>
                  <th className="py-2.5 px-2 text-right">Good return</th>
                  <th className="py-2.5 px-2 text-right">Damage in</th>
                  <th className="py-2.5 px-2 text-right font-bold text-slate-700">Expected back</th>
                  <th className="py-2.5 px-2 text-right font-bold text-slate-900">Counted back</th>
                  <th className="py-2.5 px-3 text-center">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trip.items.map((row, idx) => (
                  <tr key={idx} className={row.variance !== 0 ? 'bg-rose-50/40' : 'hover:bg-slate-50/50'}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.sku}</td>
                    <td className="py-2.5 px-2 text-right text-slate-700">{row.loaded}</td>
                    <td className="py-2.5 px-2 text-right text-slate-700">{row.sold}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{row.free || '0'}</td>
                    <td className="py-2.5 px-2 text-right text-emerald-600 font-medium">{row.goodReturn || '0'}</td>
                    <td className="py-2.5 px-2 text-right text-amber-700 font-medium">{row.damageIn || '0'}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-700">{row.expectedBack}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-slate-900">{row.countedBack}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-sm font-bold text-[11px] ${
                          row.variance === 0
                            ? 'text-emerald-700'
                            : 'bg-rose-100 text-rose-700 px-2'
                        }`}
                      >
                        {row.variance}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Empty crates line matching Page 6 */}
                <tr className="bg-amber-50/30 font-medium">
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">
                    Empty crates (returnable)
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-slate-700">10 out</td>
                  <td colSpan={4} className="py-2.5 px-2 text-slate-600 text-left pl-4">
                    8 crates issued to outlets · 6 collected back
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold text-slate-700">8</td>
                  <td className="py-2.5 px-2 text-right font-bold text-slate-900">8</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm text-[10px] font-bold">
                      2 with outlets
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 3 Panels matching Page 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. Cash settlement matching Page 6 exact numbers */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Cash settlement
                </h3>
                <span className="text-[10px] font-semibold text-slate-500">Denomination verified</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Cash sales</span>
                  <span className="font-semibold text-slate-900">₹{trip.cashSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Old dues collected — cash</span>
                  <span className="font-semibold text-slate-900">₹{trip.oldDuesCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>UPI received (auto-matched)</span>
                  <span className="font-semibold text-teal-700">₹{trip.upiReceived.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Cheques (3)</span>
                  <span className="font-semibold text-slate-900">₹{trip.chequesTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Expenses (fuel, toll — with receipts)</span>
                  <span className="font-semibold text-rose-600">−₹{trip.expenses.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Cash to deposit</span>
                  <span className="text-sm">₹{cashToDeposit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-700 pt-1">
                  <span>Cash counted (denominations)</span>
                  <span className="font-bold text-slate-900">₹{cashCounted.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-rose-600 bg-rose-50/70 p-2 rounded-lg">
                  <span>Short</span>
                  <span className="text-sm">−₹{Math.abs(variance).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-slate-500">
              Shortage will be debited to Imran Khan&apos;s ledger unless approved by owner.
            </div>
          </div>

          {/* 2. Van sales features matching Page 6 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-3 pb-2 border-b border-slate-100">
              Van sales features
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Load request from salesman, approved by godown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Van treated as a mobile warehouse with its own stock</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Bluetooth printer invoices with QR for UPI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Credit sales allowed only for approved outlets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Returns and damage taken back on the van, verified at unload</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Returnable containers (crates, jars) tracked per outlet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Next-day load suggested from today&apos;s sales and beat</span>
              </li>
            </ul>
          </div>

          {/* 3. Settlement controls matching Page 6 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-3 pb-2 border-b border-slate-100">
              Settlement controls
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>Van cannot be loaded again until the last trip is settled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>Stock variance valued and posted to the salesman&apos;s account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>Cash short / excess needs cashier and owner sign-off</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>Cheques logged with bank, date; bounce reverses receipt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                <span>Day-end summary sent to the owner on WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
