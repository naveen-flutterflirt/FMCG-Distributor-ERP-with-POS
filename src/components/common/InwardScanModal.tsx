'use client';

import React, { useState } from 'react';
import { X, QrCode, ScanLine, ArrowDownToLine, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface InwardScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function InwardScanModal({ isOpen, onClose, onSuccess }: InwardScanModalProps) {
  const { token } = useAuth();
  const [barcode, setBarcode] = useState('');
  const [cases, setCases] = useState<number>(10);
  const [pcs, setPcs] = useState<number>(0);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('30 Sep 2027');
  const [location, setLocation] = useState('Main Godown (Bay A)');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickBarcode = (code: string) => {
    setBarcode(code);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) {
      setErrorMsg('Please enter or scan a barcode/SKU code');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_BASE}/godown/inward-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          barcode: barcode.trim(),
          cases: Number(cases),
          pcs: Number(pcs),
          batchNumber: batchNumber.trim() || `GRN-${Date.now().toString(36).toUpperCase()}`,
          expiryDate,
          location,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to inward stock');
      }

      setSuccessMsg(data.message || 'Stock successfully inwarded!');
      onSuccess();

      // Reset form after 1.5 seconds
      setTimeout(() => {
        setSuccessMsg('');
        setBarcode('');
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Scan inward failed');
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
            <div className="w-8 h-8 rounded-lg bg-[#00897b] flex items-center justify-center text-white">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Inward GRN by Barcode / SKU Scan</h3>
              <p className="text-[11px] text-teal-200">Direct warehouse stock entry &amp; FIFO batch allocation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8ea8a2] hover:text-white hover:bg-[#0c3339] transition-colors"
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

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Barcode scan input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Scan Barcode / Enter SKU Code <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g. 890103001 or TEA-250"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 focus:bg-white font-mono"
              />
              <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Quick Demo chips for convenience */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-medium">Quick pick:</span>
              <button
                type="button"
                onClick={() => handleQuickBarcode('890103001')}
                className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded border border-slate-200 cursor-pointer"
              >
                Tea (890103001)
              </button>
              <button
                type="button"
                onClick={() => handleQuickBarcode('890103002')}
                className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded border border-slate-200 cursor-pointer"
              >
                Biscuit (890103002)
              </button>
              <button
                type="button"
                onClick={() => handleQuickBarcode('890103005')}
                className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded border border-slate-200 cursor-pointer"
              >
                Oil (890103005)
              </button>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cases to Inward <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={cases}
                onChange={(e) => setCases(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loose Pieces
              </label>
              <input
                type="number"
                min="0"
                value={pcs}
                onChange={(e) => setPcs(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600"
              />
            </div>
          </div>

          {/* Batch & Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Batch Number
              </label>
              <input
                type="text"
                placeholder="Auto if blank"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="30 Sep 2027"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Godown Bay / Rack Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-teal-600 cursor-pointer"
            >
              <option value="Main Godown (Bay A)">Main Godown (Bay A - Fast Moving)</option>
              <option value="Main Godown (Bay B)">Main Godown (Bay B - Bulk Stack)</option>
              <option value="Main Godown (Bay C)">Main Godown (Bay C - Personal Care)</option>
              <option value="Cold Storage / Beverage Zone">Cold Storage / Beverage Zone</option>
            </select>
          </div>

          {/* Submit Action */}
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
                  <span>Inwarding into DB...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Confirm Inward to Godown</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
