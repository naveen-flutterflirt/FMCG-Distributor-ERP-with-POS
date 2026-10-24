'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Store, ShoppingBag, Loader2 } from 'lucide-react';

interface LogVisitModalProps {
  isOpen: boolean;
  salesman: any | null;
  onClose: () => void;
  onSuccess: (salesmanName: string, amount: number) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LogVisitModal({ isOpen, salesman, onClose, onSuccess }: LogVisitModalProps) {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [isProductive, setIsProductive] = useState(true);
  const [orderAmount, setOrderAmount] = useState(2500);
  const [mustSellCovered, setMustSellCovered] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && salesman) {
      // Fetch outlets for salesman's beat
      const fetchOutlets = async () => {
        try {
          const token = localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
          const res = await fetch(`${API_BASE}/outlets`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
              setOutlets(data.data);
              if (data.data.length > 0) {
                setSelectedOutlet(data.data[0].name);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchOutlets();
    }
  }, [isOpen, salesman]);

  if (!isOpen || !salesman) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/field-team/salesmen/${salesman.id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          productiveIncrement: isProductive ? 1 : 0,
          salesAmount: isProductive ? Number(orderAmount) : 0,
          mustSellIncrement: isProductive && mustSellCovered ? 1 : 0
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to record visit');
      }

      onSuccess(salesman.name, isProductive ? Number(orderAmount) : 0);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit visit call');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Log Store Visit Call</h3>
              <p className="text-[11px] text-slate-500">
                Salesman: <span className="font-bold text-slate-800">{salesman.name}</span> ({salesman.beat})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Visited Retail Store *
            </label>
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
            >
              {outlets.length > 0 ? (
                outlets.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.channel || 'General Trade'})
                  </option>
                ))
              ) : (
                <>
                  <option value="Gupta Kirana Store">Gupta Kirana Store (General Trade)</option>
                  <option value="Shree Ram General">Shree Ram General (General Trade)</option>
                  <option value="New Bharat Stores">New Bharat Stores (General Trade)</option>
                  <option value="Sharma Pan Bhandar">Sharma Pan Bhandar (General Trade)</option>
                </>
              )}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="font-bold text-xs text-slate-800 block">Productive Order Taken?</span>
              <span className="text-[11px] text-slate-500 block">Did the retailer place an order on this visit?</span>
            </div>
            <input
              type="checkbox"
              checked={isProductive}
              onChange={(e) => setIsProductive(e.target.checked)}
              className="w-4 h-4 accent-teal-600 cursor-pointer"
            />
          </div>

          {isProductive && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Actual Order Value Booked (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    required
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                <div>
                  <span className="font-bold text-xs text-teal-900 block">Must-Sell SKU Pitched?</span>
                  <span className="text-[11px] text-teal-700 block">Tea 250g / Soap 4-pack / Cold drink sold</span>
                </div>
                <input
                  type="checkbox"
                  checked={mustSellCovered}
                  onChange={(e) => setMustSellCovered(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{submitting ? 'Recording...' : 'Record Store Visit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
