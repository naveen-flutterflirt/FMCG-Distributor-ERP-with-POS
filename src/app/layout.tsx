import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";

export const metadata: Metadata = {
  title: "FMCG Distributor ERP — FlutterFlirt Enterprise",
  description: "One system for sales, route & van sales, POS, schemes, warehouse, finance and field teams",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
