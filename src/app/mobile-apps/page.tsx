'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import {
  Smartphone,
  MapPin,
  CheckCircle2,
  Camera,
  Printer,
  ShoppingBag,
  Truck,
  TrendingUp,
  AlertTriangle,
  Clock,
  Phone,
  Navigation,
  Check,
  Star,
  RefreshCw,
  QrCode,
  IndianRupee
} from 'lucide-react';

type AppType = 'salesman_beat' | 'salesman_order' | 'salesman_merch' | 'van_spot' | 'retailer_home' | 'delivery_proof' | 'owner_pulse';

export default function MobileAppsSuite() {
  const { showNotification } = useNotification();
  const [activeApp, setActiveApp] = useState<AppType>('salesman_beat');
  const [checkedIn, setCheckedIn] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [auditSaved, setAuditSaved] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">09 &amp; 10 · Mobile Suite Simulator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Field Apps for Salesmen, Vans, Retailers, Delivery &amp; Owner
            </h1>
            <p className="text-xs text-slate-500">
              Offline-first field workflows built for 30 outlets a day, one hand, and patchy networks.
            </p>
          </div>
        </div>

        {/* Tab switcher for apps */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <button
            onClick={() => setActiveApp('salesman_beat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'salesman_beat' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            1. Salesman · Beat
          </button>
          <button
            onClick={() => setActiveApp('salesman_order')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'salesman_order' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            2. Salesman · Order (★ Must-Sell)
          </button>
          <button
            onClick={() => setActiveApp('salesman_merch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'salesman_merch' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            3. Salesman · Merchandising
          </button>
          <button
            onClick={() => setActiveApp('van_spot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'van_spot' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            4. Van · Spot Billing
          </button>
          <button
            onClick={() => setActiveApp('retailer_home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'retailer_home' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            5. Retailer B2B App
          </button>
          <button
            onClick={() => setActiveApp('delivery_proof')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'delivery_proof' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            6. Delivery &amp; POD
          </button>
          <button
            onClick={() => setActiveApp('owner_pulse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeApp === 'owner_pulse' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            7. Owner · Pulse
          </button>
        </div>

        {/* Simulator Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-4">
          {/* Phone Shell */}
          <div className="w-[340px] sm:w-[360px] h-[680px] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-12 ring-slate-800/80 relative flex flex-col shrink-0">
            {/* Top speaker & camera notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>

            {/* Screen inner content */}
            <div className="flex-1 bg-white rounded-[32px] overflow-hidden flex flex-col text-slate-800 text-xs relative select-none">
              {/* Top status bar */}
              <div className="h-6 px-4 pt-1 flex items-center justify-between text-[10px] font-bold text-slate-500 bg-slate-50">
                <span>09:41</span>
                <span>5G · 100%</span>
              </div>

              {/* 1. SALESMAN · BEAT */}
              {activeApp === 'salesman_beat' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Fri, 9 Oct · Beat: Gandhi Nagar</span>
                      <h2 className="text-base font-extrabold text-slate-900">Hi, Rakesh</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Visited</span>
                        <span className="font-bold text-slate-800">12/32</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Orders</span>
                        <span className="font-bold text-teal-700">₹21K</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">LPC</span>
                        <span className="font-bold text-slate-800">6.9</span>
                      </div>
                    </div>

                    <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] text-teal-800 font-bold uppercase">Next Outlet · 120 m</div>
                          <div className="font-extrabold text-slate-900 text-xs">Gupta Kirana Store</div>
                          <div className="text-[11px] text-slate-500">Avg order ₹6,800 · due ₹4,200</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setCheckedIn(!checkedIn)}
                          className={`flex-1 py-1.5 rounded-lg font-bold text-xs shadow-2xs ${
                            checkedIn ? 'bg-emerald-600 text-white' : 'bg-[#0d9488] text-white hover:bg-[#0f766e]'
                          }`}
                        >
                          {checkedIn ? 'Checked In ✓' : 'Check in'}
                        </button>
                        <button className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold">
                          Skip · reason
                        </button>
                      </div>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
                      <div className="font-bold text-amber-900 text-[11px] mb-1">Must-sell today:</div>
                      <div className="text-slate-700 text-xs">Tea 250 g · Noodles 4-pack · Floor cleaner</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Month target ₹6.5L</span>
                        <span className="font-bold text-slate-800">done 41%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: '41%' }} />
                      </div>
                      <div className="text-teal-700 font-semibold pt-1">
                        Incentive earned so far: ₹2,340
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                    <span className="text-teal-700">Beat</span>
                    <span>Order</span>
                    <span>Collect</span>
                    <span>Outlets</span>
                    <span>Me</span>
                  </div>
                </div>
              )}

              {/* 2. SALESMAN · ORDER */}
              {activeApp === 'salesman_order' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Order · Gupta Kirana</span>
                      <h2 className="text-sm font-extrabold text-slate-900">Suggested Order</h2>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            Tea 250 g <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          </div>
                          <div className="text-[10px] text-teal-700">₹108 · QPS 2% on ₹5K+</div>
                        </div>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 border rounded">2 cs</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">Biscuit ₹10</div>
                          <div className="text-[10px] text-teal-700">₹8.40 · 12+1 free</div>
                        </div>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 border rounded">1 cs</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center opacity-70">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            Noodles 4-pack <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          </div>
                          <div className="text-[10px] text-rose-600">Not bought in 30 days</div>
                        </div>
                        <span className="text-slate-400 font-mono">—</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">Soap 4-pack</div>
                          <div className="text-[10px] text-emerald-700">Free 75 g soap</div>
                        </div>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 border rounded">6 pc</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-900 text-[11px] font-semibold flex justify-between">
                      <span>₹6,871 · scheme saving ₹420</span>
                      <span className="text-emerald-700">Credit OK</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setOrderConfirmed(true)}
                      className="w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs shadow-md"
                    >
                      {orderConfirmed ? 'Order Confirmed & Synced ✓' : 'Confirm order'}
                    </button>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                      <span>Beat</span>
                      <span className="text-teal-700">Order</span>
                      <span>Collect</span>
                      <span>Outlets</span>
                      <span>Me</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SALESMAN · MERCHANDISING */}
              {activeApp === 'salesman_merch' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Visibility audit</span>
                      <h2 className="text-sm font-extrabold text-slate-900">Gupta Kirana · Company C cooler</h2>
                    </div>

                    <div className="h-28 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-1">
                      <Camera className="w-6 h-6 text-slate-400" />
                      <span className="text-[10px] font-medium">[ Photo of shelf / cooler ]</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded text-teal-600" />
                        <span>Cooler working · Only our brands inside</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-teal-600" />
                        <span>Planogram followed · Price strip visible</span>
                      </label>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                      <div className="font-semibold text-slate-700">Competitor activity:</div>
                      <div className="text-slate-500">New 5+1 offer on rival tea</div>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                      <div className="font-semibold text-slate-700">Stock at outlet (for suggested order):</div>
                      <div className="text-slate-500">Tea 250 g — 6 · Biscuits — 1 box</div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setAuditSaved(true)}
                      className="w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs shadow-md"
                    >
                      {auditSaved ? 'Saved · supports display claim ✓' : 'Save · supports display claim'}
                    </button>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                      <span>Beat</span>
                      <span>Order</span>
                      <span className="text-teal-700">Audit</span>
                      <span>Outlets</span>
                      <span>Me</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. VAN · SPOT BILLING */}
              {activeApp === 'van_spot' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Van 2 · Spot bill</span>
                      <h2 className="text-sm font-extrabold text-slate-900">Sharma Pan Bhandar · cash outlet</h2>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">Soft drink 600 ml</div>
                          <div className="text-[10px] text-slate-500">Van stock 112</div>
                        </div>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 border rounded">24</span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">Chips ₹10</div>
                          <div className="text-[10px] text-slate-500">Van stock 340</div>
                        </div>
                        <span className="font-bold text-slate-800 bg-white px-2 py-1 border rounded">40</span>
                      </div>

                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
                        <span className="font-semibold text-amber-900">Crates out / in</span>
                        <span className="font-bold text-amber-900">1 / 1</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex justify-between font-bold text-teal-900">
                      <span>Total ₹1,276</span>
                      <span>paid by UPI QR</span>
                    </div>

                    <div className="text-[11px] text-slate-500 text-center">
                      Today: cash ₹38,210 · UPI ₹19,600
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => showNotification({
                        title: 'Bluetooth Slip Printed',
                        message: 'Thermal spot invoice #VN-2099 printed with UPI dynamic QR code. Van stock ledger updated.',
                        type: 'success'
                      })}
                      className="w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print invoice (Bluetooth)
                    </button>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                      <span>Route</span>
                      <span className="text-teal-700">Bill</span>
                      <span>Van stock</span>
                      <span>Cash</span>
                      <span>Me</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. RETAILER B2B APP */}
              {activeApp === 'retailer_home' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Shree Ram General Store</span>
                      <h2 className="text-base font-extrabold text-slate-900">Order anytime</h2>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search 1,800 products…"
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg"
                      />
                    </div>

                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-2.5">
                      <div className="text-[10px] font-bold text-teal-800 uppercase">This week&apos;s offers</div>
                      <div className="text-xs text-slate-700 mt-0.5">Biscuits 12+1 · Tea 2% on ₹5K · Combo detergent</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                      <button className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-800">
                        Repeat last order
                      </button>
                      <button className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-800">
                        Browse by brand
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Order SO-61211</span>
                        <span>₹11,920</span>
                      </div>
                      <div className="text-[11px] text-teal-700 font-medium">Billed · delivery Sat AM</div>
                    </div>

                    <div className="flex justify-between text-xs p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500">Balance due</span>
                      <span className="font-bold text-rose-600">₹8,450</span>
                    </div>

                    <div className="flex justify-between text-xs p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500">Loyalty points</span>
                      <span className="font-bold text-slate-900">1,240</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                    <span className="text-teal-700">Home</span>
                    <span>Shop</span>
                    <span>Orders</span>
                    <span>Ledger</span>
                    <span>Profile</span>
                  </div>
                </div>
              )}

              {/* 6. DELIVERY & POD */}
              {activeApp === 'delivery_proof' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Trip R4 · 26 drops</span>
                      <h2 className="text-sm font-extrabold text-slate-900">Tata Ace · 11 delivered · ₹14,800 collected</h2>
                    </div>

                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 space-y-2">
                      <div className="text-[10px] text-teal-800 font-bold uppercase">Next: Gupta Kirana Store</div>
                      <div className="text-xs font-semibold text-slate-800">2 cases + 12 pcs · ₹6,871</div>
                      <div className="flex gap-2 pt-1">
                        <button className="flex-1 py-1 bg-slate-800 text-white rounded text-xs font-bold">
                          Navigate
                        </button>
                        <button className="flex-1 py-1 bg-slate-200 text-slate-800 rounded text-xs font-bold">
                          Call
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-700">Proof: ☑ OTP · ☑ photo</div>
                      <div className="text-[11px] text-slate-500">Partial? reason: damaged / refused / short</div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="font-semibold text-slate-800 mb-1">Collect: ₹4,200 old + ₹6,871 today</div>
                      <div className="flex gap-1">
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-[10px] font-bold">UPI</span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold">Cash</span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold">Cheque</span>
                      </div>
                    </div>

                    <div className="p-2 bg-amber-50 rounded-lg text-amber-900 text-[11px] font-medium">
                      Pick up: 1 damage bag · 2 crates
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setDeliveryConfirmed(true)}
                      className="w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold text-xs shadow-md"
                    >
                      {deliveryConfirmed ? 'Delivery & POD Verified ✓' : 'Confirm Drop & OTP'}
                    </button>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                      <span className="text-teal-700">Trip</span>
                      <span>Drops</span>
                      <span>Cash</span>
                      <span>Returns</span>
                      <span>Me</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. OWNER · PULSE */}
              {activeApp === 'owner_pulse' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 overflow-y-auto">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Today · all companies</span>
                      <h2 className="text-sm font-extrabold text-slate-900">Owner Pulse Snapshot</h2>
                    </div>

                    <div className="bg-[#0c1926] text-white p-3 rounded-xl space-y-1">
                      <div className="text-[10px] text-slate-400">Sales booked</div>
                      <div className="text-xl font-black text-teal-400 flex items-baseline gap-1">
                        ₹22.8L <span className="text-xs text-emerald-400 font-bold">▲ 9%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Collected</span>
                        <span className="font-bold text-slate-900">₹8.6L</span>
                      </div>
                      <div className="p-2 bg-slate-50 border rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Bank</span>
                        <span className="font-bold text-slate-900">₹48.2L</span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-50 border rounded-lg text-xs font-semibold text-slate-700">
                      Salesmen in field: <strong className="text-teal-700">14 / 15</strong> · vans out: <strong className="text-teal-700">3 / 3</strong>
                    </div>

                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                      <div className="font-bold">Alert · Van 2 short ₹1,240 yesterday</div>
                      <div className="font-bold">Alert · Company B claim window closes in 6 days</div>
                    </div>

                    <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 font-semibold">
                      Approve: 2 credit overrides · 1 expense
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-around text-[10px] font-semibold text-slate-400">
                    <span className="text-teal-700">Pulse</span>
                    <span>Sales</span>
                    <span>Money</span>
                    <span>Approve</span>
                    <span>Me</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Architectural context matching Page 11 & 12 notes */}
          <div className="max-w-md space-y-4 text-xs">
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                About the Field Mobile Applications
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Field teams operate in low network environments with heavy sunlight and rapid multi-drop beats.
              </p>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li><strong>Salesman App:</strong> GPS check-in, suggested orders from beat history, must-sell SKUs, WhatsApp receipt generation.</li>
                <li><strong>Van-sales App:</strong> Mobile warehouse stock ledger, Bluetooth 80mm thermal billing, crate/jar tracking, cash settlement.</li>
                <li><strong>Retailer B2B App:</strong> 24x7 self ordering, credit balance ledger, order tracking, WhatsApp notifications.</li>
                <li><strong>Delivery App:</strong> Route-sequenced drops, OTP &amp; photo delivery proof, damage return capture.</li>
                <li><strong>Owner Pulse:</strong> Real-time sales, collections, cash shortage alerts, and credit overrides on mobile.</li>
              </ul>
            </div>

            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 text-teal-950 space-y-1.5">
              <div className="font-bold text-xs uppercase tracking-wider text-teal-900">Offline-First Delta Sync</div>
              <p className="text-teal-800 text-xs leading-relaxed">
                Local SQLite snapshot holds active beat SKUs, prices, customer limits, and schemes. Orders sync in seconds upon LTE connection; the backend re-validates stock &amp; credit before final IRN billing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
