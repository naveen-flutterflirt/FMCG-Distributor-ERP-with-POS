'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import InwardScanModal from '@/components/common/InwardScanModal';
import { SkeletonCard, SkeletonTable } from '@/components/common/Skeleton';
import {
  AlertTriangle,
  Clock,
  Search,
  ScanLine,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Filter
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GodownStockPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [stockLevelFilter, setStockLevelFilter] = useState('All');
  const [focusFilter, setFocusFilter] = useState('All');

  const [skus, setSkus] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);
  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  const fetchGodownData = async () => {
    if (authLoading) return;
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (companyFilter !== 'All') params.append('companyId', companyFilter);
      if (stockLevelFilter !== 'All') params.append('status', stockLevelFilter);
      if (focusFilter === 'must_sell') params.append('mustSell', 'true');

      const [inventoryRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/godown/inventory?${params.toString()}`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        }),
        fetch(`${API_BASE}/godown/stats`, {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          }
        })
      ]);

      const inventoryData = await inventoryRes.json();
      const statsData = await statsRes.json();

      if (inventoryData.success) {
        setSkus(inventoryData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err: any) {
      showNotification({
        title: 'Error loading inventory',
        message: err.message || 'Failed to sync with warehouse database',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, [token, authLoading, searchTerm, companyFilter, stockLevelFilter, focusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCompanyFilter('All');
    setStockLevelFilter('All');
    setFocusFilter('All');
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">03 &amp; 16 · Godown &amp; Warehouse Inventory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Stock Ledger, Batches &amp; Expiry Monitor
            </h1>
            <p className="text-xs text-slate-500">
              Real-time FIFO batch allocations, godown stock covers &amp; live Neon DB inventory balance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchGodownData}
              title="Refresh inventory"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsInwardModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <ScanLine className="w-4 h-4" />
              <span>Inward GRN by Scan</span>
            </button>
          </div>
        </div>

        {/* 3 Top Stock Alerts Dynamic from Backend */}
        {loading && !stats ? (
          <SkeletonCard count={3} className="grid-cols-1 md:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div 
              onClick={() => setStockLevelFilter(stockLevelFilter === 'low_stock' ? 'All' : 'low_stock')}
              className={`bg-white border rounded-xl p-4 shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
                stockLevelFilter === 'low_stock' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-rose-200/80 hover:border-rose-300'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                  SKUs below 5 days cover
                </span>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  {stats ? `${stats.lowCoverCount} SKUs` : '...'}
                </div>
                <span className="text-[11px] text-slate-500">
                  {stockLevelFilter === 'low_stock' ? 'Filtered: Low stock only' : 'Click to filter low stock (<100 cs)'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                  Near expiry (60 d)
                </span>
                <div className="text-2xl font-black text-amber-700 mt-1">
                  {stats ? `₹${(stats.nearExpiryValue / 100000).toFixed(1)}L` : '...'}
                </div>
                <span className="text-[11px] text-slate-500">Push via retail schemes / clearance</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Stock Valuation
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {stats ? `₹${(stats.totalStockValue / 100000).toFixed(2)}L` : '...'}
                </div>
                <span className="text-[11px] text-slate-500">
                  {stats ? `${stats.totalCases} cases across ${stats.totalSkus} SKUs` : 'Live DB valuation'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Multi-Filters & Search Bar for Godown */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU name, code, barcode..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Company filter */}
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Companies</option>
              <option value="comp-a">Company A · Personal Care</option>
              <option value="comp-b">Company B · Foods</option>
              <option value="comp-c">Company C · Beverages</option>
              <option value="comp-d">Company D · Home Care</option>
            </select>

            {/* Stock Level filter */}
            <select
              value={stockLevelFilter}
              onChange={(e) => setStockLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="low_stock">Low Stock (&lt; 100 cs)</option>
              <option value="healthy">Healthy Stock (&gt;= 100 cs)</option>
            </select>

            {/* Focus status filter */}
            <select
              value={focusFilter}
              onChange={(e) => setFocusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Focus Types</option>
              <option value="must_sell">★ Must-Sell SKUs Only</option>
            </select>

            {(searchTerm || companyFilter !== 'All' || stockLevelFilter !== 'All' || focusFilter !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="px-2 py-1 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Stock Inventory Table connected to DB */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Live Warehouse Stock Register (Neon PostgreSQL)
            </h3>
            <span className="text-xs text-slate-600">
              Matching SKUs: <strong className="text-slate-900">{skus.length} items</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading && skus.length === 0 ? (
              <div className="p-3">
                <SkeletonTable rows={6} cols={8} />
              </div>
            ) : skus.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No inventory items match the selected search &amp; filter criteria.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">SKU &amp; Code</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-2 text-right">MRP</th>
                    <th className="py-2.5 px-2 text-right">Distributor Rate</th>
                    <th className="py-2.5 px-3 text-right">Godown Cases</th>
                    <th className="py-2.5 px-2 text-right">Loose Pcs</th>
                    <th className="py-2.5 px-2 text-center">GST %</th>
                    <th className="py-2.5 px-3 text-center">Status / Batches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {skus.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Code: {s.code} • Barcode: {s.barcode || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{s.company}</td>
                      <td className="py-3 px-2 text-right text-slate-800 font-semibold">₹{s.mrp}</td>
                      <td className="py-3 px-2 text-right text-slate-900 font-bold">₹{Number(s.rate).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">
                        <span className={s.stockCases < 100 ? 'text-rose-600 font-extrabold' : ''}>
                          {s.stockCases} cs
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-slate-600">{s.stockPcs} pcs</td>
                      <td className="py-3 px-2 text-center text-slate-600 font-medium">{s.gstPercent}%</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {s.stockCases < 100 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Low Cover
                            </span>
                          )}
                          {s.batches && s.batches.length > 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                              {s.batches.length} Batch{s.batches.length > 1 ? 'es' : ''} ({s.batches[0].batchNumber})
                            </span>
                          ) : s.mustSell ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              ★ Must-Sell
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Regular</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Inward GRN Scan Modal */}
      <InwardScanModal
        isOpen={isInwardModalOpen}
        onClose={() => setIsInwardModalOpen(false)}
        onSuccess={fetchGodownData}
      />
    </ERPLayout>
  );
}
