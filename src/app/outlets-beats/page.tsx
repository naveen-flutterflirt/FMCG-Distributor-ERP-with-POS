'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  Store,
  MapPin,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Phone,
  CreditCard,
  Building2,
  ArrowRight
} from 'lucide-react';
import { MOCK_OUTLETS, Outlet } from '@/data/mockData';

export default function OutletsBeatsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [outlets, setOutlets] = useState<Outlet[]>(MOCK_OUTLETS);
  const { showNotification } = useNotification();

  const filtered = outlets.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'All' || o.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 14 · Outlets &amp; Beat Master</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Retail Outlets &amp; Beat Sequencing
            </h1>
            <p className="text-xs text-slate-500">
              Manage 3,180 active retail stores, geotagged beats, credit terms, and GSTIN registration.
            </p>
          </div>

          <button
            onClick={() => showNotification({
              title: 'Outlet Onboarding Active',
              message: 'GPS Geotagging enabled. Enter GSTIN for automatic trade name, address and tax filing verification.',
              type: 'info'
            })}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Outlet</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search outlet, owner, route..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Channels</option>
              <option value="General Trade">General Trade (Kirana)</option>
              <option value="Modern Trade">Modern Trade</option>
              <option value="HoReCa">HoReCa</option>
              <option value="Wholesale">Wholesale</option>
            </select>
          </div>
        </div>

        {/* Outlets Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Outlet Name</th>
                  <th className="py-2.5 px-3">Proprietor</th>
                  <th className="py-2.5 px-3">Route / Beat</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3 text-right">Credit Limit</th>
                  <th className="py-2.5 px-3 text-right">Outstanding</th>
                  <th className="py-2.5 px-2 text-center">Overdue Days</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{o.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {o.gstin ? `GST: ${o.gstin}` : 'Unregistered (B2C)'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div>{o.ownerName}</div>
                      <div className="text-[10px] text-slate-500">{o.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{o.route}</span>
                      <span className="block text-[10px] text-teal-700">{o.beatId}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {o.channel}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800">
                      ₹{o.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹{o.currentBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`font-semibold ${o.overdueDays > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {o.overdueDays > 0 ? `${o.overdueDays} d` : '0 d'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                          o.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {o.status === 'active' ? 'Active' : 'Credit Hold'}
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
