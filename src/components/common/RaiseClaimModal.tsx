'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RaiseClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companies: any[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CLAIM_TYPES = [
  'Trade scheme (QPS)',
  'Free goods (12+1)',
  'Damage / expiry return',
  'Display / visibility asset subsidy',
  'Price drop (stock on hand protection)',
  'Transport / Logistics subsidy',
];

export default function RaiseClaimModal({ isOpen, onClose, onSuccess, companies }: RaiseClaimModalProps) {
  const { token } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [claimType, setClaimType] = useState(CLAIM_TYPES[0]);
  const [period, setPeriod] = useState(`${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`);
  const [amount, setAmount] = useState<number>(25000);
  const [queryNote, setQueryNote] = useState('');
  const [freeGoodsList, setFreeGoodsList] = useState(true);
  const [outletListGst, setOutletListGst] = useState(true);
  const [circularLinked, setCircularLinked] = useState(true);
  const [formatGenerated, setFormatGenerated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setErrorMsg('Please enter a valid claim amount');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId: currentCompany?.id || 'comp-a',
          company: currentCompany?.name || 'Company A · Personal Care',
          type: claimType,
          period,
          amount: Number(amount),
          queryNote: queryNote.trim() || null,
          freeGoodsList,
          outletListGst,
          circularLinked,
          formatGenerated
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to raise claim');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#072428] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Raise FMCG Company Claim</h3>
              <p className="text-[11px] text-teal-200">Submit trade reimbursement for manufacturer audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8ea8a2] hover:text-white hover:bg-[#0c3339] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                FMCG Company <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCompanyId || currentCompany?.id}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-semibold cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Claim Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-semibold cursor-pointer"
              >
                {CLAIM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Claim Period
              </label>
              <input
                type="text"
                required
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Claim Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-bold text-emerald-800"
              />
            </div>
          </div>

          {/* Audit Evidences Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Attached Audit Evidences (Auto-validated)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeGoodsList}
                  onChange={(e) => setFreeGoodsList(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Free Goods Voucher List</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={outletListGst}
                  onChange={(e) => setOutletListGst(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Retailer Outlet GSTIN List</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={circularLinked}
                  onChange={(e) => setCircularLinked(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Company Circular Linked</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formatGenerated}
                  onChange={(e) => setFormatGenerated(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Company E-Claim Format</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal / Circular Reference Note
            </label>
            <textarea
              rows={2}
              placeholder="e.g. As per circular #CIRC-SEP-04, 2% discount passed to all retailers..."
              value={queryNote}
              onChange={(e) => setQueryNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Claim...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Claim to Company</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
