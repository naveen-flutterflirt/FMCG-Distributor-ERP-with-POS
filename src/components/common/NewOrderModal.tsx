'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Loader2, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (order: unknown) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewOrderModal({ isOpen, onClose, onSuccess }: NewOrderModalProps) {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [skus, setSkus] = useState<any[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoadingData(true);
          setError('');
          const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
          const headers = {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          };

          const [outletsRes, skusRes] = await Promise.all([
            fetch(`${API_BASE}/outlets`, { headers }),
            fetch(`${API_BASE}/skus`, { headers })
          ]);

          if (outletsRes.ok) {
            const od = await outletsRes.json();
            if (od.success && Array.isArray(od.data) && od.data.length > 0) {
              setOutlets(od.data);
              setSelectedOutletId(od.data[0].id);
            } else {
              setOutlets([]);
              setSelectedOutletId('');
            }
          }

          if (skusRes.ok) {
            const sd = await skusRes.json();
            if (sd.success && Array.isArray(sd.data) && sd.data.length > 0) {
              setSkus(sd.data);
              setItems([
                { skuId: sd.data[0].id, qtyCases: 1, qtyPcs: 0, rate: sd.data[0].rate || 0 }
              ]);
            } else {
              setSkus([]);
              setItems([]);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const defaultSku = skus[0] || {};
    setItems([...items, { skuId: defaultSku.id || '', qtyCases: 1, qtyPcs: 0, rate: defaultSku.rate || 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const sku = skus.find(s => s.id === item.skuId);
      const unitsPerCase = Number(sku?.unitsPerCase || sku?.units_per_case || 1);
      const pcsTotal = (Number(item.qtyCases || 0) * unitsPerCase) + Number(item.qtyPcs || 0);
      return sum + (pcsTotal * (Number(item.rate) || 0));
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutletId) {
      setError('Please select an outlet.');
      return;
    }
    if (items.length === 0) {
      setError('Please add at least one SKU line item.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const selectedOutlet = outlets.find(o => o.id === selectedOutletId);

      const orderPayload = {
        outlet_id: selectedOutletId,
        outlet_name: selectedOutlet?.name || 'Retail Outlet',
        route: selectedOutlet?.route || 'Beat Route',
        source: 'Salesman',
        salesman_name: 'Counter / Direct',
        lines_count: items.length,
        total_value: calculateTotal(),
        lines: items.map(it => {
          const sku = skus.find(s => s.id === it.skuId);
          const unitsPerCase = Number(sku?.unitsPerCase || sku?.units_per_case || 1);
          const pcsTotal = (Number(it.qtyCases || 0) * unitsPerCase) + Number(it.qtyPcs || 0);
          return {
            sku_id: it.skuId,
            sku_name: sku?.name || 'SKU Item',
            qty_cases: Number(it.qtyCases || 0),
            qty_pcs: Number(it.qtyPcs || 0),
            rate: Number(it.rate || 0),
            amount: pcsTotal * Number(it.rate || 0)
          };
        })
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess(data.data);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOutlet = outlets.find(o => o.id === selectedOutletId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Create New Sales Order</h3>
            <p className="text-xs text-slate-500">Route &amp; Pre-sell order capture with automatic scheme pricing</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Order Placed Successfully!</h4>
            <p className="text-xs text-slate-500">Recorded into PostgreSQL sales orders &amp; evening billing queue.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Outlet / Retailer *</label>
              {outlets.length > 0 ? (
                <select
                  value={selectedOutletId}
                  onChange={(e) => setSelectedOutletId(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.route}) — Balance: ₹{Number(o.currentBalance || 0).toLocaleString('en-IN')} {o.status === 'credit_hold' ? '[HOLD]' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  No outlets registered yet. Please create an outlet in <strong>&quot;Outlets &amp; Beats&quot;</strong> first.
                </div>
              )}
              {selectedOutlet && (
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Channel: <strong className="text-slate-700">{selectedOutlet.channel}</strong></span>
                  <span>Credit Limit: <strong className="text-slate-700">₹{Number(selectedOutlet.creditLimit || 0).toLocaleString('en-IN')}</strong></span>
                  <span>GSTIN: <strong className="text-slate-700">{selectedOutlet.gstin || 'Unregistered'}</strong></span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Order Line Items</label>
                {skus.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add SKU
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="p-3 text-center border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs">
                  {skus.length === 0 
                    ? 'No products (SKUs) available. Add products to inventory first.'
                    : 'Click "+ Add SKU" to add order line items.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                    <div className="flex-1">
                      <select
                        value={item.skuId}
                        onChange={(e) => {
                          const sku = skus.find(s => s.id === e.target.value);
                          const updated = [...items];
                          updated[idx] = { ...updated[idx], skuId: e.target.value, rate: Number(sku?.rate) || 0 };
                          setItems(updated);
                        }}
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      >
                        {skus.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.company_name || s.company}) — ₹{Number(s.rate).toFixed(2)}/unit
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        value={item.qtyCases}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].qtyCases = Number(e.target.value);
                          setItems(updated);
                        }}
                        placeholder="Cases"
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>

                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        value={item.qtyPcs}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx].qtyPcs = Number(e.target.value);
                          setItems(updated);
                        }}
                        placeholder="Pcs"
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">Total Order Value</span>
                <span className="text-base font-extrabold text-slate-900">₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{submitting ? 'Placing Order...' : 'Book Order'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
