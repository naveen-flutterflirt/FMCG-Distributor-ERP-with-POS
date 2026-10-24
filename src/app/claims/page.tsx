'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import RaiseClaimModal from '@/components/common/RaiseClaimModal';
import { SkeletonCard, SkeletonTable } from '@/components/common/Skeleton';
import {
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Paperclip,
  Send,
  Download,
  FileText,
  Tag,
  DollarSign,
  Plus,
  RefreshCw,
  Loader2,
  Search
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SchemesCompanyClaims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [queryReplyOpen, setQueryReplyOpen] = useState(false);
  const [queryReplyText, setQueryReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  const fetchClaimsData = async () => {
    if (authLoading) return;
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const [claimsRes, statsRes, compRes] = await Promise.all([
        fetch(`${API_BASE}/claims?${params.toString()}`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        }),
        fetch(`${API_BASE}/claims/stats`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        }),
        fetch(`${API_BASE}/companies`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        })
      ]);

      const claimsData = await claimsRes.json();
      const statsData = await statsRes.json();
      const compData = await compRes.json();

      if (claimsData.success) {
        setClaims(claimsData.data);
        if (claimsData.data.length > 0 && !selectedClaimId) {
          setSelectedClaimId(claimsData.data[0].id);
        }
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
      if (compData.success) {
        setCompanies(compData.data);
      }
    } catch (err: any) {
      showNotification({
        title: 'Error loading claims',
        message: err.message || 'Failed to sync with backend',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimsData();
  }, [token, authLoading, searchTerm, statusFilter]);

  const selectedClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryReplyText.trim() || !selectedClaim) return;

    try {
      setReplyLoading(true);
      const res = await fetch(`${API_BASE}/claims/${selectedClaim.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ replyText: queryReplyText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setReplySuccess(true);
        showNotification({
          title: 'Reply Submitted to Principal',
          message: `Audit response for ${selectedClaim.id} logged. Status updated to Audit Done.`,
          type: 'success'
        });
        setTimeout(() => {
          setReplySuccess(false);
          setQueryReplyOpen(false);
          setQueryReplyText('');
          fetchClaimsData();
        }, 1200);
      }
    } catch (err: any) {
      showNotification({
        title: 'Reply Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">06 · Web — Schemes &amp; Company Claims</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Apply every scheme correctly, then get paid back for it
            </h1>
            <p className="text-xs text-slate-500">
              Live claims register linked directly to Neon PostgreSQL. Track audit notes, debit formats &amp; recovery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/schemes"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>Active Schemes</span>
            </Link>
            <button
              onClick={fetchClaimsData}
              title="Refresh Claims"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsRaiseModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Raise New Claim</span>
            </button>
          </div>
        </div>

        {/* 5 Top KPI Cards */}
        {loading && !stats ? (
          <SkeletonCard count={5} className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Claims raised YTD
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                ₹{stats ? (stats.totalRaised / 10000000).toFixed(2) : '0.00'}<span className="text-base font-bold text-slate-700">Cr</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                {stats?.companiesCount || 0} principal companies
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Settled / Recovered
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                ₹{stats ? (stats.settled / 100000).toFixed(1) : '0.0'}<span className="text-base font-bold text-emerald-800">L</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
                Credit notes received
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Pending in Audit
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                ₹{stats ? (stats.pending / 100000).toFixed(1) : '0.0'}<span className="text-base font-bold text-slate-700">L</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                {claims.filter(c => c.status !== 'Credit note recd.').length} claims in process
              </div>
            </div>

            <div className="bg-white border border-amber-200/80 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                Queries to Resolve
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
                {claims.filter(c => c.status === 'Query raised').length}
              </div>
              <div className="mt-2 pt-2 border-t border-amber-100 text-[11px] text-amber-700 font-semibold">
                Action required
              </div>
            </div>

            <div className="bg-white border border-rose-200/80 rounded-xl p-3.5 shadow-2xs col-span-2 md:col-span-1">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                Overdue (&gt; 60 d)
              </span>
              <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
                {claims.filter(c => c.status === 'Overdue' || c.ageDays > 60).length}
              </div>
              <div className="mt-2 pt-2 border-t border-rose-100 text-[11px] text-rose-600 font-semibold">
                Escalate to ASM / RSM
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search claim #, company, or type..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Claim Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Query raised">Query raised</option>
              <option value="Audit done">Audit done</option>
              <option value="Credit note recd.">Credit note recd.</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Two-Column Claims Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Claims Register Table */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                Distributor Claims Queue (Neon PostgreSQL)
              </h3>
              <span className="text-[11px] text-teal-700 font-semibold">
                {claims.length} claims loaded
              </span>
            </div>

            <div className="overflow-x-auto">
              {loading && claims.length === 0 ? (
                <div className="p-3">
                  <SkeletonTable rows={5} cols={6} />
                </div>
              ) : claims.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No claims found matching filters.
                </div>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3">Claim ID</th>
                      <th className="py-2.5 px-3">Company</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Age</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {claims.map((c) => {
                      const isSelected = c.id === selectedClaimId;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedClaimId(c.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-teal-50/80 font-medium' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3 px-3 font-bold text-slate-900">{c.id}</td>
                          <td className="py-3 px-3 text-slate-800 font-semibold">{c.company}</td>
                          <td className="py-3 px-3 text-slate-600 truncate max-w-[120px]">{c.type}</td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">
                            ₹{Number(c.amount).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center text-slate-500">{c.ageDays} d</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                              c.status === 'Query raised'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : c.status === 'Overdue'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : c.status === 'Credit note recd.'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: Claim Detail & Audit Packet */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            {selectedClaim ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-700">CLAIM FILE</span>
                    <h2 className="text-lg font-extrabold text-slate-900">{selectedClaim.id}</h2>
                    <p className="text-xs text-slate-500 font-medium">{selectedClaim.company} · {selectedClaim.period}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Claim Amount</span>
                    <span className="text-xl font-black text-slate-900">₹{Number(selectedClaim.amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Query Banner */}
                {selectedClaim.queryNote && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Company Audit Note</span>
                    </div>
                    <p className="text-xs text-amber-900 font-medium">{selectedClaim.queryNote}</p>

                    {!queryReplyOpen ? (
                      <button
                        onClick={() => setQueryReplyOpen(true)}
                        className="text-xs font-bold text-amber-800 hover:text-amber-950 underline mt-1 block cursor-pointer"
                      >
                        + Submit response / attach proof
                      </button>
                    ) : (
                      <form onSubmit={handleSendReply} className="space-y-2 mt-2 pt-2 border-t border-amber-200/80">
                        <textarea
                          rows={2}
                          required
                          value={queryReplyText}
                          onChange={(e) => setQueryReplyText(e.target.value)}
                          placeholder="Explain reconciliation or provide circular clause..."
                          className="w-full p-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setQueryReplyOpen(false)}
                            className="px-2.5 py-1 text-xs text-slate-600 rounded hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={replyLoading}
                            className="px-3 py-1 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {replyLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            Send to Audit
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Audit Evidence Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Claim Evidence Packet</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-slate-800">Free Goods Voucher List</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedClaim.evidence?.freeGoodsList ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {selectedClaim.evidence?.freeGoodsList ? 'Attached' : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-slate-800">Retailer Outlet GSTIN List</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-slate-800">Company Circular Linked</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedClaim.evidence?.circularLinked ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {selectedClaim.evidence?.circularLinked ? 'Linked' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                {claims.length === 0 
                  ? 'No trade claims registered yet. Click "+ Raise New Claim" to submit your first claim.'
                  : 'Select a claim from the list to view its audit evidence details.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Raise Claim Modal */}
      <RaiseClaimModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        onSuccess={fetchClaimsData}
        companies={companies}
      />
    </ERPLayout>
  );
}
