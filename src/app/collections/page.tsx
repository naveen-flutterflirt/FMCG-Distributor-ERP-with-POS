'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import RecordReceiptModal from '@/components/common/RecordReceiptModal';
import { SkeletonCard, SkeletonTable } from '@/components/common/Skeleton';
import {
  IndianRupee,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Building2,
  FileText,
  RefreshCw,
  Loader2,
  History
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CollectionsPage() {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('All');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [selectedOutletForReceipt, setSelectedOutletForReceipt] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  const fetchCollectionsData = async () => {
    if (authLoading) return;
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (routeFilter !== 'All') params.append('route', routeFilter);
      if (overdueOnly) params.append('overdueOnly', 'true');

      const [ledgerRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/collections/ledger?${params.toString()}`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        }),
        fetch(`${API_BASE}/collections/stats`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        })
      ]);

      const ledgerData = await ledgerRes.json();
      const statsData = await statsRes.json();

      if (ledgerData.success) {
        setOutlets(ledgerData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err: any) {
      showNotification({
        title: 'Error loading collections',
        message: err.message || 'Failed to sync with backend',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionsData();
  }, [token, authLoading, searchTerm, routeFilter, overdueOnly]);

  const handleOpenReceiptModal = (outlet: any) => {
    setSelectedOutletForReceipt(outlet);
    setIsReceiptModalOpen(true);
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 07 · Credit &amp; Collections</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Retailer Ledger &amp; Ageing Receivables
            </h1>
            <p className="text-xs text-slate-500">
              Credit control under 21 days, automated bill-level receipts, and live Neon PostgreSQL ledger adjustments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchCollectionsData}
              title="Refresh Collections"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

          </div>
        </div>

        {/* 3 Metrics Cards */}
        {loading && !stats ? (
          <SkeletonCard count={3} className="grid-cols-1 md:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Outstanding
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{stats ? (stats.totalOutstanding / 100000).toFixed(2) : '0.00'}L
              </div>
              <span className="text-[11px] text-slate-500">
                Across {stats?.billedRetailers || outlets.length} active retail ledgers
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                DSO (Days Sales Outstanding)
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {stats?.dsoDays || 0} days
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Target ≤ 12 days (Compliant)</span>
            </div>

            <div
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`bg-white border rounded-xl p-4 shadow-2xs cursor-pointer transition-all ${overdueOnly ? 'border-rose-500 ring-2 ring-rose-200' : 'border-rose-200/80 hover:border-rose-300'
                }`}
            >
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                Overdue &gt; 21 Days
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                ₹{stats ? (stats.overdue21Days / 100000).toFixed(2) : '0.00'}L
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">
                {overdueOnly ? 'Filter active: showing overdue only' : 'Click to filter blocked retailers'}
              </span>
            </div>
          </div>
        )}

        {/* Search & Route Filters Bar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search outlet, owner, phone, route..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Beats / Routes</option>
              <option value="R4 Gandhi Nagar">R4 Gandhi Nagar</option>
              <option value="R2 Station Rd">R2 Station Rd</option>
              <option value="R1 Civil Lines">R1 Civil Lines</option>
              <option value="R3 Old Market">R3 Old Market</option>
              <option value="MT route">MT route (Modern Trade)</option>
              <option value="R6 Industrial Area">R6 Industrial Area</option>
            </select>

            <button
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${overdueOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
            >
              {overdueOnly ? '✓ Overdue Only' : 'Show Overdue Only'}
            </button>
          </div>
        </div>

        {/* Outstanding Table */}
        {loading && outlets.length === 0 ? (
          <SkeletonTable rows={6} cols={7} />
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                Retailer Credit Ledger &amp; Due Dates (Neon PostgreSQL)
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {outlets.length} Outlets Live
              </span>
            </div>

            <div className="overflow-x-auto">
              {outlets.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No retailer credit ledgers found. Onboard retail outlets in &quot;Outlets &amp; Beats&quot; to begin tracking collections.
                </div>
              ) : (
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
                  {outlets.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{o.name}</div>
                        <div className="text-[10px] text-slate-400">{o.ownerName} • {o.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{o.route}</td>
                      <td className="py-3 px-3 text-right text-slate-700">₹{Number(o.creditLimit).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">₹{Number(o.currentBalance).toLocaleString()}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-semibold ${o.overdueDays > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          {o.overdueDays > 0 ? `${o.overdueDays} days` : '0 days'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${o.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                          {o.status === 'active' ? 'Clear' : 'Credit Hold'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleOpenReceiptModal(o)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-[11px] shadow-2xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1 mx-auto"
                        >
                          <IndianRupee className="w-3 h-3" />
                          <span>Record Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Dynamic Record Receipt Modal */}
      <RecordReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        onSuccess={fetchCollectionsData}
        outlet={selectedOutletForReceipt}
      />
    </ERPLayout>
  );
}
