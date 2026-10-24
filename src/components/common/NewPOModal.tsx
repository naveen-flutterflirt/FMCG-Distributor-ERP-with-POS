'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Trash2, Loader2, AlertCircle, Building2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NewPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skus: any[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewPOModal({ isOpen, onClose, onSuccess, skus }: NewPOModalProps) {
  const { token } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [dispatchRef, setDispatchRef] = useState(`DIS-${Date.now().toString(36).toUpperCase()}`);
  const [items, setItems] = useState<any[]>([
    { skuId: 'sku-1', skuName: 'Tea 250 g', casesOrdered: 50, rate: 108.00, amount: 5400 * 24 }
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Inline "Add New Company" state
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCategory, setNewCompanyCategory] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);

  // Fetch dynamic companies from Neon PostgreSQL
  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const res = await fetch(`${API_BASE}/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setCompanies(data.data);
        if (!selectedCompanyId) {
          setSelectedCompanyId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load companies from DB', err);
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    if (!token || !isOpen) return;
    fetchCompanies();
  }, [token, isOpen]);

  if (!isOpen) return null;

  // Handle adding a new company on the fly
  const handleSaveCompany = async () => {
    if (!newCompanyName.trim()) return;
    try {
      setSavingCompany(true);
      const res = await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCompanyName.trim(),
          category: newCompanyCategory.trim() || 'General FMCG'
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchCompanies();
        setSelectedCompanyId(data.data.id);
        setIsAddingCompany(false);
        setNewCompanyName('');
        setNewCompanyCategory('');
      } else {
        setErrorMsg(data.message || 'Failed to add company');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving new company');
    } finally {
      setSavingCompany(false);
    }
  };

  const handleAddItem = () => {
    const defaultSku = skus[0] || { id: 'sku-1', name: 'Tea 250 g', rate: 108 };
    setItems([
      ...items,
      {
        skuId: defaultSku.id,
        skuName: defaultSku.name,
        casesOrdered: 20,
        rate: Number(defaultSku.rate),
        amount: 20 * (defaultSku.unitsPerCase || 12) * Number(defaultSku.rate)
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSkuChange = (index: number, skuId: string) => {
    const selected = skus.find((s) => s.id === skuId);
    if (!selected) return;
    const updated = [...items];
    updated[index].skuId = selected.id;
    updated[index].skuName = selected.name;
    updated[index].rate = Number(selected.rate);
    const uomMultiplier = selected.unitsPerCase || 12;
    updated[index].amount = updated[index].casesOrdered * uomMultiplier * Number(selected.rate);
    setItems(updated);
  };

  const handleCasesChange = (index: number, cases: number) => {
    const updated = [...items];
    updated[index].casesOrdered = cases;
    const selected = skus.find((s) => s.id === updated[index].skuId);
    const uomMultiplier = selected?.unitsPerCase || 12;
    updated[index].amount = cases * uomMultiplier * updated[index].rate;
    setItems(updated);
  };

  const totalAmount = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)?.name || 'Company';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Please add at least one SKU to the purchase order');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyId: selectedCompanyId,
          companyName: selectedCompany,
          totalAmount,
          itemsCount: items.length,
          dispatchRef: dispatchRef.trim(),
          status: 'In Transit',
          grnStatus: 'Pending GRN Scan',
          items: items.map((it) => ({
            skuId: it.skuId,
            skuName: it.skuName,
            casesOrdered: Number(it.casesOrdered),
            rate: Number(it.rate),
            amount: Number(it.amount),
          }))
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place PO');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating PO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#072428] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00897b] flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Create Primary Purchase Order</h3>
              <p className="text-[11px] text-teal-200">Place direct factory PO to principal FMCG company</p>
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  FMCG Principal Company <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCompany(!isAddingCompany)}
                  className="text-[10px] text-teal-700 hover:text-teal-900 font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> {isAddingCompany ? 'Select Existing' : 'Add New'}
                </button>
              </div>

              {isAddingCompany ? (
                <div className="p-2.5 bg-teal-50/60 border border-teal-200 rounded-lg space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Company name (e.g. Nestlé India)"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white border border-teal-300 rounded focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Foods, Beverages)"
                    value={newCompanyCategory}
                    onChange={(e) => setNewCompanyCategory(e.target.value)}
                    className="w-full px-2 py-1 text-xs bg-white border border-teal-300 rounded focus:outline-hidden"
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCompany(false)}
                      className="px-2 py-0.5 text-[10px] text-slate-600 rounded hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingCompany || !newCompanyName.trim()}
                      onClick={handleSaveCompany}
                      className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-teal-700 hover:bg-teal-800 rounded flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {savingCompany ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Save to DB
                    </button>
                  </div>
                </div>
              ) : loadingCompanies ? (
                <div className="px-3 py-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Loading companies...</span>
                </div>
              ) : (
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-semibold cursor-pointer"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dispatch Reference / Waybill #
              </label>
              <input
                type="text"
                required
                value={dispatchRef}
                onChange={(e) => setDispatchRef(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-mono"
              />
            </div>
          </div>

          {/* SKU lines */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Order Lines ({items.length})</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add SKU
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto p-2 space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 pt-1 pb-1">
                  <div className="flex-1">
                    <select
                      value={item.skuId}
                      onChange={(e) => handleSkuChange(idx, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden cursor-pointer"
                    >
                      {skus.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code}) - ₹{s.rate}/ea
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.casesOrdered}
                      onChange={(e) => handleCasesChange(idx, parseInt(e.target.value) || 1)}
                      placeholder="Cases"
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-center font-bold"
                    />
                  </div>

                  <div className="w-28 text-right font-bold text-xs text-slate-900">
                    ₹{Math.round(item.amount).toLocaleString()}
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Total Estimated PO Value:</span>
              <span className="text-sm font-black text-slate-900">₹{Math.round(totalAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
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
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Place Primary PO</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
