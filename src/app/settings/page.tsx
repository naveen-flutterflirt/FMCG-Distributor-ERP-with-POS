'use client';

import React, { useState } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import {
  Settings,
  ShieldCheck,
  Building2,
  Lock,
  Server,
  FileCheck2,
  Key,
  Users,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [syncedDMS, setSyncedDMS] = useState(false);

  const handleSyncDMS = () => {
    setSyncedDMS(true);
    setTimeout(() => setSyncedDMS(false), 3000);
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">15 &amp; 16 · System Settings &amp; Compliance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              ERP Integrations, GST &amp; Multi-Company Config
            </h1>
            <p className="text-xs text-slate-500">
              Clean books, clean tax, no cash leakage — segregation of duties, company DMS sync, and statutory keys.
            </p>
          </div>

          <button
            onClick={handleSyncDMS}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncedDMS ? 'animate-spin' : ''}`} />
            <span>{syncedDMS ? 'Syncing Secondary Sales to DMS...' : 'Force Sync All Company DMS'}</span>
          </button>
        </div>

        {/* 3 Panels matching Page 18: Tax & statutory, Financial controls, Security & data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">Tax &amp; Statutory</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><strong>GST:</strong> HSN-wise rates, B2B/B2C, automated e-invoice IRN &amp; e-way bill above threshold.</li>
              <li><strong>Returns:</strong> GSTR-1 data &amp; GSTR-3B summary with automated GSTR-2B input credit match.</li>
              <li><strong>TDS / TCS:</strong> Applied automatically on purchases and sales over statutory limit.</li>
              <li><strong>Legal Metrology &amp; FSSAI:</strong> Licences carried onto customer invoice PDFs automatically.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Financial Controls</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><strong>Segregation of duties:</strong> Billing, cash receipt, credit override and accounts are separate roles.</li>
              <li><strong>Credit block:</strong> Automatic stop if credit limit or overdue-days are crossed.</li>
              <li><strong>Maker-Checker:</strong> Price and scheme modifications require director sign-off.</li>
              <li><strong>Van reconciliation:</strong> Van cannot reload until last trip is settled.</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">Security &amp; Data</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><strong>Multi-Tenancy:</strong> Complete data isolation by distributor, godown, and route.</li>
              <li><strong>Field App Binding:</strong> Salesman devices bound by IMEI/UUID with remote data wipe.</li>
              <li><strong>India Residency:</strong> Encryption in transit (TLS 1.3) and AES-256 at rest with daily PITR.</li>
              <li><strong>Audit-ready:</strong> Full drill-down from general ledger balances to source invoices.</li>
            </ul>
          </div>
        </div>

        {/* Integration Hub Status matching Page 15 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm mb-3">
            Integration Hub &amp; API Connectors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Company DMS / SFA</span>
                <span className="text-emerald-600">Connected</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">HUL, ITC, Marico, Nestle secondary push</p>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between font-bold text-slate-800">
                <span>GST Portal / NIC</span>
                <span className="text-emerald-600">Active</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Live e-Invoice IRN &amp; e-Way Bill generation</p>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Bank &amp; Dynamic UPI</span>
                <span className="text-emerald-600">Synced</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">ICICI / HDFC statement auto-reconciliation</p>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between font-bold text-slate-800">
                <span>WhatsApp Cloud API</span>
                <span className="text-emerald-600">Operational</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Invoice PDFs, payment QR &amp; ledger alerts</p>
            </div>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
