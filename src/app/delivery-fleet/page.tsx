'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { SkeletonTable } from '@/components/common/Skeleton';
import {
  Navigation,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  RefreshCw,
  Loader2,
  Package
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DeliveryFleetPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { token } = useAuth();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/delivery/trips`, {
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });

      if (!res.ok) throw new Error('Failed to fetch delivery trips');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTrips(data.data);
      }
    } catch (err: any) {
      console.error(err);
      showNotification({
        title: 'Error Loading Fleet',
        message: err.message || 'Could not fetch delivery fleet trips.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 10 · Delivery &amp; Fleet Operations</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Trip Dispatch &amp; Proof of Delivery (POD)
            </h1>
            <p className="text-xs text-slate-500">
              Vehicle capacity utilization, OTP-verified drop settlements, and live route load sheets populated from evening billing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTrips}
              title="Refresh Fleet Trips"
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={() => showNotification({
                title: 'Dispatch Manifest Generated',
                message: 'Route-sequenced vehicle load sheets and dispatch manifests have been prepared for Godown picking.',
                type: 'success'
              })}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Dispatch Trip</span>
            </button>
          </div>
        </div>

        {/* Trips Table */}
        {loading && trips.length === 0 ? (
          <SkeletonTable rows={5} cols={8} />
        ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                Active Delivery Trips &amp; Route Load Sheets
              </h3>
            </div>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {trips.length} Vehicles Dispatched (Live)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Trip ID</th>
                  <th className="py-2.5 px-3">Vehicle &amp; Reg</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Assigned Route</th>
                  <th className="py-2.5 px-3 text-center">Drops Progress</th>
                  <th className="py-2.5 px-3 text-right">Trip Value</th>
                  <th className="py-2.5 px-3 text-right">Cash Collected</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{t.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{t.vehicle}</td>
                    <td className="py-3 px-3 text-slate-700">{t.driver}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      <div>{t.route}</div>
                      {t.ordersList && t.ordersList.length > 0 && (
                        <span className="text-[10px] text-teal-700 font-semibold block">
                          +{t.ordersList.length} Billed Order{t.ordersList.length > 1 ? 's' : ''} Loaded
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-teal-700">{t.dropsCompleted}</span> / {t.dropsTotal} drops
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{Number(t.value || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700">
                      ₹{Number(t.collected || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'In Transit'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {trips.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No delivery trips scheduled.
            </div>
          )}
        </div>
        )}
      </div>
    </ERPLayout>
  );
}
