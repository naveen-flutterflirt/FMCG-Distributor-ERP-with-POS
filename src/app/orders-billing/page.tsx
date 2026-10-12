'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
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
  Receipt
} from 'lucide-react';
import { MOCK_ORDERS, SalesOrder } from '@/data/mockData';

export default function OrderBillingDesk() {
  const [orders, setOrders] = useState<SalesOrder[]>(MOCK_ORDERS);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(['SO-61208', 'SO-61211', 'SO-61219']);
  const [activePreviewId, setActivePreviewId] = useState<string>('SO-61208');
  const [routeFilter, setRouteFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [isBilling, setIsBilling] = useState(false);
  const [billedSuccess, setBilledSuccess] = useState(false);

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

  const handleBulkBilling = () => {
    setIsBilling(true);
    setTimeout(() => {
      setIsBilling(false);
      setBilledSuccess(true);
      setTimeout(() => setBilledSuccess(false), 4000);
    }, 1200);
  };

  const previewOrder = orders.find(o => o.id === activePreviewId) || orders[0];

  const filteredOrders = orders.filter(o => {
    if (routeFilter !== 'All' && !o.route.includes(routeFilter)) return false;
    return true;
  });

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header matching Page 5 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">04 · Web — Order & Billing Desk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Tomorrow&apos;s orders billed tonight, loaded by route
            </h1>
            <p className="text-xs text-slate-500">
              Pre-sell orders arrive from salesman and retailer apps all day; billing runs in bulk by route, with schemes, credit and stock checked automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                <option value="MT route">MT route</option>
              </select>
            </div>

            {/* Company filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs">
              <span className="text-slate-500 font-medium">Company:</span>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 border-none focus:outline-hidden cursor-pointer"
              >
                <option value="All">All companies</option>
                <option value="Company A">Company A (Personal Care)</option>
                <option value="Company B">Company B (Foods)</option>
                <option value="Company C">Company C (Beverages)</option>
                <option value="Company D">Company D (Home Care)</option>
              </select>
            </div>

            {/* Bulk bill button matching Page 5 */}
            <button
              onClick={handleBulkBilling}
              disabled={selectedOrderIds.length === 0 || isBilling}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-1.5 ${
                selectedOrderIds.length > 0 && !isBilling
                  ? 'bg-[#0f766e] hover:bg-[#115e59] cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              {isBilling ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing IRN & Bills...</span>
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
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>{selectedOrderIds.length} Invoices Generated & Digitally Signed!</strong>
                <p className="text-[11px] text-emerald-700">e-Invoice IRNs generated, load sheets created per delivery van, WhatsApp notifications queued.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.print()} className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[11px] font-semibold flex items-center gap-1">
                <Printer className="w-3 h-3" /> Print Invoices
              </button>
            </div>
          </div>
        )}

        {/* Pending Orders Table matching Page 5 */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                Pending orders · 386
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-500 font-medium">delivery date Sat 10 Oct</span>
            </div>
            <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
              {selectedOrderIds.length} orders queued for load
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.length === orders.length}
                      onChange={toggleSelectAll}
                      className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                  </th>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Outlet</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-2 text-center">Lines</th>
                  <th className="py-2.5 px-3 text-right">Value</th>
                  <th className="py-2.5 px-3 text-right">Scheme</th>
                  <th className="py-2.5 px-3 text-center">Checks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isChecked = selectedOrderIds.includes(order.id);
                  const isCurrentPreview = activePreviewId === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setActivePreviewId(order.id)}
                      className={`cursor-pointer transition-colors ${
                        isCurrentPreview ? 'bg-teal-50/40 ring-1 ring-teal-500/30' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(order.id)}
                          className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                        {order.id}
                        {isCurrentPreview && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {order.outletName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {order.route}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {order.source} {order.salesmanName && `· ${order.salesmanName}`}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-700 font-medium">
                        {order.linesCount}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        ₹{order.totalValue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                        {order.schemeTotal > 0 ? `₹${order.schemeTotal.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            order.checkStatus === 'OK'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.checkStatus === 'Credit hold'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : order.checkStatus === 'Short 3 SKUs'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {order.checkStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Preview & Dual Info Cards matching Page 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Invoice Preview Table (Col 6) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Invoice preview · {previewOrder.outletName}
                </h3>
                <p className="text-[11px] text-slate-500">Order ID: {previewOrder.id} • Route: {previewOrder.route}</p>
              </div>
              <button
                onClick={() => window.print()}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 border border-teal-200 px-2 py-1 rounded-md bg-teal-50"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                    <th className="pb-2 font-semibold">SKU</th>
                    <th className="pb-2 font-semibold">Qty</th>
                    <th className="pb-2 font-semibold text-right">Rate</th>
                    <th className="pb-2 font-semibold">Scheme</th>
                    <th className="pb-2 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewOrder.lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 font-medium text-slate-800">
                        {line.skuName}
                        {line.freeGoodsDesc && (
                          <span className="block text-[10px] text-emerald-700 font-semibold">
                            +{line.freeGoodsDesc}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-slate-700">
                        {line.qtyCases > 0 ? `${line.qtyCases} cs` : ''} {line.qtyPcs > 0 ? `${line.qtyPcs} pc` : ''}
                      </td>
                      <td className="py-2 text-right text-slate-700">
                        {line.rate.toFixed(2)}
                      </td>
                      <td className="py-2 text-slate-600">
                        {line.schemeDesc || '—'}
                      </td>
                      <td className="py-2 text-right font-bold text-slate-900">
                        ₹{line.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Case / inner / piece UoM · MRP-wise batch · rates by outlet class</span>
              <span className="font-bold text-slate-800 text-xs">Total: ₹{previewOrder.totalValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Right Top: Billing checks run (Col 3) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-3">
              Billing checks run
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Credit limit & overdue days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Stock by MRP / batch, FIFO</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Scheme eligibility & slabs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>Price list by outlet class</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>GSTIN → B2B, else B2C</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>e-invoice IRN & e-way bill</span>
              </li>
            </ul>
          </div>

          {/* Right Bottom: After billing (Col 3) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-3">
              After billing
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>Load sheet per vehicle (SKU-wise, cases)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>Route-sorted invoice print</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>Delivery trips created</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>Order SMS / WhatsApp to retailer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>Short items back-ordered</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
