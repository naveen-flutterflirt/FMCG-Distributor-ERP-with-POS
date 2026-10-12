'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  Navigation,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function DeliveryFleetPage() {
  const { showNotification } = useNotification();
  const trips = [
    { id: 'TRIP-R4-101', vehicle: 'Tata Ace · DL 1L AA 2210', driver: 'Manoj Kumar', route: 'R4 Gandhi Nagar', dropsTotal: 26, dropsCompleted: 11, value: 148000, collected: 86400, status: 'In Transit' },
    { id: 'TRIP-R2-102', vehicle: 'Mahindra Bolero · DL 1L BB 3390', driver: 'Satish Pal', route: 'R2 Station Road', dropsTotal: 31, dropsCompleted: 24, value: 196000, collected: 142000, status: 'In Transit' },
    { id: 'TRIP-R1-103', vehicle: 'Tata Ace · DL 1L CC 7781', driver: 'Raju Yadav', route: 'R1 Civil Lines', dropsTotal: 18, dropsCompleted: 18, value: 112000, collected: 112000, status: 'Settled & Completed' },
  ];

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
              Vehicle capacity utilization, OTP-verified drop settlements, and cash &amp; crate recovery.
            </p>
          </div>

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

        {/* Trips Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Today&apos;s Active Delivery Trips
            </h3>
            <span className="text-xs text-teal-700 font-semibold">
              3 Vehicles Dispatched
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
                    <td className="py-3 px-3 text-slate-600 font-medium">{t.route}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-teal-700">{t.dropsCompleted}</span> / {t.dropsTotal} drops
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">₹{t.value.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700">₹{t.collected.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
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
        </div>
      </div>
    </ERPLayout>
  );
}
