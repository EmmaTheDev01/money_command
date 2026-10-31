'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  X 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';

export default function TaxPage() {
  const [state, setState] = useState<AppState>(getInitialState());
  const [taxYear, setTaxYear] = useState<number>(2026);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0];
  const pendingProposalsCount = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending').length;
  const entityTransactions = state.transactions.filter((t) => t.entityId === activeEntity.id);

  // Calculate gross income & deductions
  const grossRevenueMinor = entityTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.totalMinor, 0);

  const totalExpensesMinor = entityTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.totalMinor, 0);

  const netBusinessIncomeMinor = grossRevenueMinor - totalExpensesMinor;

  // 13% Ontario HST collected estimate
  const hstCollectedMinor = Math.round(grossRevenueMinor * 0.13);

  // Recommended 25% tax reserve requirement
  const recommendedReserveMinor = Math.round(grossRevenueMinor * 0.25);

  // Current balance in HISA Tax Reserve account
  const currentReserveMinor = state.accounts
    .filter((a) => a.id === 'acc-rbc-tax-reserve')
    .reduce((sum, a) => sum + a.balanceMinor, 0);

  const handleExportTaxSchedule = () => {
    const csvContent = [
      `CRA T2125 STATEMENT OF BUSINESS ACTIVITIES - MONEY COMMAND EXPORT`,
      `Entity: ${activeEntity.name} | BN: ${activeEntity.taxIdentifier || 'Sole Proprietorship'}`,
      `Tax Year: ${taxYear} | Jurisdiction: Ontario (CA_ON)`,
      ``,
      `Part 1: Business Income (Line 8000)`,
      `Gross Business Revenue (CAD),${(grossRevenueMinor / 100).toFixed(2)}`,
      `Estimated 13% HST Collected Payable (CAD),${(hstCollectedMinor / 100).toFixed(2)}`,
      ``,
      `Part 2: Business Expenses`,
      `Total Deductible Expenses (CAD),${(totalExpensesMinor / 100).toFixed(2)}`,
      `Net Business Income (Line 9369) (CAD),${(netBusinessIncomeMinor / 100).toFixed(2)}`,
      ``,
      `Transaction Details:`,
      `Date,Merchant,Category,Amount CAD,Accountant Status`,
      ...entityTransactions.map(
        (t) =>
          `${t.txDate},"${t.merchant || t.description}","${t.category}",${(t.totalMinor / 100).toFixed(
            2
          )},${t.accountantStatus}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CRA_T2125_${activeEntity.name.replace(/\s+/g, '_')}_${taxYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage(`CRA T2125 schedule exported for ${activeEntity.name}.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        pendingProposalsCount={pendingProposalsCount}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposalsCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Canada-First Tax Readiness
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono border border-border">
                  Tax Year {taxYear} &middot; Ontario (CA_ON)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Organize deductible records, GST/HST remittances, and T2125 schedules. (No official e-filing in MVP).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportTaxSchedule}
                className="px-5 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 font-semibold text-xs flex items-center gap-1.5 transition-opacity shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CRA Schedule & Receipts</span>
              </button>
            </div>
          </div>

          {/* Status Toast */}
          {statusMessage && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 flex items-center justify-between text-xs text-foreground shadow-xs animate-in fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tax Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Gross Business Revenue
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground tabular-nums">
                {formatCAD(grossRevenueMinor)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Reportable income</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Deductible Expenses
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground tabular-nums">
                {formatCAD(totalExpensesMinor)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Categorized CRA write-offs</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Ontario 13% HST Collected
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground tabular-nums">
                {formatCAD(hstCollectedMinor)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Earmarked CRA remittance</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-medium">
                Current Tax Reserve (HISA)
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground tabular-nums">
                {formatCAD(currentReserveMinor)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 font-mono">Recommended: {formatCAD(recommendedReserveMinor)}</p>
            </div>
          </div>

          {/* CRA Schedule Breakdown Box */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">
                  CRA Form T2125 Alignment & Bookkeeping Categories
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                CRA Compliant Audit Trail
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <span className="text-muted-foreground font-bold block text-[11px] font-sans">
                  Part 1 &middot; Business Income (Line 8000)
                </span>
                <div className="flex justify-between text-foreground">
                  <span>Gross consulting & service retainers:</span>
                  <span className="text-foreground font-semibold font-mono tabular-nums">{formatCAD(grossRevenueMinor)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>13% HST collected on sales:</span>
                  <span className="text-foreground font-semibold font-mono tabular-nums">{formatCAD(hstCollectedMinor)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <span className="text-muted-foreground font-bold block text-[11px] font-sans">
                  Part 2 &middot; Business Expenses (Line 8521/8810)
                </span>
                <div className="flex justify-between text-foreground">
                  <span>Office & Software (Line 8810):</span>
                  <span className="text-foreground font-semibold font-mono tabular-nums">{formatCAD(totalExpensesMinor)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Net Business Profit (Line 9369):</span>
                  <span className="text-foreground font-bold font-mono tabular-nums">{formatCAD(netBusinessIncomeMinor)}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer & Non-claim rule */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-[11px] text-muted-foreground leading-relaxed font-sans">
              <strong>Statutory Compliance Guardrail: </strong>
              Money Command provides deterministic record preparation, deduction tracking, and audit packages. We do not claim to be a CRA-certified e-filer or provide regulated tax advice.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
