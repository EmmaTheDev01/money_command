'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { AccountantSidebar } from '@/components/AccountantSidebar';
import { FileText, Loader2 } from 'lucide-react';

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const session = db.getCurrentSession();
    if (!session || !db.isAccountantOrAdmin(session)) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [router, pathname]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-sans p-4">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-border bg-card shadow-xs text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground shadow-xs">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Accountant Access Protected
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verifying CPA credentials and client ledger grant authorization...
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground pt-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Redirecting to login if unauthorized...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <Navbar />
      <div className="flex-1 flex">
        <AccountantSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
