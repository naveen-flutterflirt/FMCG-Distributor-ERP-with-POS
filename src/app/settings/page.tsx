'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  ShieldCheck,
  Building2,
  Lock,
  Server,
  FileCheck2,
  Save,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Sliders,
  AlertTriangle
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SettingsPage() {
  const [syncedDMS, setSyncedDMS] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { token } = useAuth();

  // Form states initialized with live database schema
  const [formData, setFormData] = useState({
    distributorName: '',
    tradeName: '',
    fssaiNumber: '',
    gstin: '',
    panNumber: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    creditHardStop: true,
    maxCreditDays: 21,
    autoIrnGeneration: true,
    dmsAutoSync: true,
    vanReconciliationLock: true,
    whatsappAlerts: true
  });

  const [integrations, setIntegrations] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/settings/config`, {
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.data) {
          if (d.data.profile) {
            setFormData({
              distributorName: d.data.profile.distributorName || '',
              tradeName: d.data.profile.tradeName || '',
              fssaiNumber: d.data.profile.fssaiNumber || '',
              gstin: d.data.profile.gstin || '',
              panNumber: d.data.profile.panNumber || '',
              contactEmail: d.data.profile.contactEmail || '',
              contactPhone: d.data.profile.contactPhone || '',
              address: d.data.profile.address || '',
              city: d.data.profile.city || '',
              state: d.data.profile.state || '',
              pincode: d.data.profile.pincode || '',
              creditHardStop: d.data.profile.creditHardStop ?? true,
              maxCreditDays: d.data.profile.maxCreditDays || 21,
              autoIrnGeneration: d.data.profile.autoIrnGeneration ?? true,
              dmsAutoSync: d.data.profile.dmsAutoSync ?? true,
              vanReconciliationLock: d.data.profile.vanReconciliationLock ?? true,
              whatsappAlerts: d.data.profile.whatsappAlerts ?? true
            });
          }
          if (d.data.integrations) setIntegrations(d.data.integrations);
          if (d.data.stats) setStats(d.data.stats);
        }
      }
    } catch (e) {
      console.error('Fetch settings error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [token]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/settings/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        showNotification({
          title: 'Settings Saved',
          message: 'Distributor details, statutory licenses & credit rules updated in PostgreSQL.',
          type: 'success'
        });
        fetchConfig();
      } else {
        throw new Error(data.message || 'Failed to update settings');
      }
    } catch (err: any) {
      showNotification({
        title: 'Save Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncDMS = async () => {
    try {
      setSyncedDMS(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/settings/sync-dms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });

      const data = await res.json();
      if (data.success) {
        showNotification({
          title: 'DMS Sync Complete',
          message: data.message || 'Secondary sales invoices synchronized with Principal Company DMS portals.',
          type: 'success'
        });
      }
    } catch (err: any) {
      showNotification({
        title: 'Sync Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setSyncedDMS(false);
    }
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">Module 15 &amp; 16 · System Settings &amp; Compliance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Distributor Profile, GST &amp; Risk Controls
            </h1>
            <p className="text-xs text-slate-500">
              Configure statutory tax registrations, automated credit limits, e-Invoice keys, and enterprise DMS sync.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncDMS}
              disabled={syncedDMS}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncedDMS ? 'animate-spin' : ''}`} />
              <span>{syncedDMS ? 'Syncing...' : 'Force DMS Sync'}</span>
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

        {/* Main Settings Form */}
        {loading ? (
          <div className="bg-white border rounded-xl p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
            <p className="text-sm">Loading dynamic system configuration from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Distributor Profile */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Distributor Profile</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={formData.distributorName}
                  onChange={(e) => setFormData({ ...formData, distributorName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  placeholder="e.g. Agarwal FMCG Distributors Pvt Ltd"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trade / Billing Name</label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  placeholder="e.g. Agarwal Agency & Supply Hub"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                    placeholder="+91 9811002233"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                    placeholder="admin@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Warehouse / Head Office Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  placeholder="Plot 42, Okhla Industrial Area Phase-III"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State / Code</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tax & Statutory Compliance */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Tax &amp; Statutory Licenses</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN (Goods &amp; Services Tax)</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full text-xs font-mono uppercase px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  placeholder="07AAACA1234A1Z5"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Carried onto all B2B Tax Invoices &amp; e-Way bills.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">FSSAI License No.</label>
                <input
                  type="text"
                  value={formData.fssaiNumber}
                  onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                  className="w-full text-xs font-mono px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  placeholder="10019011004421"
                />
                <p className="text-[10px] text-slate-400 mt-1">Food safety registration for FMCG distribution.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                  className="w-full text-xs font-mono uppercase px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50"
                  placeholder="AAACA1234A"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-50/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-800">Auto e-Invoice IRN</span>
                    <p className="text-[10px] text-slate-500">Generate QR &amp; IRN via NIC upon invoice creation</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoIrnGeneration}
                    onChange={(e) => setFormData({ ...formData, autoIrnGeneration: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-50/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-800">WhatsApp Alert Dispatch</span>
                    <p className="text-[10px] text-slate-500">Auto-send invoice PDF &amp; payment link to retailers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.whatsappAlerts}
                    onChange={(e) => setFormData({ ...formData, whatsappAlerts: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 3. Financial Controls & Credit Risk */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Lock className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Financial &amp; Credit Controls</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Credit Days Allowed</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formData.maxCreditDays}
                    onChange={(e) => setFormData({ ...formData, maxCreditDays: parseInt(e.target.value, 10) || 0 })}
                    className="w-24 text-xs px-3 py-2 border rounded-lg focus:outline-teal-500 bg-slate-50/50 text-center font-bold"
                  />
                  <span className="text-xs text-slate-600 font-medium">days from invoice date</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Retailers exceeding this limit trigger billing freeze.</p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border bg-rose-50/40 border-rose-100 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Credit Hard Stop</span>
                    <p className="text-[10px] text-slate-500">Block bill generation if retailer crosses credit limit</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.creditHardStop}
                    onChange={(e) => setFormData({ ...formData, creditHardStop: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-50/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Van Settlement Lock</span>
                    <p className="text-[10px] text-slate-500">Prevent van dispatch until previous trip cash settled</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.vanReconciliationLock}
                    onChange={(e) => setFormData({ ...formData, vanReconciliationLock: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-50/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900">DMS Auto-Sync Service</span>
                    <p className="text-[10px] text-slate-500">Continuous background sync with FMCG principal portals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.dmsAutoSync}
                    onChange={(e) => setFormData({ ...formData, dmsAutoSync: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg flex items-start gap-2 text-amber-800 text-[11px] mt-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Maker-Checker Enforced:</strong> Changes to statutory tax keys and credit limits are logged with admin timestamp in the PostgreSQL audit trail.
                </span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </ERPLayout>
  );
}
