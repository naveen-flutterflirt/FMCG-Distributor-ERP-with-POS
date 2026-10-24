'use client';

import React, { useState } from 'react';
import { X, Tag, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NewSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  companies: any[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewSchemeModal({ isOpen, onClose, onSuccess, companies }: NewSchemeModalProps) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Orders ≥ ₹5,000');
  const [benefit, setBenefit] = useState('2% off invoice value');
  const [fundedBy, setFundedBy] = useState('Company-funded');
  const [budgetTotal, setBudgetTotal] = useState<number>(50000);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a scheme name');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/schemes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          companyId: currentCompany?.id || 'comp-a',
          companyName: currentCompany?.name || 'Company A',
          category: category.trim() || 'General FMCG',
          condition: condition.trim(),
          benefit: benefit.trim(),
          fundedBy,
          budgetTotal: Number(budgetTotal),
          budgetUsed: 0,
          status: 'Active'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create scheme');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating scheme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#072428] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00897b] flex items-center justify-center text-white">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Create Trade Scheme</h3>
              <p className="text-[11px] text-teal-200">Configure retail discount or free goods offer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8ea8a2] hover:text-white hover:bg-[#0c3339] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Scheme Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. QPS 2% Volume Discount or 12+1 Deal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                FMCG Principal <span className="text-rose-500">*</span>
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
                Target Category / SKU
              </label>
              <input
                type="text"
                placeholder="e.g. Tea 250 g or All Brands"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Condition / Threshold
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Orders ≥ ₹5,000 or Buy 12 cases"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payout / Free Benefit
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2% off invoice or 1 case free"
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 text-emerald-800 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Funded By
              </label>
              <select
                value={fundedBy}
                onChange={(e) => setFundedBy(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 cursor-pointer"
              >
                <option value="Company-funded">Company-funded (Reimbursable)</option>
                <option value="Distributor-funded">Distributor-funded (Internal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Budget Cap (₹)
              </label>
              <input
                type="number"
                min="0"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-bold"
              />
            </div>
          </div>

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
              className="px-4 py-2 text-xs font-bold text-white bg-[#00897b] hover:bg-[#00796b] rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Scheme...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Activate Trade Scheme</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
