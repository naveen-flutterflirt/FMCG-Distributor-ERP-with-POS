'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { SkeletonTable } from '@/components/common/Skeleton';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Truck,
  Printer,
  ShieldCheck,
  Send,
  Download,
  Filter,
  Check,
  Building2,
  Calendar,
  AlertTriangle,
  Receipt,
  RefreshCw,
  Loader2
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OrderBillingDesk() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activePreviewId, setActivePreviewId] = useState<string>('');
  const [routeFilter, setRouteFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [isBilling, setIsBilling] = useState(false);
  const [billedSuccess, setBilledSuccess] = useState(false);
  const { showNotification } = useNotification();
  const { token, loading: authLoading } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token') : null);
      if (!authToken) {
        // Wait for auth to initialize
        return;
      }

      const params = new URLSearchParams();
      if (routeFilter !== 'All') params.append('route', routeFilter);

      const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired, don't crash, prompt re-login
          console.warn('Authentication token expired or missing');
          return;
        }
        throw new Error('Failed to fetch orders from server');
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        if (data.data.length > 0) {
          setActivePreviewId(prev => prev || data.data[0].id);
          setSelectedOrderIds(prev => prev.length > 0 ? prev : data.data.slice(0, 3).map((o: any) => o.id));
        } else {
          setActivePreviewId('');
          setSelectedOrderIds([]);
        }
      }
    } catch (err: any) {
      console.error('fetchOrders error:', err);
      showNotification({
        title: 'Error Loading Orders',
        message: err.message || 'Could not fetch sales orders from database.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [token, authLoading, routeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map(o => o.id));
    }
  };

  const handleBulkBilling = async () => {
    try {
      setIsBilling(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/delivery/dispatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          route: routeFilter === 'All' ? 'R4 Gandhi Nagar' : routeFilter,
          orderIds: selectedOrderIds
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Billing dispatch failed');
      }

      setBilledSuccess(true);
      showNotification({
        title: 'IRN & Invoices Generated',
        message: `Successfully billed ${selectedOrderIds.length} orders into delivery load sheet.`,
        type: 'success'
      });
      fetchOrders();
      setTimeout(() => setBilledSuccess(false), 4000);
    } catch (err: any) {
      showNotification({
        title: 'Billing Failed',
        message: err.message,
        type: 'error'
      });
    } finally {
      setIsBilling(false);
    }
  };

  const previewOrder = orders.find(o => o.id === activePreviewId) || orders[0] || null;

  const filteredOrders = orders.filter(o => {
    if (routeFilter !== 'All' && !o.route?.includes(routeFilter)) return false;
    return true;
  });

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header matching Page 5 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">04 · Web — Order &amp; Billing Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Tomorrow&apos;s orders billed tonight, loaded by route
            </h1>
            <p className="text-xs text-slate-500">
              Pre-sell orders arrive from salesman and retailer apps; billing runs in bulk by route with live PostgreSQL stock &amp; credit checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchOrders}
              title="Refresh Orders"
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>

            {/* Route filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
              <span className="text-slate-500 font-medium">Route:</span>
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 border-none focus:outline-hidden cursor-pointer"
              >
                <option value="All">All routes</option>
                <option value="Gandhi Nagar">R4 Gandhi Nagar</option>
                <option value="Station Rd">R2 Station Rd</option>
                <option value="Civil Lines">R1 Civil Lines</option>
                <option value="Old Market">R3 Old Market</option>
                <option value="Industrial Area">R6 Industrial Area</option>
                <option value="MT route">MT route</option>
              </select>
            </div>

            {/* Bulk bill button */}
            <button
              onClick={handleBulkBilling}
              disabled={selectedOrderIds.length === 0 || isBilling}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-1.5 ${selectedOrderIds.length > 0 && !isBilling
                  ? 'bg-[#0f766e] hover:bg-[#115e59] cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed opacity-70'
                }`}
            >
              {isBilling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing IRN &amp; Bills...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>Bulk bill selected ({selectedOrderIds.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {billedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Bulk billing completed:</strong> Invoices generated, IRN stamped, and warehouse load-sheet ready for morning vans.
              </span>
            </div>
            <span className="font-bold text-emerald-800">Delivery Route Loaded ✓</span>
          </div>
        )}

        {/* Main Grid: Orders List (Left) + Invoice Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Orders Table */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden flex flex-col">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                  onChange={toggleSelectAll}
                  className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className="font-bold text-slate-800">
                  Pending Orders ({filteredOrders.length})
                </span>
              </div>

            </div>

            <div className="overflow-x-auto flex-1">
              {loading && orders.length === 0 ? (
                <div className="p-3">
                  <SkeletonTable rows={6} cols={5} />
                </div>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 w-8"></th>
                      <th className="py-2.5 px-3">Order / Outlet</th>
                      <th className="py-2.5 px-3">Route &amp; Rep</th>
                      <th className="py-2.5 px-3 text-right">Value</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => {
                    const isSelected = selectedOrderIds.includes(o.id);
                    const isActive = activePreviewId === o.id;

                    return (
                      <tr
                        key={o.id}
                        onClick={() => setActivePreviewId(o.id)}
                        className={`cursor-pointer transition-colors ${isActive ? 'bg-teal-50/50 font-medium' : 'hover:bg-slate-50/70'
                          }`}
                      >
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(o.id)}
                            className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{o.id}</div>
                          <div className="text-[11px] text-slate-600 truncate max-w-[160px]">
                            {o.outletName || o.outlet_name}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          <div>{o.route}</div>
                          <div className="text-[10px] text-slate-400">
                            {o.salesmanName || o.salesman_name || 'Counter'}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-900">
                          ₹{Number(o.totalValue || o.total_value || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${o.checkStatus === 'Credit hold' || o.status === 'Hold'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                            {o.checkStatus || o.status || 'OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              )}

              {filteredOrders.length === 0 && !loading && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No sales orders found for this route.
                </div>
              )}
            </div>
          </div>

          {/* Invoice Preview Panel (Right) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-4">
            {previewOrder ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      Tax Invoice Preview
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {previewOrder.id}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${previewOrder.checkStatus === 'Credit hold'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                    {previewOrder.checkStatus || 'Billed'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer / Retailer:</span>
                    <strong className="text-slate-900">{previewOrder.outletName || previewOrder.outlet_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Route:</span>
                    <strong className="text-slate-900">{previewOrder.route}</strong>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold text-[10px] border-b border-slate-100">
                        <th className="p-2">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        let linesList = previewOrder.lines;
                        if (typeof linesList === 'string') {
                          try { linesList = JSON.parse(linesList); } catch(e) { linesList = []; }
                        }
                        if (Array.isArray(linesList) && linesList.length > 0) {
                          return linesList.map((l: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2 font-medium text-slate-800">
                                <div className="font-semibold text-slate-900">{l.skuName || l.sku_name || 'FMCG SKU Item'}</div>
                                {l.schemeDesc && (
                                  <span className="text-[10px] text-teal-700 font-bold block">{l.schemeDesc}</span>
                                )}
                              </td>
                              <td className="p-2 text-center text-slate-700 font-medium">
                                {l.qtyCases || l.qty_cases || 0}c {l.qtyPcs || l.qty_pcs ? `${l.qtyPcs || l.qty_pcs}p` : ''}
                              </td>
                              <td className="p-2 text-right text-slate-700 font-mono">
                                ₹{Number(l.rate || 0).toFixed(2)}
                              </td>
                              <td className="p-2 text-right font-bold text-slate-900 font-mono">
                                ₹{Number(l.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ));
                        }
                        return (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-slate-400 text-xs">
                              Standard FMCG order line items
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{Number(previewOrder.totalValue || previewOrder.total_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-sm bg-slate-50 p-2 rounded-lg">
                    <span>Total Invoice Amount</span>
                    <span className="text-teal-800">
                      ₹{Number(previewOrder.totalValue || previewOrder.total_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Select an order from the list to preview invoice.
              </div>
            )}
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
