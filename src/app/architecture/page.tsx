'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import {
  Layers,
  Database,
  Server,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Code,
  ArrowRight
} from 'lucide-react';

export default function SystemArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'layers' | 'data_model' | 'workflows' | 'roadmap'>('modules');

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">FlutterFlirt · Blueprint Explorer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              FMCG Distributor ERP — Architecture &amp; Data Model
            </h1>
            <p className="text-xs text-slate-500">
              Interactive blueprint specification covering 17 modules, 12 user roles, cloud services, and 16-week MVP delivery roadmap.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'modules' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            17 ERP Modules
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'layers' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            System Architecture (Page 15)
          </button>
          <button
            onClick={() => setActiveTab('data_model')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'data_model' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Model Entities (Page 16)
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workflows' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Core Workflows (Page 13)
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmap' ? 'bg-[#0f766e] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Delivery Roadmap (Page 19)
          </button>
        </div>

        {/* TAB 1: 17 ERP MODULES IN FOUR GROUPS matching Page 3 */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Sell */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">Group 1</span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">Sell</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Outlet &amp; beat master</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Sales orders &amp; billing</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Van sales</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Modern-trade orders</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Point of sale (POS)</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Retailer app &amp; B2B</li>
              </ul>
            </div>

            {/* 2. Buy & stock */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">Group 2</span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">Buy &amp; stock</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Purchase from companies</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Godown &amp; stock</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Returns, damage &amp; expiry</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Delivery &amp; fleet</li>
              </ul>
            </div>

            {/* 3. Trade & claims */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">Group 3</span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">Trade &amp; claims</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Scheme engine</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Company claims</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Merchandising &amp; visibility</li>
              </ul>
            </div>

            {/* 4. Run the business */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full">Group 4</span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">Run the business</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Finance &amp; accounts</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Credit &amp; collections</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Field HR &amp; incentives</li>
                <li className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold">Analytics &amp; MIS</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM ARCHITECTURE LAYERS matching Page 15 */}
        {activeTab === 'layers' && (
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Cloud ERP with Offline-First Field Apps</h3>

            <div className="space-y-3 text-xs">
              {/* Channels */}
              <div className="p-3 bg-slate-900 text-white rounded-xl">
                <span className="font-bold text-teal-400 uppercase text-[10px] tracking-wider block mb-2">CHANNELS</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center text-[11px]">
                  <span className="bg-slate-800 p-2 rounded">ERP web (Next.js)</span>
                  <span className="bg-slate-800 p-2 rounded">Salesman app (Offline)</span>
                  <span className="bg-slate-800 p-2 rounded">Van-sales app (BT printer)</span>
                  <span className="bg-slate-800 p-2 rounded">POS terminal (PWA offline)</span>
                  <span className="bg-slate-800 p-2 rounded">Retailer app + Kirana POS</span>
                  <span className="bg-slate-800 p-2 rounded">Owner Pulse / WhatsApp</span>
                </div>
              </div>

              {/* Edge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-2">EDGE &amp; GATEWAY</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <span className="bg-white p-2 border rounded font-medium">CDN + WAF</span>
                  <span className="bg-white p-2 border rounded font-medium">API Gateway</span>
                  <span className="bg-white p-2 border rounded font-medium">BFF (Web / Field)</span>
                  <span className="bg-white p-2 border rounded font-medium">Sync Service (Delta)</span>
                  <span className="bg-white p-2 border rounded font-medium">Identity &amp; Auth</span>
                </div>
              </div>

              {/* ERP Services */}
              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl">
                <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wider block mb-2">ERP CORE DOMAIN SERVICES</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center font-semibold text-slate-800">
                  <span className="bg-white p-2 border rounded shadow-2xs">Product &amp; Price</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Outlet &amp; Beat</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Order &amp; Billing</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Van Sales</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">POS &amp; Shifts</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Scheme Engine</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Inventory</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Purchase</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Delivery &amp; Fleet</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Claims</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">Receivables &amp; Credit</span>
                  <span className="bg-white p-2 border rounded shadow-2xs">General Ledger</span>
                </div>
              </div>

              {/* Data & Platform */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1.5">DATA INFRASTRUCTURE</span>
                  <p className="text-slate-700">PostgreSQL (tenant-isolated) · Object Storage (Photos, PODs) · ClickHouse Warehouse + PITR Backups</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block mb-1.5">INTEGRATION HUB</span>
                  <p className="text-slate-700">Company DMS/SFA · GST e-Invoice &amp; e-Way Bill · Banks &amp; UPI · Tally XML · WhatsApp Cloud API</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATA MODEL ENTITIES matching Page 16 */}
        {activeTab === 'data_model' && (
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Core Entities and How They Connect</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Company &amp; brand</h4>
                <p className="text-slate-600 font-mono text-[11px]">company · brands[] · dms_code · terms · claim_rules</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">SKU</h4>
                <p className="text-slate-600 font-mono text-[11px]">id · company_id · brand · uom(case/inner/pc) · hsn · gst · shelf_life</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Stock ledger</h4>
                <p className="text-slate-600 font-mono text-[11px]">sku · mrp/batch · location(godown/van) · txn · qty · cost · ref</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Scheme</h4>
                <p className="text-slate-600 font-mono text-[11px]">company · type · rule · funded_by · budget · valid · outlet_filter</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Outlet</h4>
                <p className="text-slate-600 font-mono text-[11px]">id · name · class · channel · gstin · geo · photo · beat_id · credit_limit</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Sales order &amp; invoice</h4>
                <p className="text-slate-600 font-mono text-[11px]">outlet · source · lines[sku, qty, rate, scheme, tax] · irn · ewb</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Van trip &amp; POS shift</h4>
                <p className="text-slate-600 font-mono text-[11px]">van/counter · user · date · load[] · unload[] · float · cash · variance</p>
              </div>

              <div className="p-3 border rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Journal entry</h4>
                <p className="text-slate-600 font-mono text-[11px]">date · source_doc · lines[account, dr, cr, cost_centre]</p>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 text-xs leading-relaxed">
              <strong>Core Relationship Rules:</strong> Company 1→* SKU; Scheme applies to SKUs, outlets and invoice lines · Beat 1→* Outlet; Visit → Order → Invoice → Delivery / Van trip · Every business document posts balanced journal entries automatically; Invoices locked after IRN.
            </div>
          </div>
        )}

        {/* TAB 4: WORKFLOWS matching Page 13 */}
        {activeTab === 'workflows' && (
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Pre-sell Order-to-Cash (General Trade)</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">01 · Day 1</span>
                <span className="font-bold text-slate-900">Beat visit</span>
                <span className="text-[10px] text-slate-500 block mt-1">Check-in, audit, order</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">02 · Day 1</span>
                <span className="font-bold text-slate-900">Sync</span>
                <span className="text-[10px] text-slate-500 block mt-1">Orders reach billing desk</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">03 · Evening</span>
                <span className="font-bold text-slate-900">Bulk bill</span>
                <span className="text-[10px] text-slate-500 block mt-1">Schemes, credit, IRN</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">04 · Evening</span>
                <span className="font-bold text-slate-900">Load sheet</span>
                <span className="text-[10px] text-slate-500 block mt-1">SKU-wise picking</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">05 · Day 2</span>
                <span className="font-bold text-slate-900">Deliver</span>
                <span className="text-[10px] text-slate-500 block mt-1">Route trip, proof</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">06 · Day 2</span>
                <span className="font-bold text-slate-900">Collect</span>
                <span className="text-[10px] text-slate-500 block mt-1">Cash / UPI at door</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">07 · Day 2</span>
                <span className="font-bold text-slate-900">Settle</span>
                <span className="text-[10px] text-slate-500 block mt-1">Cash &amp; returns count</span>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="font-bold text-teal-700 block text-[10px]">08 · Auto</span>
                <span className="font-bold text-slate-900">Post &amp; sync</span>
                <span className="text-[10px] text-slate-500 block mt-1">Ledger, GST, DMS</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ROADMAP matching Page 19 */}
        {activeTab === 'roadmap' && (
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Billing and Field Apps Live in 16 Weeks</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <div className="font-bold text-slate-900">Phase 0 · 2 weeks</div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside">
                  <li>Godown &amp; billing walk-through</li>
                  <li>SKU, price &amp; outlet clean-up</li>
                  <li>Beat mapping &amp; geotags</li>
                  <li>Opening balances &amp; stock</li>
                </ul>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <div className="font-bold text-teal-900">Phase 1 · MVP (Wk 3–16)</div>
                <ul className="text-teal-800 space-y-1 list-disc list-inside">
                  <li>Masters, price lists, schemes</li>
                  <li>Orders, bulk billing, e-invoice</li>
                  <li>Purchase, GRN, godown stock</li>
                  <li>Salesman app (offline)</li>
                  <li>Receivables &amp; credit control</li>
                  <li>General ledger, GST, bank recon</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <div className="font-bold text-slate-900">Phase 2 · +12 weeks</div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside">
                  <li>Van-sales app &amp; settlement</li>
                  <li>Counter POS &amp; shifts</li>
                  <li>Delivery app &amp; fleet</li>
                  <li>Claims management</li>
                  <li>Retailer app &amp; WhatsApp</li>
                  <li>Market returns &amp; damage</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <div className="font-bold text-slate-900">Phase 3 · +12 weeks</div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside">
                  <li>Company DMS adapters</li>
                  <li>Modern-trade PO / ASN / GRN</li>
                  <li>Suggested orders (ML)</li>
                  <li>Route optimisation</li>
                  <li>Kirana POS for retailers</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </ERPLayout>
  );
}
