'use client';

import React, { useState } from 'react';
import { X, Store, User, MapPin, Phone, CreditCard, ShieldCheck, Loader2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface OnboardOutletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOutlet: any) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OnboardOutletModal({ isOpen, onClose, onSuccess }: OnboardOutletModalProps) {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [route, setRoute] = useState('R4 Gandhi Nagar');
  const [customRoute, setCustomRoute] = useState('');
  const [isCustomRoute, setIsCustomRoute] = useState(false);
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState('General Trade');
  const [gstin, setGstin] = useState('');
  const [creditLimit, setCreditLimit] = useState(25000);
  const [creditDays, setCreditDays] = useState(14);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalRoute = isCustomRoute ? customRoute.trim() : route.trim();
    if (!name.trim() || !ownerName.trim() || !phone.trim() || !finalRoute) {
      setError('Outlet Name, Owner Name, Phone, and Route/Beat are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/outlets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          name: name.trim(),
          ownerName: ownerName.trim(),
          route: finalRoute,
          phone: phone.trim(),
          channel,
          gstin: gstin.trim() || null,
          creditLimit: Number(creditLimit),
          creditDays: Number(creditDays),
          currentBalance: 0
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to onboard outlet');
      }

      onSuccess(data.data);
      setName('');
      setOwnerName('');
      setPhone('');
      setCustomRoute('');
      setIsCustomRoute(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to onboard outlet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Onboard Retail Outlet</h3>
              <p className="text-[11px] text-slate-500">Add retail store to beat sequencing & credit master</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Store / Trade Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shiva Super Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Proprietor / Owner Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sunil Kumar"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                  Route / Beat *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomRoute(!isCustomRoute)}
                  className="text-[10px] text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                >
                  {isCustomRoute ? '← Pick standard route' : '+ Enter custom route'}
                </button>
              </div>

              {isCustomRoute ? (
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 14 / Main Bazaar"
                  value={customRoute}
                  onChange={(e) => setCustomRoute(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-teal-400 bg-teal-50/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              ) : (
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white cursor-pointer"
                >
                  <option value="R4 Gandhi Nagar">R4 Gandhi Nagar (B-GN)</option>
                  <option value="R2 Station Rd">R2 Station Rd (B-SR)</option>
                  <option value="R1 Civil Lines">R1 Civil Lines (B-CL)</option>
                  <option value="R3 Old Market">R3 Old Market (B-OM)</option>
                  <option value="R6 Industrial Area">R6 Industrial Area (B-IA)</option>
                  <option value="MT route">MT route (B-MT)</option>
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Trade Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white cursor-pointer"
              >
                <option value="General Trade">General Trade (Kirana)</option>
                <option value="Modern Trade">Modern Trade (Supermarket)</option>
                <option value="HoReCa">HoReCa (Hotel / Cafe)</option>
                <option value="Wholesale">Wholesale / Semi-Wholesale</option>
                <option value="Chemist">Chemist / Pharmacy</option>
                <option value="Institutional">Institutional / Canteen</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                placeholder="07AAAAA1234A1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Credit Limit (₹)
              </label>
              <input
                type="number"
                step={5000}
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Credit Days
              </label>
              <input
                type="number"
                min={0}
                max={90}
                value={creditDays}
                onChange={(e) => setCreditDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
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
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Store className="w-3.5 h-3.5" />}
              <span>{submitting ? 'Onboarding...' : 'Onboard Outlet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
