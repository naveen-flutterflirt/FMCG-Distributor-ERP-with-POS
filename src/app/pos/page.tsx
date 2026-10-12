'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import {
  Barcode,
  Search,
  User,
  CreditCard,
  QrCode,
  DollarSign,
  Printer,
  X,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Receipt
} from 'lucide-react';
import { MOCK_SKUS, SKU } from '@/data/mockData';

interface POSItem {
  id: string;
  name: string;
  mrp: number;
  uom: string;
  qty: number;
  rate: number;
  scheme: string;
  gstPercent: number;
  amount: number;
  unitsPerPack: number;
}

const INITIAL_CART: POSItem[] = [
  { id: '1', name: 'Tea 250 g', mrp: 130, uom: 'Case (24)', qty: 1, rate: 2592.00, scheme: 'QPS 2%', gstPercent: 5, amount: 2540.16, unitsPerPack: 24 },
  { id: '2', name: 'Biscuit ₹10 pack', mrp: 10, uom: 'Case (60)', qty: 2, rate: 504.00, scheme: '12+1 → +10 free', gstPercent: 18, amount: 1008.00, unitsPerPack: 60 },
  { id: '3', name: 'Detergent 1 kg', mrp: 110, uom: 'Piece', qty: 12, rate: 96.50, scheme: '—', gstPercent: 18, amount: 1158.00, unitsPerPack: 1 },
  { id: '4', name: 'Soap 4-pack', mrp: 140, uom: 'Piece', qty: 6, rate: 118.00, scheme: 'Free 75 g soap ×6', gstPercent: 18, amount: 708.00, unitsPerPack: 1 },
  { id: '5', name: 'Cooking oil 1 L pouch', mrp: 165, uom: 'Piece', qty: 10, rate: 142.00, scheme: '—', gstPercent: 5, amount: 1420.00, unitsPerPack: 1 },
  { id: '6', name: 'Atta 5 kg', mrp: 265, uom: 'Piece', qty: 4, rate: 228.00, scheme: '—', gstPercent: 0, amount: 912.00, unitsPerPack: 1 },
];

export default function POSCounter() {
  const { showNotification } = useNotification();
  const [cart, setCart] = useState<POSItem[]>(INITIAL_CART);
  const [searchBarcode, setSearchBarcode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'Cash' | 'UPI' | 'Card' | 'Credit' | 'Cheque' | 'Wallet'>('Cash');
  const [cashTendered, setCashTendered] = useState('3000');
  const [upiReceived, setUpiReceived] = useState('5000');
  const [selectedCustomer, setSelectedCustomer] = useState('Shree Ram General');
  const [customerCredit, setCustomerCredit] = useState(14200);
  const [billNumber, setBillNumber] = useState('C1-20931');
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [saleCompleteModal, setSaleCompleteModal] = useState(false);
  const [kiranaModalOpen, setKiranaModalOpen] = useState(false);

  // Calculations matching Page 9
  const totalAmount = 7746;
  const taxableValue = 7119.17;
  const totalGst = 626.99;
  const schemeSavings = 51.84;
  const roundOff = -0.16;

  const totalTendered = (Number(cashTendered) || 0) + (Number(upiReceived) || 0);
  const changeToReturn = Math.max(0, totalTendered - totalAmount);

  // Handle barcode search & add
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBarcode.trim()) return;

    const matched = MOCK_SKUS.find(s =>
      s.barcode === searchBarcode.trim() ||
      s.name.toLowerCase().includes(searchBarcode.toLowerCase())
    );

    if (matched) {
      const existingIdx = cart.findIndex(c => c.name === matched.name);
      if (existingIdx >= 0) {
        const updated = [...cart];
        updated[existingIdx].qty += 1;
        updated[existingIdx].amount = updated[existingIdx].qty * updated[existingIdx].rate;
        setCart(updated);
      } else {
        setCart([
          ...cart,
          {
            id: String(cart.length + 1),
            name: matched.name,
            mrp: matched.mrp,
            uom: matched.uom,
            qty: 1,
            rate: matched.rate,
            scheme: '—',
            gstPercent: matched.gstPercent,
            amount: matched.rate,
            unitsPerPack: matched.unitsPerCase
          }
        ]);
      }
      setSearchBarcode('');
    } else {
      showNotification({
        title: 'SKU Not Found',
        message: `No product found for "${searchBarcode}". Try scanning "890103001" or searching "Tea" or "Biscuit".`,
        type: 'warning'
      });
    }
  };

  // Numpad key input
  const handleNumpad = (digit: string) => {
    if (digit === 'DEL') {
      setCashTendered(prev => prev.slice(0, -1) || '0');
    } else {
      setCashTendered(prev => (prev === '0' ? digit : prev + digit));
    }
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setSaleCompleteModal(true);
      } else if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('pos-barcode-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c1926] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Header matching Page 9 exact header */}
      <header className="min-h-14 py-2 bg-[#0a1520] border-b border-[#1b2c40] px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#16273b] hover:bg-[#1d334e] text-teal-300 font-semibold transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ERP Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm tracking-wider">
              [Distributor] POS
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 font-medium hidden sm:inline">Counter 1 · Main godown</span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-teal-400 font-medium hidden md:inline">Cashier: Priya</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
          <button
            onClick={() => setShiftModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#16273b] hover:bg-[#1d334e] text-slate-300 text-xs border border-slate-700/50 cursor-pointer shrink-0"
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Shift #418 · opened 09:02 · float ₹5,000</span>
            <span className="sm:hidden">Shift #418</span>
          </button>

          <button
            onClick={() => setKiranaModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/80 text-teal-300 border border-teal-700/60 hover:bg-teal-900 cursor-pointer text-xs shrink-0"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:inline">Retailer Kirana POS</span>
            <span className="sm:hidden">Kirana POS</span>
          </button>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>

          <span className="font-mono font-bold text-slate-200 shrink-0">Bill #{billNumber}</span>
          <span className="text-slate-400 hidden lg:inline">Fri 9 Oct · 11:42</span>
        </div>
      </header>

      {/* Main Workspace: Left Cart + Right Summary */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#0c1926]">
        {/* Left Section: Search, Table, Shortcuts */}
        <div className="flex-1 flex flex-col p-3 border-r border-[#192b3d] overflow-y-auto">
          {/* Barcode Search & Customer bar matching Page 9 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-3">
            {/* Scan barcode input */}
            <form onSubmit={handleBarcodeSubmit} className="md:col-span-7 relative">
              <input
                id="pos-barcode-input"
                type="text"
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                placeholder="▌ Scan barcode or type item name / code (F2)"
                className="w-full bg-[#142334] border border-teal-600/70 focus:border-teal-400 text-white placeholder-teal-200/50 text-xs px-3 py-2.5 rounded-lg focus:outline-hidden font-mono shadow-inner"
              />
              <Barcode className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-teal-400" />
            </form>

            {/* Customer input */}
            <div className="md:col-span-5 flex items-center justify-between bg-[#142334] border border-[#21374f] px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-400">Customer (F3):</span>
                <span className="font-bold text-white truncate">{selectedCustomer}</span>
              </div>
              <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded-full border border-teal-800/80 shrink-0 font-medium">
                Retailer · credit ₹{customerCredit.toLocaleString()} left
              </span>
            </div>
          </div>

          {/* Product Items Table matching Page 9 */}
          <div className="flex-1 bg-[#101e2e] border border-[#1d3147] rounded-xl overflow-hidden flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#142639] text-slate-400 font-semibold border-b border-[#213954] text-[11px]">
                    <th className="py-2.5 px-3 w-8 text-center">#</th>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-2 text-right">MRP</th>
                    <th className="py-2.5 px-2">UoM</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Rate</th>
                    <th className="py-2.5 px-3">Scheme</th>
                    <th className="py-2.5 px-2 text-center">GST</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172b40]">
                  {cart.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#15273b] transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{item.name}</td>
                      <td className="py-2.5 px-2 text-right text-slate-300">{item.mrp}</td>
                      <td className="py-2.5 px-2 text-slate-400">{item.uom}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="inline-block bg-[#1a334d] text-teal-300 font-bold px-2 py-0.5 rounded-sm border border-teal-600/30">
                          {item.qty}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-300 font-mono">
                        {item.rate.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-teal-400 font-medium">
                        {item.scheme}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-400">
                        {item.gstPercent}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white font-mono">
                        {item.amount.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                          title="Void Line"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary text in table */}
            <div className="p-2.5 bg-[#0e1a27] border-t border-[#1d3147] text-[11px] text-slate-400 flex items-center justify-between">
              <span>
                6 lines · 24 + 120 + 22 units · free goods added automatically · prices from &quot;Retailer&quot; price list
              </span>
              <span className="text-teal-400 font-mono font-bold">
                Total Units: 166 pcs
              </span>
            </div>
          </div>

          {/* POS Keyboard Shortcuts bar matching Page 9 */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-slate-300 font-medium">
              <strong className="text-teal-400 font-bold">F4</strong> Qty
            </span>
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-slate-300 font-medium">
              <strong className="text-teal-400 font-bold">F5</strong> Discount
            </span>
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-slate-300 font-medium">
              <strong className="text-teal-400 font-bold">F6</strong> Hold bill
            </span>
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-slate-300 font-medium">
              <strong className="text-teal-400 font-bold">F7</strong> Recall
            </span>
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-slate-300 font-medium">
              <strong className="text-teal-400 font-bold">F8</strong> Return
            </span>
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-rose-300 font-medium">
              <strong className="text-rose-400 font-bold">Del</strong> Void line
            </span>
            <span className="px-2.5 py-1 bg-[#142639] border border-[#213a55] rounded-md text-slate-300 font-medium">
              <strong className="text-teal-400 font-bold">Ctrl+P</strong> Reprint
            </span>
            <button
              onClick={() => setCart([])}
              className="ml-auto px-2.5 py-1 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-md hover:bg-rose-900 cursor-pointer text-[11px]"
            >
              Cancel bill
            </button>
          </div>
        </div>

        {/* Right Section: Bill Totals, Payments, Numpad, and Complete Sale Button */}
        <div className="w-full lg:w-96 bg-[#0f1d2b] p-3.5 flex flex-col justify-between border-t lg:border-t-0 border-[#1a2d42]">
          <div className="space-y-3">
            {/* Tax & Total breakdown matching Page 9 */}
            <div className="bg-[#142537] border border-[#223a54] rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Taxable value</span>
                <span className="font-mono text-slate-200">₹{taxableValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CGST + SGST</span>
                <span className="font-mono text-slate-200">₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Scheme savings</span>
                <span className="font-mono">₹{schemeSavings} + free goods</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Round off</span>
                <span className="font-mono text-slate-300">−₹0.16</span>
              </div>

              {/* Big bold total */}
              <div className="pt-2 border-t border-[#253e5b] flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-200">Total</span>
                <span className="text-3xl font-black text-teal-400 font-mono">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Modes Grid matching Page 9 */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Payment (split allowed)
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['Cash', 'UPI QR', 'Card', 'Credit', 'Cheque', 'Wallet / pts'] as const).map((mode) => {
                  const isSelected = selectedPayment === mode.replace(' QR', '').replace(' / pts', '');
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        const parsed = mode.replace(' QR', '').replace(' / pts', '') as 'Cash' | 'UPI' | 'Card' | 'Credit' | 'Cheque' | 'Wallet';
                        setSelectedPayment(parsed);
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f766e] text-white border-teal-400 shadow-xs'
                          : 'bg-[#142537] text-slate-300 border-[#223a54] hover:bg-[#1a2f45]'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tendered Inputs */}
            <div className="bg-[#142537] border border-[#223a54] rounded-xl p-2.5 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">UPI received</span>
                <span className="text-teal-400 font-bold">₹{Number(upiReceived).toFixed(2)} ✓</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Cash tendered</span>
                <input
                  type="text"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="w-24 text-right bg-[#0c1825] border border-teal-600/60 rounded px-1.5 py-0.5 text-white font-bold"
                />
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#223a54]">
                <span className="text-amber-300 font-sans font-medium">Change to return</span>
                <span className="text-amber-300 font-bold text-sm">₹{changeToReturn.toFixed(2)}</span>
              </div>
            </div>

            {/* POS Touch Numpad matching Page 9 */}
            <div className="grid grid-cols-3 gap-1.5 font-mono font-bold text-sm">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleNumpad(k === '⌫' ? 'DEL' : k)}
                  className="py-2.5 bg-[#17293d] hover:bg-[#1f3752] active:bg-teal-700 text-white rounded-lg border border-[#27425f] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button: Complete sale · print (F12) */}
          <div className="mt-3">
            <button
              onClick={() => setSaleCompleteModal(true)}
              className="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-teal-400/40"
            >
              <Printer className="w-4 h-4" />
              <span>Complete sale · print (F12)</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Prints GST invoice on 80 mm printer · opens cash drawer · WhatsApp copy to customer
            </p>
          </div>
        </div>
      </div>

      {/* Sale Complete Modal / Receipt print */}
      {saleCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-sm p-5 border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Sale Completed!</h3>
              <p className="text-xs text-slate-500 font-mono">Bill #{billNumber} • Amount: ₹{totalAmount.toLocaleString()}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-left space-y-1 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-sans font-semibold">{selectedCustomer}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid via:</span>
                <span>UPI ₹5,000 + Cash ₹2,746</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Change Returned:</span>
                <span>₹{changeToReturn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>e-Invoice IRN:</span>
                <span className="text-[10px] text-teal-700 truncate max-w-[150px]">83d99-1b1c-4038</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                  setSaleCompleteModal(false);
                }}
                className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print 80mm Slip
              </button>
              <button
                onClick={() => setSaleCompleteModal(false)}
                className="flex-1 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-lg"
              >
                Next Customer (F2)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shift & Z-Report Modal matching Page 10 */}
      {shiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-lg p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Shift Open, Close &amp; Z-report</h3>
                <p className="text-[11px] text-slate-500">Shift #418 · Counter 1 · Cashier: Priya</p>
              </div>
              <button onClick={() => setShiftModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3 text-right">System</th>
                    <th className="py-2 px-3 text-right">Counted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3">Opening float</td>
                    <td className="py-2 px-3 text-right font-medium">₹5,000</td>
                    <td className="py-2 px-3 text-right font-bold">₹5,000</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Cash sales (63 bills)</td>
                    <td className="py-2 px-3 text-right font-medium">₹84,320</td>
                    <td className="py-2 px-3 text-right">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Cash refunds (2)</td>
                    <td className="py-2 px-3 text-right text-rose-600 font-medium">−₹640</td>
                    <td className="py-2 px-3 text-right">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Dues collected — cash</td>
                    <td className="py-2 px-3 text-right font-medium">₹6,200</td>
                    <td className="py-2 px-3 text-right">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Paid out (petty, with voucher)</td>
                    <td className="py-2 px-3 text-right text-rose-600 font-medium">−₹350</td>
                    <td className="py-2 px-3 text-right">—</td>
                  </tr>
                  <tr className="bg-emerald-50/60 font-bold text-emerald-950">
                    <td className="py-2.5 px-3">Cash in drawer</td>
                    <td className="py-2.5 px-3 text-right">₹94,530</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-700">₹94,530 ✓</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">UPI / card / credit</td>
                    <td className="py-2 px-3 text-right font-medium">₹1,12,480</td>
                    <td className="py-2 px-3 text-right text-teal-700 font-semibold">auto-matched</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Blind cash count at close; difference needs supervisor sign-off. Z-report locks the shift and posts it to the general ledger.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShiftModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Keep Shift Open
              </button>
              <button
                onClick={() => {
                  showNotification({
                    title: 'Shift #418 Closed & Locked',
                    message: 'Z-Report generated and posted to Day Book. Total Cash Drawer ₹94,530 verified against system totals.',
                    type: 'success'
                  });
                  setShiftModalOpen(false);
                }}
                className="px-4 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-lg text-xs font-semibold"
              >
                Generate Z-Report &amp; Lock Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kirana POS Mobile add-on preview matching Page 10 */}
      {kiranaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 w-72 text-slate-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Smartphone className="w-4 h-4 text-teal-400" />
                <span>Kirana POS · Free Add-on</span>
              </div>
              <button onClick={() => setKiranaModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#142334] p-3 rounded-xl border border-teal-800/40 space-y-2 text-xs">
              <div className="text-[10px] text-slate-400 font-semibold">Shree Ram General</div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Biscuit ₹10 × 3</span>
                <span className="font-mono text-white">₹30</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Tea 250 g × 1</span>
                <span className="font-mono text-white">₹130</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>Soap 4-pack × 1</span>
                <span className="font-mono text-white">₹140</span>
              </div>
              <div className="pt-2 flex justify-between font-bold text-teal-300">
                <span>Total · UPI</span>
                <span className="font-mono text-sm">₹300</span>
              </div>
            </div>

            <div className="bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-xl text-[11px] space-y-1">
              <div className="font-bold text-amber-300">Running Low Alert:</div>
              <div className="text-slate-300">Tea 250 g · 3 left</div>
              <div className="text-slate-300">Biscuits · 1 box</div>
              <button
                onClick={() => showNotification({
                  title: 'Reorder Sent to Beat',
                  message: 'Low stock replenishment order dispatched directly to Salesman Rakesh on Beat R4 Gandhi Nagar.',
                  type: 'success'
                })}
                className="mt-2 w-full py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-md text-[11px] font-bold"
              >
                Reorder from distributor
              </button>
            </div>

            <div className="text-[10px] text-center text-slate-400">
              Today ₹6,420 · 84 bills · Feeds sell-out data to ERP
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
