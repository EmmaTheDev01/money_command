'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  Inbox, 
  Check, 
  X, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  FileText 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { getInitialState, saveState, AppState } from '@/lib/store';
import { formatCAD } from '@/lib/ledger';
import { Proposal, Transaction } from '@/lib/types';

export default function ProposalsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(getInitialState());
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [editMerchant, setEditMerchant] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAmountCAD, setEditAmountCAD] = useState('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  useEffect(() => {
    const s = db.getCurrentSession();
    if (!s) {
      router.push('/login?redirect=/client/proposals');
      return;
    }
    async function load() {
      const activeId = state.selectedEntityId;
      const props = await db.getProposals(activeId);
      setState((prev) => ({ ...prev, proposals: props }));
    }
    load();
  }, [router, state.selectedEntityId]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeEntity = state.entities.find((e) => e.id === state.selectedEntityId) || state.entities[0] || {
    id: 'ent-default',
    name: 'Primary Ledger',
  };
  const pendingProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status === 'pending');
  const pastProposals = state.proposals.filter((p) => p.entityId === activeEntity.id && p.status !== 'pending');

  const handleConfirmProposal = (proposal: Proposal) => {
    const totalMinor = proposal.amountMinor;

    const newTx: Transaction = {
      id: `tx-user-${Date.now()}`,
      tenantId: state.currentTenant?.id || 'ten-default',
      entityId: proposal.entityId,
      txDate: proposal.txDate,
      type: proposal.type,
      category: proposal.category,
      merchant: proposal.merchant,
      description: proposal.rawText || `${proposal.merchant} purchase`,
      status: 'posted',
      accountantStatus: 'user_verified',
      currency: proposal.currency,
      totalMinor: totalMinor,
      source: 'whatsapp_text',
      sourceId: proposal.id,
      createdAt: new Date().toISOString(),
      lines: [
        {
          id: `line-${Date.now()}-1`,
          transactionId: `tx-user-${Date.now()}`,
          accountId: 'acc-groceries-expense',
          accountCode: '5010',
          accountName: proposal.category || 'Operating Expense',
          debitMinor: totalMinor,
          creditMinor: 0,
          currency: proposal.currency || 'CAD',
        },
        {
          id: `line-${Date.now()}-2`,
          transactionId: `tx-user-${Date.now()}`,
          accountId: 'acc-td-chequing',
          accountCode: '1010',
          accountName: 'TD Everyday Chequing',
          debitMinor: 0,
          creditMinor: totalMinor,
          currency: proposal.currency || 'CAD',
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === proposal.id ? { ...p, status: 'confirmed', confirmedTransactionId: newTx.id } : p
      ),
      transactions: [newTx, ...prev.transactions],
      accounts: prev.accounts.map((acc) => {
        if (acc.id === 'acc-td-chequing') {
          return { ...acc, balanceMinor: acc.balanceMinor - totalMinor };
        }
        if (acc.id === 'acc-groceries-expense') {
          return { ...acc, balanceMinor: acc.balanceMinor + totalMinor };
        }
        return acc;
      }),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          tenantId: prev.currentTenant?.id || 'ten-default',
          userId: prev.currentUser?.id || 'usr-default',
          userName: prev.currentUser?.fullName || 'User',
          entityType: prev.entities.find((e) => e.id === proposal.entityId)?.type || 'personal',
          action: 'CONFIRM_PROPOSAL_POST_JOURNAL',
          details: `Confirmed proposal ${proposal.id} (${proposal.merchant}, CAD ${(totalMinor / 100).toFixed(
            2
          )}). Committed balanced double-entry journal ${newTx.id}. Invariant: Debit == Credit.`,
          termsHash: `sha256:prop-${proposal.id.substring(0, 8)}-confirmed`,
          createdAt: new Date().toISOString(),
          ipAddress: '127.0.0.1 (Web Companion)',
        },
        ...prev.auditLogs,
      ],
    }));

    setStatusNotification(
      `Proposal confirmed. Balanced journal posted: Debit ${proposal.category} CAD ${(totalMinor / 100).toFixed(
        2
      )}, Credit TD Chequing CAD ${(totalMinor / 100).toFixed(2)}.`
    );
    setTimeout(() => setStatusNotification(null), 5000);
  };

  const handleRejectProposal = (proposal: Proposal) => {
    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === proposal.id ? { ...p, status: 'rejected' } : p
      ),
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          tenantId: prev.currentTenant?.id || 'ten-default',
          userId: prev.currentUser?.id || 'usr-default',
          userName: prev.currentUser?.fullName || 'User',
          entityType: prev.entities.find((e) => e.id === proposal.entityId)?.type || 'personal',
          action: 'REJECT_PROPOSAL',
          details: `Rejected unposted candidate proposal ${proposal.id} (${proposal.merchant}). Zero ledger impact.`,
          createdAt: new Date().toISOString(),
          ipAddress: '127.0.0.1 (Web Companion)',
        },
        ...prev.auditLogs,
      ],
    }));
    setStatusNotification(`Candidate proposal for ${proposal.merchant} rejected.`);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const startEdit = (p: Proposal) => {
    setEditingProposalId(p.id);
    setEditMerchant(p.merchant);
    setEditCategory(p.category);
    setEditAmountCAD((p.amountMinor / 100).toFixed(2));
  };

  const handleSaveEdit = (proposal: Proposal) => {
    const newMinor = Math.round(parseFloat(editAmountCAD) * 100);
    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) =>
        p.id === proposal.id
          ? {
              ...p,
              merchant: editMerchant,
              category: editCategory,
              amountMinor: isNaN(newMinor) ? p.amountMinor : newMinor,
            }
          : p
      ),
    }));
    setEditingProposalId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        onSelectEntity={(id) => setState((prev) => ({ ...prev, selectedEntityId: id }))}
        pendingProposalsCount={pendingProposals.length}
      />

      <div className="flex-1 flex">
        <ClientSidebar pendingProposalsCount={pendingProposals.length} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-foreground" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Proposal Inbox & Review
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-mono font-medium border border-border">
                  {pendingProposals.length} Pending
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI extraction generates candidate proposals. You review and confirm before anything posts to your double-entry ledger.
              </p>
            </div>
          </div>

          {/* Status Notification Toast */}
          {statusNotification && (
            <div className="rounded-3xl border border-border bg-secondary/50 p-4 flex items-center justify-between text-xs text-foreground shadow-xs animate-in fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <span>{statusNotification}</span>
              </div>
              <button
                onClick={() => setStatusNotification(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Pending Proposals Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Unposted Proposals Awaiting Confirmation
            </h2>

            {pendingProposals.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-10 text-center space-y-2.5 shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-foreground mx-auto" />
                <h3 className="font-semibold text-foreground text-sm">All caught up!</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Zero pending proposals. Use the WhatsApp simulator to trigger an AI extraction candidate.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingProposals.map((proposal) => {
                  const isEditing = editingProposalId === proposal.id;

                  return (
                    <div
                      key={proposal.id}
                      className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs hover:border-foreground/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-semibold uppercase border border-border">
                              Candidate Proposal
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              ID: {proposal.id.substring(0, 12)}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono font-medium">
                              AI Confidence: {(proposal.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                          {proposal.rawText && (
                            <p className="text-xs text-foreground italic bg-secondary p-3 rounded-2xl border border-border">
                              &ldquo;{proposal.rawText}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Top Amount Display */}
                        <div className="text-right">
                          <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tabular-nums">
                            {formatCAD(proposal.amountMinor)}
                          </span>
                          <span className="block text-[11px] text-muted-foreground font-mono">
                            {proposal.txDate}
                          </span>
                        </div>
                      </div>

                      {/* Editable Fields or Details */}
                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-secondary/50 border border-border text-xs">
                          <div>
                            <label className="text-muted-foreground block mb-1">Merchant:</label>
                            <input
                              type="text"
                              value={editMerchant}
                              onChange={(e) => setEditMerchant(e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-3 py-2 text-foreground"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground block mb-1">Category:</label>
                            <input
                              type="text"
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-3 py-2 text-foreground"
                            />
                          </div>
                          <div>
                            <label className="text-muted-foreground block mb-1">Amount CAD:</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editAmountCAD}
                              onChange={(e) => setEditAmountCAD(e.target.value)}
                              className="w-full bg-card border border-border rounded-xl px-3 py-2 text-foreground font-mono"
                            />
                          </div>
                          <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingProposalId(null)}
                              className="px-3.5 py-1.5 rounded-full bg-card border border-border text-muted-foreground"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(proposal)}
                              className="px-4 py-1.5 rounded-full bg-foreground text-background font-semibold"
                            >
                              Save Edits
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div className="p-3 rounded-2xl bg-secondary/40 border border-border">
                            <span className="text-[10px] text-muted-foreground block">Merchant</span>
                            <span className="font-semibold text-foreground">{proposal.merchant}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-secondary/40 border border-border">
                            <span className="text-[10px] text-muted-foreground block">Category</span>
                            <span className="font-semibold text-foreground">{proposal.category}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-secondary/40 border border-border">
                            <span className="text-[10px] text-muted-foreground block">Proposed Journal</span>
                            <span className="font-semibold text-foreground font-mono text-[11px]">
                              Dr Expense / Cr Checking
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-secondary/40 border border-border">
                            <span className="text-[10px] text-muted-foreground block">Tax Relevance</span>
                            <span className="font-semibold text-foreground capitalize">
                              {proposal.taxRelevance}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Confirmation Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(proposal)}
                              className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-muted text-foreground border border-border text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Fields</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleRejectProposal(proposal)}
                            className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border text-xs font-medium transition-colors flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleConfirmProposal(proposal)}
                          className="px-5 py-2.5 rounded-full bg-foreground hover:opacity-90 text-background font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm & Post Journal (Balanced)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Resolved Proposals History */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Resolved Proposals History
            </h2>

            <div className="space-y-2">
              {pastProposals.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase bg-secondary text-muted-foreground border border-border">
                      {p.status}
                    </span>
                    <div>
                      <div className="font-medium text-foreground">{p.merchant}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{p.category} &middot; {p.txDate}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-semibold text-foreground tabular-nums">
                      {formatCAD(p.amountMinor)}
                    </div>
                    {p.confirmedTransactionId && (
                      <span className="text-[9px] font-mono text-muted-foreground">
                        Linked Tx: {p.confirmedTransactionId.substring(0, 10)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
