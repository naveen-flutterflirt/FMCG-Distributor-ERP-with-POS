'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { MOCK_OUTLETS, MOCK_SKUS } from '@/data/mockData';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (order: unknown) => void;
}

export default function NewOrderModal({ isOpen, onClose, onSuccess }: NewOrderModalProps) {
  const [selectedOutletId, setSelectedOutletId] = useState(MOCK_OUTLETS[0]?.id || '');
  const [items, setItems] = useState([
    { skuId: MOCK_SKUS[0]?.id || '', qtyCases: 2, qtyPcs: 0, rate: MOCK_SKUS[0]?.rate || 108 }
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, { skuId: MOCK_SKUS[1]?.id || '', qtyCases: 1, qtyPcs: 0, rate: MOCK_SKUS[1]?.rate || 8.4 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const sku = MOCK_SKUS.find(s => s.id === item.skuId);
      const pcsTotal = (item.qtyCases * (sku?.unitsPerCase || 1)) + Number(item.qtyPcs || 0);
      return sum + (pcsTotal * (item.rate || 0));
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const selectedOutlet = MOCK_OUTLETS.find(o => o.id === selectedOutletId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Create New Sales Order</h3>
            <p className="text-xs text-slate-500">Route & Pre-sell order capture with automatic scheme pricing</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Order Placed Successfully!</h4>
            <p className="text-xs text-slate-500">Order sent to evening billing desk & route load sheet.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Outlet / Retailer</label>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                {MOCK_OUTLETS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.route}) — Balance: ₹{o.currentBalance.toLocaleString()} {o.status === 'credit_hold' ? '[HOLD]' : ''}
                  </option>
                ))}
              </select>
              {selectedOutlet && (
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Channel: <strong className="text-slate-700">{selectedOutlet.channel}</strong></span>
                  <span>Credit Limit: <strong className="text-slate-700">₹{selectedOutlet.creditLimit.toLocaleString()}</strong></span>
                  <span>GSTIN: <strong className="text-slate-700">{selectedOutlet.gstin || 'Unregistered'}</strong></span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Order Line Items</label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add SKU
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                    <div className="flex-1">
                      <select
                        value={item.skuId}
                        onChange={(e) => {
                          const sku = MOCK_SKUS.find(s => s.id === e.target.value);
                          const updated = [...items];
                          updated[idx] = { ...updated[idx], skuId: e.target.value, rate: sku?.rate || 0 };
                          setItems(updated);
                        }}
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      >
                        {MOCK_SKUS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.company}) — ₹{s.rate}/unit
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
                        placeholder="Pieces"
                        className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md"
                      />
                    </div>

                    <div className="w-24 text-right font-medium text-slate-700">
                      ₹{((item.qtyCases * (MOCK_SKUS.find(s => s.id === item.skuId)?.unitsPerCase || 1) + item.qtyPcs) * item.rate).toLocaleString()}
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-600">
                Estimated Amount: <strong className="text-sm font-bold text-slate-900">₹{calculateTotal().toLocaleString()}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-xs"
                >
                  Save & Bill Order
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
