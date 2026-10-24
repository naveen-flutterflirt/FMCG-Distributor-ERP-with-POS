import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';
  count?: number;
}

export function Skeleton({ className = '', variant = 'rectangular', count = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-slate-200/80 rounded-md';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-32 w-full rounded-xl',
    'table-row': 'h-10 w-full rounded-md'
  };

  if (count > 1) {
    return (
      <div className="space-y-2.5 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

/**
 * Reusable Card Skeleton for Stats / KPI Grids
 */
export function SkeletonCard({ count = 4, className = 'grid-cols-2 lg:grid-cols-4' }: { count?: number; className?: string }) {
  return (
    <div className={`grid gap-3.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-2.5 animate-pulse">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-7 w-32 bg-slate-200 rounded-md" />
          <div className="h-2.5 w-20 bg-slate-100 rounded pt-1" />
        </div>
      ))}
    </div>
  );
}

/**
 * Reusable Table Skeleton for Data Lists (Ledgers, Orders, Outlets, Claims, SKUs)
 */
export function SkeletonTable({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden animate-pulse">
      {/* Header Bar */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-3.5 w-20 bg-slate-200 rounded" />
      </div>

      {/* Table Head */}
      <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50 border-b border-slate-200">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 rounded" />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-6 gap-3 py-3 px-2 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-3.5 bg-slate-200/70 rounded ${
                  c === 0 ? 'w-3/4' : c === cols - 1 ? 'w-1/2 ml-auto' : 'w-full'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
