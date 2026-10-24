'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ERPLayout from '@/components/layout/ERPLayout';
import NewOrderModal from '@/components/common/NewOrderModal';
import { useAuth } from '@/context/AuthContext';
import { SkeletonCard } from '@/components/common/Skeleton';
import { RefreshCw, TrendingUp, Users, AlertTriangle, CheckCircle2, Truck, Package, DollarSign } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OwnerDashboard() {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  // Dynamic Dashboard States
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      };

      const res = await fetch(`${API_BASE}/dashboard/summary?company=${encodeURIComponent(selectedCompany)}`, { headers });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.data) {
          setDashboardData(d.data);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, selectedCompany]);

  const formatLakhsCr = (amount: number) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const kpis = dashboardData?.kpis || {
    sales: 0,
    outletsBilled: 0,
    totalOutlets: 0,
    lpc: 0,
    grossMargin: 9.6,
    receivables: 0,
    overdueDues: 0,
    claimsPending: 0
  };

  const companyTargets = dashboardData?.companyTargets || [];
  const channelMix = dashboardData?.channelMix || [];
  const vanTrips = dashboardData?.vanTrips || [];
  const salesmen = dashboardData?.salesmen || [];
  const stockAlerts = dashboardData?.stockAlerts || {
    lowCoverCount: 0,
    nearExpiryCount: 0,
    nearExpiryValue: 290000,
    collectionsYesterday: 0
  };
  const companiesList = dashboardData?.companiesList || [];

  return (
    <ERPLayout>
      <div className="space-y-4 max-w-[1400px] mx-auto pb-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Executive Cockpit &amp; Operations
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live Operations Snapshot · Real-time Connected to PostgreSQL
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={fetchDashboardData}
              title="Refresh Live Metrics"
              className="p-1.5 bg-white border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>

            {/* Dynamic Company Filter dropdown */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              aria-label="Filter by Company"
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden shadow-2xs cursor-pointer shrink-0"
            >
              <option value="All">Company: All Brands ▾</option>
              {companiesList.map((c: any) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* + New order button */}
            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="bg-[#006d77] hover:bg-[#005a63] text-white px-3.5 py-1.5 rounded-md text-xs font-bold shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
            >
              + New order
            </button>
          </div>
        </div>

        {/* 6 Metric Cards: Real-Time Live Data */}
        {loading && !dashboardData ? (
          <SkeletonCard count={6} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" />
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Sales */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Secondary sales MTD
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {formatLakhsCr(kpis.sales)}
            </div>
            <div className="text-[11px] text-[#008080] font-medium mt-1">
              {kpis.sales > 0 ? 'Live billed orders' : 'Ready for billing'}
            </div>
          </div>

          {/* Card 2: Outlets Billed */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Outlets billed (UBO)
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {kpis.outletsBilled.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              of {kpis.totalOutlets.toLocaleString('en-IN')} active stores
            </div>
          </div>

          {/* Card 3: LPC */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Lines per call (LPC)
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {kpis.lpc}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Target: ≥ 6.0 lines
            </div>
          </div>

          {/* Card 4: Gross Margin */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Gross margin
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {kpis.grossMargin}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              incl. claimable schemes
            </div>
          </div>

          {/* Card 5: Retailer Receivables */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Retailer outstanding
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {formatLakhsCr(kpis.receivables)}
            </div>
            <div className="text-[11px] text-red-500 font-medium mt-1">
              {formatLakhsCr(kpis.overdueDues)} over 21 days
            </div>
          </div>

          {/* Card 6: Claims Pending */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Claims pending
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {formatLakhsCr(kpis.claimsPending)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Submitted for settlement
            </div>
          </div>
        </div>
        )}

        {/* Middle Row: 3 Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Target vs achievement by company */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Target vs Achievement by Company
                </h3>
                <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                  Live DMS Quotas
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {companyTargets.length > 0 && kpis.sales > 0 ? (
                  companyTargets.map((ct: any) => (
                    <div key={ct.id || ct.name}>
                      <div className="flex justify-between font-medium text-slate-800 mb-1">
                        <span className="truncate pr-2">{ct.name}</span>
                        <span className="font-bold shrink-0">{ct.percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${ct.percent >= 70 ? 'bg-[#004d40]' : ct.percent >= 50 ? 'bg-[#00897b]' : 'bg-[#c65126]'}`}
                          style={{ width: `${Math.min(100, ct.percent)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No active brand sales booked yet. Targets will appear once orders are placed.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Live distributor DMS tracking vs monthly company quotas
            </div>
          </div>

          {/* Channel mix — MTD */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Channel Mix — MTD
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  Store Format
                </span>
              </div>

              {channelMix.length > 0 ? (
                <>
                  <div className="h-3.5 w-full bg-slate-100 rounded-md overflow-hidden flex mb-4">
                    {channelMix.map((ch: any, idx: number) => {
                      const colors = ['bg-[#004d40]', 'bg-[#00897b]', 'bg-[#80cbc4]', 'bg-[#d87d36]'];
                      return (
                        <div
                          key={idx}
                          style={{ width: `${ch.percent}%` }}
                          className={colors[idx % colors.length]}
                          title={`${ch.channel} ${ch.percent}%`}
                        />
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-xs">
                    {channelMix.map((ch: any, idx: number) => {
                      const colors = ['bg-[#004d40]', 'bg-[#00897b]', 'bg-[#80cbc4]', 'bg-[#d87d36]'];
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <span className={`w-2.5 h-2.5 rounded-xs ${colors[idx % colors.length]}`} />
                            {ch.channel}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {ch.percent}% ({ch.count} stores)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No registered outlets found yet. Add outlets in "Outlets &amp; Beats".
                </div>
              )}
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Active retailer trade channel distribution
            </div>
          </div>

          {/* Live Van Delivery Settlement */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Live Van Delivery Settlement
                </h3>
                <Link href="/delivery-fleet" className="text-xs font-semibold text-teal-700 hover:underline">
                  Fleet Ops →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                      <th className="pb-1.5 font-normal">Van &amp; Route</th>
                      <th className="pb-1.5 font-normal text-right">Value</th>
                      <th className="pb-1.5 font-normal text-right">Collected</th>
                      <th className="pb-1.5 font-normal text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vanTrips.length > 0 ? (
                      vanTrips.map((trip: any) => (
                        <tr key={trip.id}>
                          <td className="py-2 text-slate-800">
                            <div className="font-medium text-slate-900 truncate max-w-[110px]">{trip.driver}</div>
                            <div className="text-[10px] text-slate-400">{trip.route}</div>
                          </td>
                          <td className="py-2 text-right font-medium text-slate-900">
                            {formatLakhsCr(parseFloat(trip.total_value))}
                          </td>
                          <td className="py-2 text-right text-slate-700">
                            {formatLakhsCr(parseFloat(trip.cash_collected))}
                          </td>
                          <td className="py-2 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${trip.status === 'Settled & Completed' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#ffedd5] text-[#c2410c]'}`}>
                              {trip.status === 'Settled & Completed' ? 'Settled' : 'In Transit'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-slate-400">
                          No active van trips currently.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Mobile godown returns &amp; cashier handovers
            </div>
          </div>
        </div>

        {/* Bottom Row: Scorecard & Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Salesman scorecard — today (Takes 2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Salesman Scorecard — Live Field Activity
              </h3>
              <Link href="/field-team" className="text-xs font-semibold text-[#006d77] hover:underline">
                View All Field Reps →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                    <th className="pb-2 font-normal">Salesman</th>
                    <th className="pb-2 font-normal">Beat</th>
                    <th className="pb-2 font-normal text-center">Visited</th>
                    <th className="pb-2 font-normal text-center">Productive</th>
                    <th className="pb-2 font-normal text-center">LPC</th>
                    <th className="pb-2 font-normal text-right">Sales</th>
                    <th className="pb-2 font-normal text-center">Must-sell</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesmen.length > 0 ? (
                    salesmen.map((s: any, idx: number) => (
                      <tr key={s.id || idx}>
                        <td className="py-2 text-slate-800 font-medium">{s.name}</td>
                        <td className="py-2 text-slate-600">{s.beat}</td>
                        <td className="py-2 text-center font-bold text-slate-800">
                          {s.visited}/{s.planned}
                        </td>
                        <td className="py-2 text-center text-slate-800 font-medium">{s.productive}</td>
                        <td className="py-2 text-center font-bold text-slate-800">{s.lpc}</td>
                        <td className="py-2 text-right font-medium text-slate-900">
                          ₹{Number(s.sales || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 text-center">
                          <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                            {s.mustSellCompleted}/{s.mustSellTotal}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                        No field salesmen configured yet. Create salesmen in "Field Team".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Stock alerts + Collected yesterday card */}
          <div className="space-y-3">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  Warehouse Stock Alerts
                </h3>
                <Link href="/godown" className="text-xs font-semibold text-teal-700 hover:underline">
                  Godown →
                </Link>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">SKUs below 5 cases cover</span>
                  <span className="font-bold text-red-600">{stockAlerts.lowCoverCount} SKUs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Near expiry (&lt; 90 days)</span>
                  <span className="font-bold text-slate-900">{stockAlerts.nearExpiryCount} Batch</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Damaged stock awaiting claim</span>
                  <span className="font-bold text-slate-900">{formatLakhsCr(stockAlerts.nearExpiryValue)}</span>
                </div>
              </div>
            </div>

            {/* Collected yesterday banner */}
            <div className="bg-[#0c1926] rounded-xl text-white p-4 shadow-md flex items-center justify-between">
              <div className="text-3xl font-extrabold tracking-tight">
                {formatLakhsCr(stockAlerts.collectionsYesterday)}
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-200">
                  Total Collections
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Dynamic UPI · Cash &amp; Cheque
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />
    </ERPLayout>
  );
}
