'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  FileText, 
  ShieldAlert, 
  Check, 
  Key,
  Building2,
  Sparkles
} from 'lucide-react';

interface SessionProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'accountant' | 'admin';
  roleLabel: string;
  description: string;
  targetPath: string;
  avatarInitials: string;
}

const AVAILABLE_SESSIONS: SessionProfile[] = [
  {
    id: 'session-client',
    name: 'Alex MacLean (Founder)',
    email: 'alex@acmeventures.ca',
    role: 'client',
    roleLabel: 'Client / Founder OS',
    description: 'Multi-entity cash flow, double-entry ledger, Safe-to-Spend & budgets',
    targetPath: '/client',
    avatarInitials: 'AM',
  },
  {
    id: 'session-accountant',
    name: 'Marcus Vance, CPA',
    email: 'mvance@vanceaccounting.ca',
    role: 'accountant',
    roleLabel: 'Accountant Portal',
    description: 'Permissioned review, CPA verification & CRA T2125 workpaper exports',
    targetPath: '/accountant',
    avatarInitials: 'MV',
  },
  {
    id: 'session-admin',
    name: 'DevOps & Security Admin',
    email: 'security@moneycommand.ca',
    role: 'admin',
    roleLabel: 'Admin Console',
    description: 'Tenant isolation, circuit breakers, PostgreSQL triggers & audit trail',
    targetPath: '/admin',
    avatarInitials: 'DA',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<SessionProfile>(AVAILABLE_SESSIONS[0]);
  const [email, setEmail] = useState(AVAILABLE_SESSIONS[0].email);
  const [password, setPassword] = useState('••••••••••••');
  const [rememberSession, setRememberSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(selectedSession.email);
  }, [selectedSession]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('money_command_active_session', JSON.stringify(selectedSession));
      }
    } catch {
      // Storage unavailable in sandbox
    }

    setTimeout(() => {
      router.push(selectedSession.targetPath);
    }, 400);
  };

  const handleQuickLaunch = (session: SessionProfile) => {
    setSelectedSession(session);
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('money_command_active_session', JSON.stringify(session));
      }
    } catch {
      // Storage unavailable in sandbox
    }
    setTimeout(() => {
      router.push(session.targetPath);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-foreground selection:text-background transition-colors">
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b border-border flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center font-bold text-xs tracking-tight">
            MC
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-sm">MONEY COMMAND</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              FINANCIAL OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground hidden sm:inline">Canada-first Double Entry</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border">
            CA_ON 2026
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Session Selector */}
          <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Unified Gateway
                </span>
                <h2 className="text-lg font-bold text-foreground mt-0.5">
                  Select Active Session
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  All portals share this single authentication point. Choose the role session you wish to launch:
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {AVAILABLE_SESSIONS.map((sess) => {
                  const isSelected = selectedSession.id === sess.id;
                  return (
                    <button
                      key={sess.id}
                      type="button"
                      onClick={() => setSelectedSession(sess)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-foreground bg-secondary/80 text-foreground shadow-xs'
                          : 'border-border bg-background/50 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground shrink-0 mt-0.5">
                        {sess.avatarInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {sess.name}
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-secondary border border-border shrink-0">
                            {sess.roleLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {sess.email}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 mt-1 line-clamp-1">
                          {sess.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
                <span>Deterministic Tenant Isolation &middot; MC-010</span>
              </div>
            </div>
          </div>

          {/* Right Column: Credentials & Launch Form */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Secure Entry
                  </span>
                  <span className="text-xs font-mono font-medium text-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border">
                    {selectedSession.roleLabel}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                  Authenticate Session
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign in to enter the {selectedSession.roleLabel} environment.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center justify-between">
                    <span>Identity / Email</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Verified Tenant</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-medium text-foreground">Password / Passkey</label>
                    <button type="button" className="text-muted-foreground hover:text-foreground text-[11px]">
                      Forgot key?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded border-border text-foreground focus:ring-0"
                    />
                    <span>Persist session for 30 days</span>
                  </label>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-full bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Establishing session...</span>
                    ) : (
                      <>
                        <span>Enter {selectedSession.roleLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLaunch(selectedSession)}
                    className="w-full py-2.5 px-4 rounded-full bg-secondary text-foreground hover:bg-muted font-medium text-xs border border-border transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Key className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Instant Demo Sign-in (Bypass)</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Direct Switcher Links */}
            <div className="pt-6 border-t border-border mt-6">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-2">
                Quick Jump To Portals
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                {AVAILABLE_SESSIONS.map((sess) => (
                  <button
                    key={sess.id}
                    onClick={() => handleQuickLaunch(sess)}
                    className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-[11px] font-medium text-foreground transition-colors"
                  >
                    {sess.role === 'client' ? 'Client' : sess.role === 'accountant' ? 'Accountant' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border text-center text-xs text-muted-foreground">
        Money Command &middot; Pure Monochromatic Financial Operating System &middot; Canada-First
      </footer>
    </div>
  );
}
