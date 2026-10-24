'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import NewPOModal from '@/components/common/NewPOModal';
import { SkeletonTable } from '@/components/common/Skeleton';
import {
  ShoppingCart,
  Plus,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Search,
  Filter,
  PackageOpen,
  ArrowRight,
  Truck
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PurchasePage() {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [skus, setSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [receivingId, setReceivingId] = useState<string | null>(null);

  const { showNotification } = useNotification();
  const { token } = useAuth();

  const fetchPOsAndSkus = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (selectedCompany !== 'All') queryParams.append('companyId', selectedCompany);

      const [poRes, skuRes] = await Promise.all([
        fetch(`${API_BASE}/purchase?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/skus`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const poData = await poRes.json();
      const skuData = await skuRes.json();

      if (poData.success) {
        setPurchaseOrders(poData.data);
      }
      if (skuData.success) {
        setSkus(skuData.data);
      }
    } catch (err: any) {
      showNotification({
        title: 'Error loading purchase orders',
        message: err.message || 'Failed to connect to backend',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOsAndSkus();
  }, [token, statusFilter, selectedCompany, searchTerm]);

  // Handle dynamic GRN Inward Receipt
  const handleReceiveGRN = async (po: any) => {
    if (!token) return;
    setReceivingId(po.id);
    try {
      // Build items to inward based on PO items or default
      const inwardItems = po.items && po.items.length > 0 
        ? po.items.map((it: any) => ({
            skuId: it.skuId,
            casesReceived: it.casesOrdered || 50,
            pcsReceived: 0,
            batchNumber: `BAT-${po.id}-${Math.floor(100 + Math.random() * 900)}`
          }))
        : [{ skuId: 'sku-1', casesReceived: 50, pcsReceived: 0, batchNumber: `BAT-${po.id}-01` }];

      const res = await fetch(`${API_BASE}/purchase/${po.id}/grn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          grnStatus: 'GRN Received & Stock Inwarded',
          receivedItems: inwardItems
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification({
          title: 'GRN Inward Completed!',
          message: `${po.id} marked as received. Stock cases have been added to your Godown database.`,
          type: 'success'
        });
        fetchPOsAndSkus();
      } else {
        throw new Error(data.message || 'Failed to inward GRN');
      }
    } catch (err: any) {
      showNotification({
        title: 'GRN Inward Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setReceivingId(null);
    }
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">02 &amp; 13 · Primary Purchase &amp; GRN</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Purchase from FMCG Companies
            </h1>
            <p className="text-xs text-slate-500">
              Live primary PO placement, company e-invoice verification, and dynamic GRN inventory inward.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchPOsAndSkus}
              title="Refresh POs"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsNewPOOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Primary PO</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search PO #, Company, Dispatch ref..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Companies</option>
              <option value="comp-a">Company A · Personal Care</option>
              <option value="comp-b">Company B · Foods</option>
              <option value="comp-c">Company C · Beverages</option>
              <option value="comp-d">Company D · Home Care</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Received & Verified">Received &amp; Verified</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* POs list connected to backend */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Primary Inward Registers &amp; In-Transit Goods (Neon PostgreSQL)
            </h3>
            <span className="text-[11px] text-teal-700 font-semibold">
              {purchaseOrders.length} Orders Live
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading && purchaseOrders.length === 0 ? (
              <div className="p-2">
                <SkeletonTable rows={6} cols={9} />
              </div>
            ) : purchaseOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No purchase orders found matching your search.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3">PO Number</th>
                    <th className="py-2.5 px-3">Company (Principal)</th>
                    <th className="py-2.5 px-3">PO Date</th>
                    <th className="py-2.5 px-2 text-center">SKU Lines</th>
                    <th className="py-2.5 px-3 text-right">PO Value</th>
                    <th className="py-2.5 px-3">Dispatch Ref</th>
                    <th className="py-2.5 px-3 text-center">GRN Status</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{po.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{po.company}</td>
                      <td className="py-3 px-3 text-slate-600">{po.date}</td>
                      <td className="py-3 px-2 text-center font-medium text-slate-700">{po.itemsCount}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">₹{Number(po.totalAmount).toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{po.dispatchRef || 'N/A'}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[11px] font-semibold text-slate-700">{po.grnStatus}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                          po.status === 'In Transit'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {po.status === 'In Transit' ? (
                          <button
                            onClick={() => handleReceiveGRN(po)}
                            disabled={receivingId === po.id}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 mx-auto"
                          >
                            {receivingId === po.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Inwarding...</span>
                              </>
                            ) : (
                              <>
                                <PackageOpen className="w-3 h-3" />
                                <span>Receive GRN</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-emerald-600 flex items-center justify-center gap-1 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Inwarded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Create PO Modal */}
      <NewPOModal
        isOpen={isNewPOOpen}
        onClose={() => setIsNewPOOpen(false)}
        onSuccess={fetchPOsAndSkus}
        skus={skus}
      />
    </ERPLayout>
  );
}
