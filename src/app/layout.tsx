import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "FMCG Distributor ERP — Enterprise POS & Distribution",
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
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
