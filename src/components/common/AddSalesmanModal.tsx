'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Phone, MapPin, Target, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AddSalesmanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AddSalesmanModal({ isOpen, onClose, onSuccess }: AddSalesmanModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [beatName, setBeatName] = useState('Gandhi Nagar');
  const [plannedCalls, setPlannedCalls] = useState(30);
  const [targetSales, setTargetSales] = useState(50000);
  const [mustSellTotal, setMustSellTotal] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !beatName.trim()) {
      setError('Please provide Salesman name and Beat name.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/field-team/salesmen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          beat_name: beatName.trim(),
          planned_calls: Number(plannedCalls),
          target_sales: Number(targetSales),
          must_sell_total: Number(mustSellTotal)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add salesman');
      }

      onSuccess();
      setName('');
      setPhone('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add salesman');
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
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Salesman</h3>
              <p className="text-[11px] text-slate-500">Assign beat route, daily call targets &amp; incentive slab</p>
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
              Salesman Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Singh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Beat Route *
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil Lines"
                  value={beatName}
                  onChange={(e) => setBeatName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Planned Calls
              </label>
              <input
                type="number"
                min={10}
                max={60}
                value={plannedCalls}
                onChange={(e) => setPlannedCalls(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Target Sales (₹)
              </label>
              <input
                type="number"
                step={5000}
                value={targetSales}
                onChange={(e) => setTargetSales(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Must-Sell Total
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={mustSellTotal}
                onChange={(e) => setMustSellTotal(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
          </div>

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
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>{submitting ? 'Adding...' : 'Add Salesman'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
