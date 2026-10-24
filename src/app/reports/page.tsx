'use client';

import React, { useState, useEffect } from 'react';
import ERPLayout from '@/components/layout/ERPLayout';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { SkeletonTable } from '@/components/common/Skeleton';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  RefreshCw,
  Loader2,
  FileText,
  FileDown
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ReportsPage() {
  const [kpis, setKpis] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const { token } = useAuth();

  const standardReports = [
    { title: 'Daily Sales Register (DSR)', type: 'dsr', desc: 'All sales orders with outlet & salesman break-up' },
    { title: 'Beat & Zero-Billed Outlets', type: 'zero-billed', desc: 'Coverage audit of non-ordering stores' },
    { title: 'Godown Stock Valuation Ledger', type: 'stock-ledger', desc: 'Real-time inventory cases and SKU rates' },
    { title: 'Scheme Claims Audit Register', type: 'claims', desc: 'Submitted principal trade scheme claims' },
    { title: 'Salesman Commission Statement', type: 'incentives', desc: 'Productive calls and earned incentives' },
    { title: 'Retailer Receivables Ageing', type: 'ageing', desc: 'Outstanding dues and credit days tracking' },
  ];

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/reports/kpis`, {
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });

      if (!res.ok) throw new Error('Failed to load KPIs');
      const data = await res.json();
      if (data.success && data.data) {
        setKpis(data.data.kpis || []);
        setSummary(data.data.summary || null);
      }
    } catch (err: any) {
      console.error(err);
      showNotification({
        title: 'Error Loading Reports',
        message: err.message || 'Could not load executive metrics.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, [token]);

  const handleDownload = async (type: string, title: string) => {
    try {
      setDownloadingType(type);
      const authToken = token || localStorage.getItem('fmcg_auth_token') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/reports/download?type=${type}`, {
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      });

      if (!res.ok) throw new Error('Failed to download report');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showNotification({
        title: 'Report Downloaded',
        message: `${title} exported successfully in Excel-ready CSV format.`,
        type: 'success'
      });
    } catch (err: any) {
      showNotification({
        title: 'Download Failed',
        message: err.message || 'Unable to download report.',
        type: 'error'
      });
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <ERPLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-teal-700 font-semibold uppercase tracking-wider">12 · Sales KPIs &amp; MIS Reports</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              The Numbers FMCG Companies &amp; Owners Judge You By
            </h1>
            <p className="text-xs text-slate-500">
              Live automated distributor scorecard calculated directly from billing, godown, collections, and field operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchKPIs}
              title="Refresh Live Metrics"
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={() => handleDownload('dsr', 'Full_MIS_Pack_DSR')}
              disabled={downloadingType === 'dsr'}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {downloadingType === 'dsr' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Export Full MIS Pack (CSV)</span>
            </button>
          </div>
        </div>

        {/* Live Executive Performance Table */}
        {loading && kpis.length === 0 ? (
          <SkeletonTable rows={7} cols={6} />
        ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                Live Distributor Scorecard &amp; Company DMS Compliance
              </h3>
            </div>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Live Database Linked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">KPI</th>
                  <th className="py-2.5 px-3">Measurement Logic</th>
                  <th className="py-2.5 px-2">Accountable</th>
                  <th className="py-2.5 px-3">Industry Benchmark</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Current Real Score</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kpis.map((k, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{k.kpi}</td>
                    <td className="py-3 px-3 text-slate-600">{k.definition}</td>
                    <td className="py-3 px-2 text-slate-700 font-medium">{k.owner}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{k.target}</td>
                    <td className="py-3 px-3 font-black text-slate-900">{k.current}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        k.status === 'Action Required' || k.status === 'Needs Push'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : k.status === 'Exceeded'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {kpis.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No performance metrics recorded yet.
            </div>
          )}
        </div>
        )}

        {/* Standard Reports Grid */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Standard Operational MIS Registers &amp; Audit Downloads
              </h3>
              <p className="text-[11px] text-slate-500">Instant CSV / Excel exports generated on-the-fly from live PostgreSQL records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {standardReports.map((r, idx) => (
              <div
                key={idx}
                onClick={() => handleDownload(r.type, r.title)}
                className="p-3 bg-slate-50 border border-slate-200 hover:border-teal-400 rounded-xl flex items-center justify-between text-xs cursor-pointer group transition-all hover:bg-teal-50/40"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-teal-900 block">{r.title}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{r.desc}</span>
                </div>
                <div className="p-1.5 bg-white group-hover:bg-teal-600 text-slate-500 group-hover:text-white rounded-lg border border-slate-200 group-hover:border-teal-600 transition-colors shrink-0 ml-3">
                  {downloadingType === r.type ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
