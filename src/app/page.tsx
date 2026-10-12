'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ERPLayout from '@/components/layout/ERPLayout';
import NewOrderModal from '@/components/common/NewOrderModal';

export default function OwnerDashboard() {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  return (
    <ERPLayout>
      <div className="space-y-4 max-w-[1400px] mx-auto">
        {/* Top Header matching exact screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Good morning, Mr. Agarwal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Friday, 9 Oct · All companies · Month to date
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* Search input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search outlet, SKU, invoice..."
              className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 flex-1 sm:w-56 md:w-64 focus:outline-hidden focus:border-teal-600 shadow-2xs min-w-[140px]"
            />

            {/* Company: All ▾ */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              aria-label="Filter by Company"
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden shadow-2xs cursor-pointer shrink-0"
            >
              <option value="All">Company: All ▾</option>
              <option value="CompA">Company A · Personal Care</option>
              <option value="CompB">Company B · Foods</option>
              <option value="CompC">Company C · Beverages</option>
              <option value="CompD">Company D · Home Care</option>
            </select>

            {/* + New order button */}
            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="bg-[#006d77] hover:bg-[#005a63] text-white px-3.5 py-1.5 rounded-md text-xs font-bold shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
            >
              + New order
            </button>
          </div>
        </div>

        {/* 6 Metric Cards matching exact screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Secondary sales MTD
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ₹1.94Cr
            </div>
            <div className="text-[11px] text-[#008080] font-medium mt-1">
              68% of target · day 9 of 26
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Outlets billed (UBO)
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              2,412
            </div>
            <div className="text-[11px] text-red-500 font-medium mt-1">
              of 3,180 active
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Lines per call
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              6.4
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              ▲ 0.5 vs last month
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Gross margin
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              9.6%
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              incl. claimable schemes
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Retailer outstanding
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ₹62.4L
            </div>
            <div className="text-[11px] text-red-500 font-medium mt-1">
              ₹9.8L over 21 days
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium block">
              Claims pending
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ₹17.6L
            </div>
            <div className="text-[11px] text-red-500 font-medium mt-1">
              ₹5.2L older than 60 d
            </div>
          </div>
        </div>

        {/* Middle Row: 3 Panels matching exact screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Target vs achievement by company */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                Target vs achievement by company
              </h3>

              <div className="space-y-3 text-xs">
                {/* Company A */}
                <div>
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Company A · personal care</span>
                    <span className="font-bold">72%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#004d40] rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                {/* Company B */}
                <div>
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Company B · foods</span>
                    <span className="font-bold">81%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#004d40] rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>

                {/* Company C */}
                <div>
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Company C · beverages</span>
                    <span className="font-bold">54%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#c65126] rounded-full" style={{ width: '54%' }} />
                  </div>
                </div>

                {/* Company D */}
                <div>
                  <div className="flex justify-between font-medium text-slate-800 mb-1">
                    <span>Company D · home care</span>
                    <span className="font-bold">63%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#004d40] rounded-full" style={{ width: '63%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Expected by day 9: 35% (linear) — all on track except Company C
            </div>
          </div>

          {/* Channel mix — MTD */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                Channel mix — MTD
              </h3>

              {/* Stacked bar matching screenshot */}
              <div className="h-3.5 w-full bg-slate-100 rounded-md overflow-hidden flex mb-4">
                <div style={{ width: '58%' }} className="bg-[#004d40]" />
                <div style={{ width: '16%' }} className="bg-[#00897b]" />
                <div style={{ width: '14%' }} className="bg-[#80cbc4]" />
                <div style={{ width: '8%' }} className="bg-[#d87d36]" />
                <div style={{ width: '4%' }} className="bg-[#e0b080]" />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#004d40]" /> General trade · pre-sell 58%
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#00897b]" /> Van sales 16%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#80cbc4]" /> Modern trade 14%
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#d87d36]" /> Wholesale 8%
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#e0b080]" /> HoReCa / institutions 4%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday's van settlement */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                Yesterday&apos;s van settlement
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                      <th className="pb-1.5 font-normal">Van</th>
                      <th className="pb-1.5 font-normal text-right">Sales</th>
                      <th className="pb-1.5 font-normal text-right">Cash due</th>
                      <th className="pb-1.5 font-normal text-right">Diff.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 text-slate-800">Van 1 · Suresh</td>
                      <td className="py-2 text-right font-medium text-slate-900">₹1.42L</td>
                      <td className="py-2 text-right text-slate-700">₹86,400</td>
                      <td className="py-2 text-right">
                        <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          ₹0
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-800">Van 2 · Imran</td>
                      <td className="py-2 text-right font-medium text-slate-900">₹1.18L</td>
                      <td className="py-2 text-right text-slate-700">₹71,250</td>
                      <td className="py-2 text-right">
                        <span className="bg-[#ffedd5] text-[#c2410c] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          −₹1,240
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-slate-800">Van 3 · Deepak</td>
                      <td className="py-2 text-right font-medium text-slate-900">₹0.96L</td>
                      <td className="py-2 text-right text-slate-700">₹58,900</td>
                      <td className="py-2 text-right">
                        <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          ₹0
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Shortage recovered from salesman by default; owner can waive
            </div>
          </div>
        </div>

        {/* Bottom Row: Scorecard & Stock Alerts & Collection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Salesman scorecard — today (Takes 2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Salesman scorecard — today
              </h3>
              <Link href="/field-team" className="text-xs font-semibold text-[#006d77] hover:underline">
                All salesmen →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 text-[11px]">
                    <th className="pb-2 font-normal">Salesman</th>
                    <th className="pb-2 font-normal">Beat</th>
                    <th className="pb-2 font-normal text-center">Visited</th>
                    <th className="pb-2 font-normal text-center">Productive</th>
                    <th className="pb-2 font-normal text-center">LPC</th>
                    <th className="pb-2 font-normal text-right">Sales</th>
                    <th className="pb-2 font-normal text-center">Must-sell</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 text-slate-800 font-medium">Rakesh</td>
                    <td className="py-2 text-slate-600">Gandhi Nagar</td>
                    <td className="py-2 text-center font-bold text-slate-800">28/32</td>
                    <td className="py-2 text-center text-slate-800 font-medium">22</td>
                    <td className="py-2 text-center font-bold text-slate-800">7.1</td>
                    <td className="py-2 text-right font-medium text-slate-900">₹48,600</td>
                    <td className="py-2 text-center">
                      <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        5/5
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-medium">Anil</td>
                    <td className="py-2 text-slate-600">Station Road</td>
                    <td className="py-2 text-center font-bold text-slate-800">31/35</td>
                    <td className="py-2 text-center text-slate-800 font-medium">19</td>
                    <td className="py-2 text-center font-bold text-slate-800">5.2</td>
                    <td className="py-2 text-right font-medium text-slate-900">₹36,900</td>
                    <td className="py-2 text-center">
                      <span className="bg-[#fef3c7] text-[#b45309] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        3/5
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-medium">Farhan</td>
                    <td className="py-2 text-slate-600">Old Market</td>
                    <td className="py-2 text-center font-bold text-slate-800">18/30</td>
                    <td className="py-2 text-center text-slate-800 font-medium">11</td>
                    <td className="py-2 text-center font-bold text-slate-800">4.6</td>
                    <td className="py-2 text-right font-medium text-slate-900">₹21,400</td>
                    <td className="py-2 text-center">
                      <span className="bg-[#fef3c7] text-[#b45309] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        2/5
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-medium">Manoj</td>
                    <td className="py-2 text-slate-600">Civil Lines</td>
                    <td className="py-2 text-center font-bold text-slate-800">26/28</td>
                    <td className="py-2 text-center text-slate-800 font-medium">21</td>
                    <td className="py-2 text-center font-bold text-slate-800">6.8</td>
                    <td className="py-2 text-right font-medium text-slate-900">₹44,100</td>
                    <td className="py-2 text-center">
                      <span className="bg-[#dcfce7] text-[#15803d] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        5/5
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right 1 Column: Stock alerts + Collected yesterday card */}
          <div className="space-y-3">
            {/* Stock alerts matching screenshot */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm mb-2.5">
                Stock alerts
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">SKUs below 5 days cover</span>
                  <span className="font-bold text-red-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Near expiry (60 d)</span>
                  <span className="font-bold text-slate-900">₹2.9L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Damaged stock awaiting claim</span>
                  <span className="font-bold text-slate-900">₹1.4L</span>
                </div>
              </div>
            </div>

            {/* Collected yesterday banner matching screenshot */}
            <div className="bg-[#0c1926] rounded-xl text-white p-4 shadow-md flex items-center justify-between">
              <div className="text-3xl font-extrabold tracking-tight">
                ₹8.6L
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-200">
                  Collected yesterday
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  UPI 48% · cash 37% · cheque 15%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
      />
    </ERPLayout>
  );
}
