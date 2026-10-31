'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-amber-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">
                Explicit Consequential Action Authorization
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Non-delegable human approval required before binding changes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Terms Shown */}
        <div className="p-5 space-y-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
            <div className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Target Provider / Service:</span>
              <span className="font-bold text-slate-200">{targetName}</span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Action Type:</span>
              <span className="font-mono uppercase text-amber-400 font-semibold">
                {actionType.replace('_', ' ')}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Consequences:</span>
              <span className="text-slate-300 text-right">
                {actionType === 'cancellation'
                  ? 'Access terminates at end of current paid cycle. No automatic renewal.'
                  : 'System will submit negotiated offer with target rate CAD 75.00/mo.'}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Known Early Termination Fees:</span>
              <span className="text-emerald-400 font-mono font-semibold">CAD $0.00 (None)</span>
            </div>
          </div>

          {/* Cryptographic Scope and Hash */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 text-[11px] font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span>Immutable Terms Hash (SHA-256):</span>
            </div>
            <p className="text-amber-300/90 truncate text-[10px] bg-slate-900 p-1.5 rounded border border-slate-800">
              {simulatedHash}
            </p>
          </div>

          {/* Step-up authentication code */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-medium">
              Step-up Security PIN / Passkey:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 6-digit confirmation PIN (e.g. 123456)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Demo bypass: any 6-digit pin or &quot;123456&quot; will be accepted.
            </p>
          </div>

          {/* Explicit Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <input
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
            />
            <span className="text-[11px] leading-relaxed">
              I have inspected the terms shown above and explicitly authorize Money Command to execute this action within this exact scope.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
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
