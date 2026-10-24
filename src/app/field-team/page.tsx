'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import AddSalesmanModal from '@/components/common/AddSalesmanModal';
import LogVisitModal from '@/components/common/LogVisitModal';
import { SkeletonCard } from '@/components/common/Skeleton';
import {
  Users,
  Award,
  MapPin,
  TrendingUp,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  Check
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FieldTeamPage() {
  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalSalesmen: 0,
    activeSalesmen: 0,
    totalBookedSales: 0,
    totalEarnedIncentive: 0,
    avgProductivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeat, setSelectedBeat] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSalesmanForVisit, setActiveSalesmanForVisit] = useState<any | null>(null);
  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  const fetchFieldTeam = async () => {
    if (authLoading) return;
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      if (!authToken) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/field-team/salesmen`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch field team');
      }
      const data = await res.json();
      if (data.success && data.data) {
        setSalesmen(data.data.salesmen || []);
        setStats(data.data.stats || {});
      }
    } catch (err: any) {
      console.error(err);
      showNotification({
        title: 'Error Loading Field Team',
        message: err.message || 'Could not load salesmen performance.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldTeam();
  }, [token, authLoading]);

  // Filtered salesmen
  const filteredSalesmen = salesmen.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.beat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBeat = selectedBeat === 'All' || s.beat.toLowerCase().includes(selectedBeat.toLowerCase());
    return matchesSearch && matchesBeat;
  });

  const uniqueBeats = ['All', ...Array.from(new Set(salesmen.map(s => s.beat)))];

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 14 · Field Team HR &amp; Incentives</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Salesman Beats, Compliance &amp; Daily Incentives
            </h1>
            <p className="text-xs text-slate-500">
              Incentives calculated live across orders booked, UBO, Lines Per Call (LPC), and Must-Sell SKUs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFieldTeam}
              title="Refresh Salesmen Data"
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Salesman</span>
            </button>
            <span className="px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold">
              {stats.activeSalesmen || 0} / {stats.totalSalesmen || 0} Active on Beat
            </span>
          </div>
        </div>

        {/* Top KPI Cards */}
        {loading && stats.totalSalesmen === 0 ? (
          <SkeletonCard count={4} className="grid-cols-2 md:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Today's Field Orders
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                ₹{(stats.totalBookedSales || 0).toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Live Operations Linked
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Avg Call Productivity
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {stats.avgProductivity || 0}%
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Productive calls vs beat target
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Incentive Accrued
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                ₹{(stats.totalEarnedIncentive || 0).toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Award className="w-3 h-3" /> Payroll Commission (4.8%)
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Must-Sell Focus Strike Rate
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
                {salesmen.length > 0 
                  ? `${Math.round(
                      (salesmen.reduce((acc, s) => acc + (s.mustSellCompleted || 0), 0) /
                        Math.max(1, salesmen.reduce((acc, s) => acc + (s.mustSellTotal || 1), 0))) * 100
                    )}%`
                  : '0.0%'}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                High-margin SKU strike rate
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search salesman by name or beat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Beat:</span>
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {uniqueBeats.slice(0, 5).map((beat) => (
                <button
                  key={beat}
                  onClick={() => setSelectedBeat(beat)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer transition-colors ${
                    selectedBeat === beat
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {beat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Salesmen Performance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSalesmen.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{s.name}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {s.phone || '98XXXXXXXX'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {s.beat}
                  </span>
                </div>

                <div className="space-y-2 text-xs py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Calls Productive:</span>
                    <span className="font-bold text-slate-800">
                      {s.productive} / {s.planned} ({s.productivityPercent}%)
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        s.productivityPercent >= 70 ? 'bg-emerald-600' : s.productivityPercent >= 50 ? 'bg-teal-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${s.productivityPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Lines per call (LPC):</span>
                    <span className="font-bold text-teal-700">{s.lpc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Today&apos;s Booked Sales:</span>
                    <span className="font-black text-slate-900">₹{(s.sales || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Must-Sell Coverage:</span>
                    <span className="font-bold text-amber-700">
                      {s.mustSellCompleted} / {s.mustSellTotal} items
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> ₹{(s.earnedIncentive || 0).toLocaleString('en-IN')} Earned
                </span>
                
                <button
                  onClick={() => setActiveSalesmanForVisit(s)}
                  title="Record Store Visit Call"
                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                  <span>Log Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSalesmen.length === 0 && !loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs">
            No salesmen found matching your criteria.
          </div>
        )}

        {/* Add Salesman Modal */}
        <AddSalesmanModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            showNotification({
              title: 'Salesman Added',
              message: 'New salesman onboarded and assigned to beat.',
              type: 'success'
            });
            fetchFieldTeam();
          }}
        />

        {/* Real Dynamic Store Visit Modal */}
        <LogVisitModal
          isOpen={!!activeSalesmanForVisit}
          salesman={activeSalesmanForVisit}
          onClose={() => setActiveSalesmanForVisit(null)}
          onSuccess={(salesmanName, amount) => {
            showNotification({
              title: 'Store Visit Recorded',
              message: amount > 0 
                ? `Logged productive call with ₹${amount.toLocaleString('en-IN')} order for ${salesmanName}.`
                : `Logged non-productive store visit for ${salesmanName}.`,
              type: 'success'
            });
            fetchFieldTeam();
          }}
        />
      </div>
    </ERPLayout>
  );
}
