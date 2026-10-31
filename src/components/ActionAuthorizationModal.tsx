'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Lock, 
  Hash, 
  Clock, 
  Key
} from 'lucide-react';
import { Subscription, BillNegotiation } from '@/lib/types';

interface ActionAuthorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSubscription?: Subscription | null;
  targetNegotiation?: BillNegotiation | null;
  actionType: 'cancellation' | 'negotiation_initiation' | 'counteroffer_acceptance';
  onAuthorize: (authRecord: {
    termsHash: string;
    authMethod: string;
    timestamp: string;
  }) => void;
}

export const ActionAuthorizationModal: React.FC<ActionAuthorizationModalProps> = ({
  isOpen,
  onClose,
  targetSubscription,
  targetNegotiation,
  actionType,
  onAuthorize,
}) => {
  const [pin, setPin] = useState('');
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const targetName = targetSubscription?.merchant || targetNegotiation?.providerName || 'Service Provider';
  const simulatedHash = 'sha256:' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const handleApprove = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      onAuthorize({
        termsHash: simulatedHash,
        authMethod: 'mfa_step_up_token',
        timestamp: new Date().toISOString(),
      });
      setIsAuthorizing(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col text-foreground">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Explicit Consequential Action Authorization
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Non-delegable human approval required before binding changes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Terms Shown */}
        <div className="p-5 space-y-4 text-xs">
          <div className="rounded-2xl border border-border bg-secondary/50 p-4 space-y-2">
            <div className="flex justify-between items-center text-[11px] border-b border-border pb-2">
              <span className="text-muted-foreground">Target Provider / Service:</span>
              <span className="font-bold text-foreground">{targetName}</span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-b border-border pb-2">
              <span className="text-muted-foreground">Action Type:</span>
              <span className="font-mono uppercase text-amber-500 font-semibold">
                {actionType.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-b border-border pb-2">
              <span className="text-muted-foreground">Consequences:</span>
              <span className="text-foreground text-right font-medium">
                {actionType === 'cancellation'
                  ? 'Access terminates at end of current paid cycle. No auto-renewal.'
                  : 'System will submit negotiated offer with target rate CAD 75.00/mo.'}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground">Known Early Termination Fees:</span>
              <span className="text-emerald-500 font-mono font-semibold">CAD $0.00 (None)</span>
            </div>
          </div>

          {/* Cryptographic Scope and Hash */}
          <div className="p-3 rounded-xl bg-secondary/60 border border-border text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Immutable Terms Hash (SHA-256):</span>
            </div>
            <p className="text-amber-500 truncate text-[10px] bg-card p-2 rounded-lg border border-border">
              {simulatedHash}
            </p>
          </div>

          {/* Step-up authentication code */}
          <div className="space-y-1.5">
            <label className="block text-foreground font-medium">
              Step-up Security PIN / Passkey:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit confirmation PIN (e.g. 123456)"
                className="w-full bg-secondary border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground font-mono tracking-widest focus:outline-none focus:border-ring"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Demo sandbox: any 6-digit pin or &quot;123456&quot; will be accepted.
            </p>
          </div>

          {/* Explicit Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-secondary/40 border border-border text-foreground">
            <input
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
              className="mt-0.5 rounded border-border text-amber-500 focus:ring-0"
            />
            <span className="text-[11px] leading-relaxed text-muted-foreground">
              I have inspected the terms shown above and explicitly authorize Money Command to execute this action within this exact scope.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={!hasConfirmedCheckbox || pin.length < 4 || isAuthorizing}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-sm"
          >
            {isAuthorizing ? (
              <Clock className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>Sign & Authorize Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
