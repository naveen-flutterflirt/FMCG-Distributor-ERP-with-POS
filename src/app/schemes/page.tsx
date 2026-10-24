'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import NewSchemeModal from '@/components/common/NewSchemeModal';
import { SkeletonCard } from '@/components/common/Skeleton';
import {
  Tag,
  Plus,
  CheckCircle2,
  Search,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SchemesCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [fundingFilter, setFundingFilter] = useState('All');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSchemeOpen, setIsNewSchemeOpen] = useState(false);

  const { showNotification } = useNotification();
  const { token } = useAuth();

  const fetchSchemesData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (companyFilter !== 'All') params.append('companyId', companyFilter);
      if (fundingFilter !== 'All') params.append('fundedBy', fundingFilter);

      const [schemesRes, statsRes, compRes] = await Promise.all([
        fetch(`${API_BASE}/schemes?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/schemes/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/companies`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const schemesData = await schemesRes.json();
      const statsData = await statsRes.json();
      const compData = await compRes.json();

      if (schemesData.success) {
        setSchemes(schemesData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
      if (compData.success) {
        setCompanies(compData.data);
      }
    } catch (err: any) {
      showNotification({
        title: 'Error loading schemes',
        message: err.message || 'Failed to sync with backend',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemesData();
  }, [token, searchTerm, companyFilter, fundingFilter]);

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">06 · Web — Scheme Engine &amp; Master</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Active Trade Schemes &amp; Eligibility Rules
            </h1>
            <p className="text-xs text-slate-500">
              Live schemes from Neon PostgreSQL. Auto-applied on POS orders; funded schemes claimable back from principal companies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSchemesData}
              title="Refresh Schemes"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/claims"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Company Claims Register</span>
            </Link>
            <button
              onClick={() => setIsNewSchemeOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#00897b] hover:bg-[#00796b] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span> Create Scheme</span>
            </button>
          </div>
        </div>

        {/* Search & Dynamic Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scheme name, category, company..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Funding Types</option>
              <option value="Company-funded">Company-funded</option>
              <option value="Distributor-funded">Distributor-funded</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Total Active: <strong className="text-slate-900">{stats?.totalActive ?? schemes.length}</strong></span>
            <span>Company-Funded: <strong className="text-teal-700">{stats?.companyFunded ?? 0}</strong></span>
            <span>Distributor-Funded: <strong className="text-slate-900">{stats?.distributorFunded ?? 0}</strong></span>
          </div>
        </div>

        {/* Grid of Schemes */}
        {loading && schemes.length === 0 ? (
          <SkeletonCard count={6} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
        ) : schemes.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No active trade schemes match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemes.map((s) => (
              <div key={s.id} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-500/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{s.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.fundedBy === 'Company-funded' ? 'bg-teal-50 text-teal-700 border border-teal-200/50' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {s.fundedBy}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{s.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{s.company} · <span className="font-medium text-slate-700">{s.category}</span></p>

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
        )}
      </div>

      {/* Dynamic Create Scheme Modal */}
      <NewSchemeModal
        isOpen={isNewSchemeOpen}
        onClose={() => setIsNewSchemeOpen(false)}
        onSuccess={fetchSchemesData}
        companies={companies}
      />
    </ERPLayout>
  );
}
