'use client';

import React, { useState } from 'react';
import { X, IndianRupee, CreditCard, Banknote, QrCode, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RecordReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  outlet: any;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const PAYMENT_MODES = [
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
  { id: 'Cheque', label: 'Bank Cheque', icon: CreditCard },
  { id: 'NEFT', label: 'NEFT / RTGS', icon: IndianRupee },
];

export default function RecordReceiptModal({ isOpen, onClose, onSuccess, outlet }: RecordReceiptModalProps) {
  const { token } = useAuth();
  const [amount, setAmount] = useState<number>(outlet?.currentBalance || 0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [referenceNo, setReferenceNo] = useState('');
  const [salesmanName, setSalesmanName] = useState('Rakesh (Salesman)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !outlet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setErrorMsg('Please enter a valid payment collection amount');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/collections/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          outletId: outlet.id,
          outletName: outlet.name,
          amount: Number(amount),
          paymentMode,
          referenceNo: referenceNo.trim() || `${paymentMode.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          collectionDate: 'Today',
          salesmanName,
          notes: notes.trim() || `Collection against ledger dues`,
          status: paymentMode === 'Cheque' ? 'In Clearing' : 'Cleared'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to record payment');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error recording payment receipt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#072428] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00897b] flex items-center justify-center text-white font-bold">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Record Payment Collection</h3>
              <p className="text-[11px] text-teal-200">Credits ledger &amp; reduces retailer balance in DB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8ea8a2] hover:text-white hover:bg-[#0c3339] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Outlet Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-xs">{outlet.name}</h4>
              <p className="text-[11px] text-slate-500">{outlet.route} · {outlet.ownerName}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Balance</span>
              <span className="text-sm font-black text-rose-600">₹{Number(outlet.currentBalance).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Payment Mode <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = paymentMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id)}
                    className={`p-2 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amount Collected (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-extrabold text-emerald-800"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => setAmount(outlet.currentBalance)}
                className="text-teal-700 hover:underline font-semibold"
              >
                Clear Full Balance (₹{Number(outlet.currentBalance).toLocaleString()})
              </button>
              <span>Balance After: ₹{Math.max(0, outlet.currentBalance - amount).toLocaleString()}</span>
            </div>
          </div>

          {/* Reference & Collector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ref / Cheque / UTR #
              </label>
              <input
                type="text"
                placeholder="e.g. UTR-9821 or CHQ-001"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Collected By
              </label>
              <input
                type="text"
                value={salesmanName}
                onChange={(e) => setSalesmanName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Receipt Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Part payment on Friday beat visit"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600"
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
              className="px-4 py-2 text-xs font-bold text-white bg-[#00897b] hover:bg-[#00796b] rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording in Ledger...</span>
                </>
              ) : (
                <>
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Confirm Receipt &amp; Credit Ledger</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
