'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
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
  Plus
} from 'lucide-react';
import { MOCK_CLAIMS, ClaimRecord } from '@/data/mockData';

export default function SchemesCompanyClaims() {
  const [claims, setClaims] = useState<ClaimRecord[]>(MOCK_CLAIMS);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('CL-26-086');
  const [queryReplyOpen, setQueryReplyOpen] = useState(false);
  const [queryReplyText, setQueryReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const { showNotification } = useNotification();

  const selectedClaim = claims.find(c => c.id === selectedClaimId) || claims[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setQueryReplyOpen(false);
      setQueryReplyText('');
    }, 1500);
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header matching Page 7 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">06 · Web — Schemes & Company Claims</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Apply every scheme correctly, then get paid back for it
            </h1>
            <p className="text-xs text-slate-500">
              Distributors typically lose a share of their margin to schemes given but never claimed, or claimed late and rejected.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/schemes"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>41 Active Schemes</span>
            </Link>
            <button
              onClick={() => showNotification({
                title: 'Claim Builder Initialized',
                message: 'Compiling September closing claim file across QPS slabs, free goods vouchers, and distributor debit entries.',
                type: 'info'
              })}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Raise New Claim</span>
            </button>
          </div>
        </div>

        {/* 5 Top KPI Cards matching Page 7 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Claims raised YTD */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Claims raised YTD
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹1.12<span className="text-base font-bold text-slate-700">Cr</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              6 companies
            </div>
          </div>

          {/* 2. Settled */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Settled
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
              ₹94.4<span className="text-base font-bold text-emerald-800">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold">
              84% recovery
            </div>
          </div>

          {/* 3. Pending */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Pending
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              ₹17.6<span className="text-base font-bold text-slate-700">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-rose-600 font-semibold">
              ₹5.2L &gt; 60 days
            </div>
          </div>

          {/* 4. Not yet raised */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Not yet raised
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
              ₹3.8<span className="text-base font-bold text-amber-800">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-amber-800 font-medium">
              September schemes
            </div>
          </div>

          {/* 5. Rejected YTD */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Rejected YTD
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
              ₹1.9<span className="text-base font-bold text-rose-700">L</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              mostly late filing
            </div>
          </div>
        </div>

        {/* Claims Register & Evidence Pack Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Claims register table matching Page 7 (Takes 8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                Claims register
              </h3>
              <span className="text-[11px] text-slate-500">
                Click claim to view audit evidence pack
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">Claim</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-2">Period</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-2 text-center">Age</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claims.map((c) => {
                    const isSelected = selectedClaimId === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedClaimId(c.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-teal-50/50 ring-1 ring-teal-500/30' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                          {c.id}
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{c.company}</td>
                        <td className="py-2.5 px-3 text-slate-600">{c.type}</td>
                        <td className="py-2.5 px-2 text-slate-600">{c.period}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ₹{c.amount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600">{c.ageDays} d</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                              c.status === 'Submitted'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : c.status === 'Query raised'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : c.status === 'Audit done'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : c.status === 'Credit note recd.'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Evidence Pack & Reminders matching Page 7 (Takes 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Claim Evidence pack card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Claim {selectedClaim.id} · evidence pack
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">DMS Sync</span>
              </div>

              <div className="py-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Invoice-wise free goods list</span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm">
                    Auto
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Outlet list with GSTIN</span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-sm">
                    Auto
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Scheme circular</span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-sm">
                    Linked
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Company&apos;s claim format</span>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-sm">
                    Generated
                  </span>
                </div>

                {selectedClaim.queryNote && (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 mt-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Query: {selectedClaim.queryNote}</span>
                      <button
                        onClick={() => setQueryReplyOpen(!queryReplyOpen)}
                        className="text-[11px] bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded-sm"
                      >
                        Reply
                      </button>
                    </div>

                    {queryReplyOpen && (
                      <form onSubmit={handleSendReply} className="mt-2 space-y-2">
                        <textarea
                          rows={2}
                          value={queryReplyText}
                          onChange={(e) => setQueryReplyText(e.target.value)}
                          placeholder="Provide explanation and attach revised invoice batch..."
                          className="w-full text-xs p-1.5 bg-white border border-amber-300 rounded-md focus:outline-hidden"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-black text-white py-1 rounded-md text-[11px] font-semibold"
                        >
                          Submit Clarification to {selectedClaim.company}
                        </button>
                      </form>
                    )}

                    {replySuccess && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        Response transmitted to Company portal!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Active schemes · October · 41 card matching Page 7 */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5">
                Active schemes · October · 41
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Company A: QPS 2% on ₹5K+ · Company B: biscuits 12+1 · Company C: cooler display ₹500/outlet · Company D: combo detergent + bar
              </p>
            </div>

            {/* Reminder Card matching Page 7 */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 shadow-2xs text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Reminder</span>
              </div>
              <p className="text-slate-700">
                Company B claims close 15 days after month end — <strong>6 days left for September</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom 4 Concept Panels matching Page 7 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-xs mb-1.5">Scheme types</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free goods · % / ₹ off · slab · QPS · combo · first-order · outlet-class
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-xs mb-1.5">Who funds it</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Company-funded (claimable) vs distributor-funded (own margin) — tagged on every line
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-xs mb-1.5">Budget control</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Company scheme budget per month; billing stops the scheme when it runs out
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <h4 className="font-bold text-slate-900 text-xs mb-1.5">Claim types</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scheme · damage & expiry · price drop · display · transport · salesman salary support
            </p>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
