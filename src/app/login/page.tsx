'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import MoneyCommandLogo from '@/components/MoneyCommandLogo';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Check, 
  Building2, 
  Phone,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { db, AuthSession } from '@/lib/db';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || null;

  // 'signin' or 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  // In signin: 'email' (default) or 'whatsapp'
  const [loginMethod, setLoginMethod] = useState<'whatsapp' | 'email'>('email');

  // Signin fields
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regTenantName, setRegTenantName] = useState('');

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let session: AuthSession;
      if (loginMethod === 'whatsapp') {
        session = await db.loginWithWhatsApp(whatsappPhone, password);
      } else {
        session = await db.loginWithEmail(email, password);
      }

      setSuccessMsg(`Authenticated as ${session.name}. Loading ledger...`);
      const destination = redirectTarget || session.targetPath || '/client';
      setTimeout(() => {
        router.push(destination);
      }, 400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify credentials in the database.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regFullName.trim()) {
      setErrorMsg('Please enter your full name.');
      setIsLoading(false);
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg('Please enter your WhatsApp phone number.');
      setIsLoading(false);
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      setIsLoading(false);
      return;
    }
    if (!regPassword) {
      setErrorMsg('Please create a password for your account.');
      setIsLoading(false);
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password confirmation.');
      setIsLoading(false);
      return;
    }

    try {
      const session = await db.registerUser({
        fullName: regFullName.trim(),
        whatsappPhone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword || 'password123',
        tenantName: regTenantName.trim() || undefined,
      });

      setSuccessMsg(`Account created for ${session.name}! Redirecting to dashboard...`);
      const destination = redirectTarget || session.targetPath || '/client';
      setTimeout(() => {
        router.push(destination);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create user account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-foreground selection:text-background transition-colors">
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b border-border flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-1.5 rounded-xl bg-secondary border border-border flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs text-foreground">
            <MoneyCommandLogo variant="mark" className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-sm">MONEY COMMAND</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              FINANCIAL OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground hidden sm:inline">Canada Double-Entry Core</span>
          <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-secondary border border-border">
            LIVE DATABASE
          </span>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          {/* Header */}
          <div className="space-y-2 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Authentication
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {authMode === 'signin' ? 'Sign In to Your Ledger' : 'Create Founder Account'}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {authMode === 'signin'
                ? 'Access your live double-entry accounts, budgets, and automated WhatsApp proposals.'
                : 'Initialize a clean tenant, chart of accounts, and deterministic ledger.'}
            </p>
          </div>

          {/* SIGN IN FORM */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Login Method Toggle: Email (Default) vs WhatsApp */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary border border-border w-fit text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    loginMethod === 'email'
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('whatsapp')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    loginMethod === 'whatsapp'
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp Number</span>
                </button>
              </div>

              {loginMethod === 'whatsapp' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center justify-between">
                    <span>WhatsApp Phone Number</span>
                    <span className="text-[10px] text-emerald-500 font-mono font-medium">Canada / Global (+1...)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      placeholder="+1 647 555 0192"
                      required
                      autoComplete="tel"
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Enter the phone number registered to your WhatsApp account.
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Registered Account</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@example.com"
                      required
                      autoComplete="email"
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your account password"
                    autoComplete="current-password"
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error / Success Notifications */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-500 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="rounded border-border text-foreground focus:ring-0"
                  />
                  <span>Stay signed in on this device</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-full bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying against database...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Financial OS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Text link to Register at bottom of login form */}
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-semibold text-foreground underline underline-offset-4 hover:text-emerald-500 transition-colors cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Full Name / Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    required
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>WhatsApp Phone Number</span>
                  <span className="text-[10px] text-emerald-500 font-mono font-medium">Used for Bot Commands</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 647 123 4567"
                    required
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="maya@example.com"
                    required
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Confirmation */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showRegConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showRegConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>Organization / Business Name (Optional)</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Tenant</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regTenantName}
                    onChange={(e) => setRegTenantName(e.target.value)}
                    placeholder="e.g. Lin Ventures Inc."
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring font-sans"
                  />
                </div>
              </div>

              {/* Error / Success Notifications */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-500 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-full bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating database records...</span>
                    </>
                  ) : (
                    <>
                      <span>Register & Create Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Text link to Sign In at bottom of register form */}
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-semibold text-foreground underline underline-offset-4 hover:text-emerald-500 transition-colors cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border text-center text-xs text-muted-foreground font-mono">
        Money Command &middot; WhatsApp Authenticated Double-Entry Financial Core &middot; Canada-First
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-mono text-xs">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading authentication gateway...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
