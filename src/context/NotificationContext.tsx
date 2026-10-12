'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationOptions {
  title?: string;
  message: string;
  type?: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (options: NotificationOptions | string) => void;
  closeNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [activeNotification, setActiveNotification] = useState<NotificationOptions | null>(null);

  const showNotification = (options: NotificationOptions | string) => {
    if (typeof options === 'string') {
      setActiveNotification({
        title: 'Action Update',
        message: options,
        type: 'info',
      });
    } else {
      setActiveNotification({
        title: options.title || 'System Notice',
        message: options.message,
        type: options.type || 'info',
      });
    }
  };

  const closeNotification = () => {
    setActiveNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, closeNotification }}>
      {children}

      {/* Custom In-App Modal Dialog matching ERP theme */}
      {activeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Top header with color bar */}
            <div className="p-5 pb-3">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeNotification.type === 'success'
                      ? 'bg-emerald-100 text-emerald-600'
                      : activeNotification.type === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : activeNotification.type === 'error'
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {activeNotification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {activeNotification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                  {activeNotification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {(!activeNotification.type || activeNotification.type === 'info') && (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 pr-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    {activeNotification.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {activeNotification.message}
                  </p>
                </div>

                <button
                  onClick={closeNotification}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeNotification}
                className="px-4 py-1.5 bg-[#006d77] hover:bg-[#005a63] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
