'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Truck,
  Store,
  ShoppingCart,
  Warehouse,
  Navigation,
  Tag,
  ShieldAlert,
  IndianRupee,
  Landmark,
  Users,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

export const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders & Billing', href: '/orders-billing', icon: FileText },
  { name: 'Van Sales', href: '/van-sales', icon: Truck },
  { name: 'Outlets & Beats', href: '/outlets-beats', icon: Store },
  { name: 'Purchase', href: '/purchase', icon: ShoppingCart },
  { name: 'Godown', href: '/godown', icon: Warehouse },
  { name: 'Delivery & Fleet', href: '/delivery-fleet', icon: Navigation },
  { name: 'Schemes', href: '/schemes', icon: Tag },
  { name: 'Claims', href: '/claims', icon: ShieldAlert },
  { name: 'Collections', href: '/collections', icon: IndianRupee },
  { name: 'Accounts', href: '/accounts', icon: Landmark },
  { name: 'Field Team', href: '/field-team', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar with dark green theme and link icons */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-56 bg-[#072428] border-r border-[#0c383e] flex flex-col py-5 px-3 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header: "+" in teal rounded square + "[Distributor] ERP" */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#00897b] flex items-center justify-center text-white font-bold text-lg leading-none shadow-sm">
              +
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">
              [Distributor] ERP
            </span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#8ea8a2] hover:text-white rounded-md hover:bg-[#0c3339] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation list: 14 links with respective icons */}
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors group ${
                  isActive
                    ? 'bg-[#0f4e54] text-white font-semibold shadow-2xs'
                    : 'text-[#8ea8a2] hover:text-white hover:bg-[#0c3339]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-teal-200' : 'text-[#8ea8a2] group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
