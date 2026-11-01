'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Landmark, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Wallet, 
  CreditCard,
  Building
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { db } from '@/lib/db';

export default function BankAccountsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    const s = db.getCurrentSession();
    if (!s) {
      router.push('/login?redirect=/client/accounts');
      return;
    }
    async function load() {
      const activeId = state.selectedEntityId;
      const accs = await db.getAccounts(activeId);
      setState((prev) => ({ ...prev, accounts: accs }));
    }
    load();
  }, [router, state.selectedEntityId]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };
  const accounts = state.accounts.filter((a) => a.entityId === activeEntity.id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'asset' | 'liability'>('asset');
  const [subtype, setSubtype] = useState('checking');
  const [openingBalance, setOpeningBalance] = useState('');

  const totalAssets = accounts
    .filter((a) => a.type === 'asset')
    .reduce((sum, a) => sum + Math.max(0, a.balanceMinor), 0);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const dollars = parseFloat(openingBalance) || 0;
    if (!accountName.trim()) return;

    const newAcc = {
      id: `acc-${Date.now()}`,
      tenantId: state.currentTenant?.id || 'ten-default',
      entityId: activeEntity.id,
      code: `1${Math.floor(100 + Math.random() * 900)}`,
      name: accountName.trim(),
      type: accountType,
      subtype,
      currency: 'CAD',
      balanceMinor: Math.round(dollars * 100),
      isActive: true,
    };

    const nextState = { ...state, accounts: [...state.accounts, newAcc] };
    setState(nextState);
    saveState(nextState);
    setShowAddModal(false);
    setAccountName('');
    setOpeningBalance('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <div className="flex-1 flex">
        <ClientSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-secondary text-primary">
                  <Landmark className="w-5 h-5" />
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Bank Accounts
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Add accounts, set opening balances, and watch balances update in real-time.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Account</span>
            </button>
          </div>

          {/* Accounts Grid */}
          {accounts.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-xs">
              <Landmark className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-bold text-foreground text-base">No Bank Accounts Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No active asset or liability accounts configured for this entity. Click &ldquo;Add Account&rdquo; above to link your chequing, savings, or credit cards.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs space-y-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                        {acc.subtype || acc.type}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">#{acc.code}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-base pt-1">{acc.name}</h3>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-xs text-muted-foreground block">Verified Ledger Balance</span>
                    <div className="text-2xl font-extrabold font-mono text-foreground tabular-nums">
                      {formatCAD(acc.balanceMinor)}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-primary font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Double-Entry Synced
                    </span>
                    <span className="font-mono">CAD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Bank Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Account Name</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. RBC High Interest eSavings"
                  className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Type</label>
                  <select
                    value={subtype}
                    onChange={(e) => setSubtype(e.target.value)}
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Opening Balance (CAD $)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="1500.00"
                    className="w-full rounded-xl bg-secondary border border-border p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-border bg-secondary text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-xs hover:opacity-90 transition-opacity"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

