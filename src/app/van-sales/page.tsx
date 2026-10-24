'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { Skeleton, SkeletonCard, SkeletonTable } from '@/components/common/Skeleton';
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
  ShieldAlert,
  Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VanLoadoutSettlement() {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSettled, setIsSettled] = useState(false);
  const [denominationsOpen, setDenominationsOpen] = useState(false);
  const [cashCounted, setCashCounted] = useState(0);
  const [settling, setSettling] = useState(false);
  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      if (!authToken) {
        return;
      }
      const res = await fetch(`${API_BASE}/van-sales/trip`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch van trip');
      const data = await res.json();
      if (data.success && data.data) {
        setTrip(data.data);
        setCashCounted(data.data.cashCounted || 0);
      }
    } catch (err: any) {
      console.error(err);
      showNotification({
        title: 'Error Loading Van Trip',
        message: err.message || 'Could not fetch mobile warehouse reconciliation.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchTrip();
    }
  }, [token, authLoading]);

  // Recalculate cash to deposit
  const cashSales = trip?.cashSales || 0;
  const oldDues = trip?.oldDuesCollected || 0;
  const expenses = trip?.expenses || 0;
  const cashToDeposit = cashSales + oldDues - expenses;
  const variance = cashCounted - cashToDeposit;

  const handleCloseSettlement = async () => {
    try {
      setSettling(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/van-sales/trip/${trip?.id || 'van-trip-02'}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ cashCounted, notes: 'Van trip settlement closed' })
      });

      const data = await res.json();
      if (data.success) {
        setIsSettled(true);
        showNotification({
          title: 'Settlement Closed & Locked',
          message: 'Van stock & cash counted, posted to main godown, and variance audit locked.',
          type: 'success'
        });
      }
    } catch (err: any) {
      showNotification({
        title: 'Settlement Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSettling(false);
    }
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header matching Page 6 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">05 · Web — Van Load-Out &amp; Settlement</span>
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
              onClick={fetchTrip}
              title="Refresh Van Load"
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
            <button
              onClick={handleCloseSettlement}
              disabled={isSettled || settling}
              className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs ${
                isSettled ? 'bg-slate-500 cursor-not-allowed' : 'bg-[#0f766e] hover:bg-[#115e59] cursor-pointer'
              }`}
            >
              {settling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{isSettled ? 'Settlement Closed & Locked ✓' : 'Close settlement'}</span>
            </button>
          </div>
        </div>

        {/* Van Profile Bar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">
                {trip?.vanNumber || 'Van 2 · Imran'}
              </span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-600 font-medium">{trip?.route || 'Route R6 Industrial Area'}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-slate-500">{trip?.date || 'Today'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <div>Loaded: <strong className="text-slate-800">{trip?.loadedAt || '08:10'}</strong></div>
            <div>Returned: <strong className="text-slate-800">{trip?.returnedAt || '19:25'}</strong></div>
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

        {/* Physical Stock Reconciliation Table */}
        {loading && !trip ? (
          <SkeletonTable rows={5} cols={8} />
        ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
            <h3 className="font-bold text-slate-800">
              Mobile Godown Stock Reconciliation
            </h3>
            <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Live Stock Batches
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">SKU Name</th>
                  <th className="py-2.5 px-3 text-center">Morning Load</th>
                  <th className="py-2.5 px-3 text-center">Billed Sold</th>
                  <th className="py-2.5 px-3 text-center">Good Return</th>
                  <th className="py-2.5 px-3 text-center">Damage In</th>
                  <th className="py-2.5 px-3 text-center">Expected Back</th>
                  <th className="py-2.5 px-3 text-center font-bold text-slate-900">Counted Back</th>
                  <th className="py-2.5 px-3 text-center">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trip?.items && trip.items.length > 0 ? (
                  trip.items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{item.sku}</td>
                      <td className="py-3 px-3 text-center text-slate-700">{item.loaded}</td>
                      <td className="py-3 px-3 text-center text-slate-700 font-medium">{item.sold}</td>
                      <td className="py-3 px-3 text-center text-slate-500">{item.goodReturn}</td>
                      <td className="py-3 px-3 text-center text-rose-600 font-medium">{item.damageIn}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{item.expectedBack}</td>
                      <td className="py-3 px-3 text-center font-black text-slate-900 bg-slate-50/50">{item.countedBack}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.variance === 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {item.variance === 0 ? '✓ Match' : `${item.variance}`}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No van stock items loaded for today. Load items via "Orders &amp; Billing" or Dispatch desk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Cash & Payment Settlement Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm border-b border-slate-100 pb-2">
              Route Collections Breakdown
            </h3>
            <div className="flex justify-between text-slate-700">
              <span>Cash Sales on Beat</span>
              <strong className="text-slate-900">₹{cashSales.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Old Outstandings Collected</span>
              <strong className="text-slate-900">₹{oldDues.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Less: Van Fuel &amp; Toll Expenses</span>
              <strong className="text-rose-600">-₹{expenses.toLocaleString('en-IN')}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm bg-slate-50 p-2 rounded-lg">
              <span>Net Cash to Deposit</span>
              <span className="text-teal-800">₹{cashToDeposit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm border-b border-slate-100 pb-2">
              Digital &amp; Cheque Receipts
            </h3>
            <div className="flex justify-between text-slate-700">
              <span>Retailer UPI Received</span>
              <strong className="text-teal-700 font-bold">₹{(trip?.upiReceived || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Cheques Handed In ({trip?.chequesCount || 0})</span>
              <strong className="text-slate-900 font-bold">₹{(trip?.chequesTotal || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div className="pt-4 text-[11px] text-slate-500 leading-snug bg-slate-50 p-2 rounded-md">
              UPI matched by retailer VPA reference; Cheques logged for next morning bank clearing deposit.
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2.5 text-xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm border-b border-slate-100 pb-2">
              Physical Cash Verification
            </h3>
            <div className="flex justify-between text-slate-700">
              <span>Expected Cash Deposit</span>
              <span>₹{cashToDeposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Cash Counted in Hand</span>
              <input
                type="number"
                value={cashCounted}
                disabled={isSettled}
                onChange={(e) => setCashCounted(Number(e.target.value))}
                className="w-24 px-2 py-1 text-xs font-bold text-right border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm p-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              <span>Cash Shortage / Variance</span>
              <span>{variance < 0 ? `-₹${Math.abs(variance).toLocaleString('en-IN')}` : `+₹${variance}`}</span>
            </div>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
