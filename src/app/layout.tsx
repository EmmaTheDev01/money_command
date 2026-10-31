import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Command | Financial OS & Personal AI CFO",
  description: "Permissioned financial operating system, double-entry ledger, deterministic safe-to-spend, tax intelligence & action automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100 antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
