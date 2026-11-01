'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { 
  Sliders, 
  CheckCircle2, 
  Check, 
  X,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function loadFlags() {
    try {
      const data = await db.getFeatureFlags();
      setFlags(data);
    } catch (err) {
      console.error('Failed to load feature flags from DB:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFlags();
  }, []);

  const toggleFlag = async (flagId: string, currentEnabled: boolean) => {
    setIsUpdating(flagId);
    try {
      const nextState = !currentEnabled;
      await db.updateFeatureFlag(flagId, nextState);
      setFlags((prev) =>
        prev.map((f) => (f.id === flagId ? { ...f, enabled: nextState } : f))
      );
      setToastMessage(`Feature flag updated in PostgreSQL database.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update feature flag:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          Loading feature flags from PostgreSQL...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-secondary border border-border text-foreground">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Feature Flags & Operational Risk Controls
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground font-mono font-medium">
              Dynamic Circuit Breakers
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Safely isolate capabilities, halt third-party messaging integrations, or restrict action authorizations in real time.
          </p>
        </div>

        <button
          onClick={loadFlags}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Flags ({flags.length})</span>
        </button>
      </div>

      {toastMessage && (
        <div className="rounded-3xl border border-border bg-secondary/80 p-4 text-xs text-foreground flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Flags List */}
      <div className="space-y-3.5">
        {flags.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground font-mono text-xs">
            No feature flags found in database.
          </div>
        ) : (
          flags.map((flag) => (
            <div
              key={flag.id}
              className="p-5 sm:p-6 rounded-3xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-foreground text-sm">
                    {flag.key}
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    flag.enabled
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-secondary text-muted-foreground border-border'
                  }`}>
                    {flag.enabled ? `Active (${flag.rolloutPercentage ?? 100}% Rollout)` : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {flag.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isUpdating === flag.id}
                  onClick={() => toggleFlag(flag.id, flag.enabled)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
                    flag.enabled
                      ? 'bg-foreground text-background hover:opacity-90'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                  }`}
                >
                  {isUpdating === flag.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating DB...</span>
                    </>
                  ) : flag.enabled ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Enabled</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Disabled</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
