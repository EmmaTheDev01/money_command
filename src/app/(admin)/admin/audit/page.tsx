'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { 
  ScrollText, 
  Search, 
  Hash, 
  Clock, 
  Copy,
  Loader2,
  RefreshCw,
  Check,
  User,
  ShieldCheck
} from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadLogs() {
    try {
      const data = await db.getAuditLogs(100);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs from DB:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLogs();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      (log.userName && log.userName.toLowerCase().includes(q)) ||
      (log.entityType && log.entityType.toLowerCase().includes(q)) ||
      (log.id && log.id.toLowerCase().includes(q))
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" />
        <span className="text-xs font-mono text-muted-foreground">
          Fetching append-only audit stream from PostgreSQL...
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
              <ScrollText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Append-Only Consequential Audit Stream
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground font-mono font-medium">
              Immutable PostgreSQL Logs
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Every financial mutation, proposal confirmation, reversal, and admin authorization is permanently logged.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors shadow-xs cursor-pointer disabled:opacity-50 w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Logs ({logs.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by action, operator, or entity..."
          className="w-full bg-secondary/80 border border-border rounded-2xl pl-10 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-sans"
        />
      </div>

      {/* Audit Log Stream */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-foreground">Authoritative Journal Events</h3>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground">
            {filteredLogs.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50 font-mono uppercase text-[10px] text-muted-foreground">
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-4">Operator / Agent</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Payload / Mutation Details</th>
                <th className="py-3 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground font-mono text-xs">
                    No matching audit stream events found in the database.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-5 font-mono font-bold text-foreground">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary text-foreground border border-border inline-block">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{log.userName}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {log.userAgent ? log.userAgent.slice(0, 30) : 'PostgreSQL'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border uppercase">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground text-[11px] max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-muted-foreground whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
