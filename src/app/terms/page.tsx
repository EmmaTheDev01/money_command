'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import MoneyCommandLogo from '@/components/MoneyCommandLogo';
import { 
  ShieldCheck, 
  FileText, 
  ArrowLeft, 
  Printer, 
  ExternalLink,
  Lock,
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface LegalSection {
  number: string;
  title: string;
  paragraph: string;
  keyPoints?: string[];
}

const TERMS_SECTIONS: LegalSection[] = [
  {
    number: '01',
    title: 'Acceptance of Terms and Scope of Service',
    paragraph: 'By accessing or utilizing Money Command, connecting via the Meta WhatsApp Cloud API, or linking any financial accounts, you enter into a legally binding agreement governed by the laws of Ontario and the federal laws of Canada. These Terms govern your access to our deterministic double-entry engine, AI proposal mechanisms, companion dashboards, and automated accountant collaboration tools across all supported personal and commercial entity structures.',
    keyPoints: ['Binding agreement under Ontario & Canadian federal law', 'Governs WhatsApp messaging, Web Companion & Accountant portals', 'Applies to personal, sole proprietorship, and corporate workspaces']
  },
  {
    number: '02',
    title: 'Non-Custodial Financial Architecture',
    paragraph: 'Money Command operates as a strictly non-custodial software platform and does not hold, transmit, manage, or take legal custody of your liquid funds or deposit balances. We do not store online banking passwords, credit card numbers, or security credentials, relying exclusively on cryptographically signed OAuth tokens and official Meta messaging callbacks to generate ledger insights and record transactions.',
    keyPoints: ['Zero custody over user bank deposits or liquid cash reserves', 'No storage of online banking credentials, passwords, or card PINs', 'Read-only financial synchronization via cryptographic partner APIs']
  },
  {
    number: '03',
    title: 'Deterministic Ledger and Disclaimer of Financial Advice',
    paragraph: 'Our platform provides automated bookkeeping calculations, integer-based minor unit double-entry journals, and heuristic Safe-to-Spend projections designed solely for operational organization and planning purposes. Money Command does not provide certified legal, investment, or statutory financial advice; all automated proposals require your review, and users must consult a licensed Chartered Professional Accountant (CPA) for statutory tax filings.',
    keyPoints: ['Integer-cent arithmetic eliminates floating-point calculation errors', 'All AI-extracted proposals require explicit user review and confirmation', 'Not a replacement for certified CPA legal, tax, or investment advice']
  },
  {
    number: '04',
    title: 'Scoped 1-Tap Consequential Action Authorizations',
    paragraph: 'You acknowledge and agree that our automated engines will never bind you to third-party contractual amendments, telecom contract renegotiations, or bill cancellations without your explicit, step-up authorization. Every material change presents a transparent summary including duration, price adjustments, and penalty disclosures that you must independently authorize via WhatsApp button or authenticated web portal verification before execution.',
    keyPoints: ['Zero autonomous contract commitments without explicit sign-off', 'Mandatory step-up authentication before irreversible billing changes', 'Transparent disclosure of terms, price adjustments, and fees']
  },
  {
    number: '05',
    title: 'WhatsApp Ingestion and Meta Cloud Integration',
    paragraph: 'When communicating with Money Command via WhatsApp, you consent to message transmission through Meta’s enterprise infrastructure subject to end-to-end transport encryption and our automated parsing pipelines. You agree not to transmit illegal, unauthorized, malicious, or deceptive payloads, and you recognize that network disconnections or third-party service latency outside our infrastructure may occasionally delay real-time webhook confirmation delivery.',
    keyPoints: ['Transport encryption enforced across Meta cloud enterprise webhooks', 'Prohibition of abusive, deceptive, or malicious communication payloads', 'Deduplication guarantees applied via provider wamid identifiers']
  },
  {
    number: '06',
    title: 'Tenant Isolation and Row-Level Security (RLS)',
    paragraph: 'All user data, chart of accounts, receipts, and posted journals are partitioned within isolated PostgreSQL tenant environments enforced by database-level Row-Level Security policies. You are responsible for preserving the confidentiality of your session authentication credentials and must promptly notify Money Command security personnel if you detect unauthorized access or credential compromise within your administrative console.',
    keyPoints: ['Relational isolation enforced via database-level Row-Level Security', 'Zero cross-tenant record leakage or cross-user visibility', 'User duty to safeguard authentication session tokens and devices']
  },
  {
    number: '07',
    title: 'Canada Revenue Agency (CRA) and Tax Reserves',
    paragraph: 'While our platform offers automated estimators for Ontario Harmonized Sales Tax (13% HST) and federal income tax reserve set-asides, you retain sole ultimate responsibility for the accuracy of your statutory tax filings with the CRA. Money Command disclaims liability for penalties, reassessments, or interest levied by municipal, provincial, or federal revenue authorities resulting from misclassified expenses or unverified receipts.',
    keyPoints: ['Continuous Ontario 13% HST and federal deduction reserve estimates', 'Statutory tax filing accuracy remains user and CPA responsibility', 'Exclusion of liability for government tax penalties or reassessments']
  },
  {
    number: '08',
    title: 'Third-Party Subscriptions and Telecom Bill Negotiations',
    paragraph: 'When utilizing our subscription cancellation or telecom negotiation features, Money Command acts solely as a technological facilitator drafting communications and benchmark comparisons based on historical Canadian market rates. We cannot guarantee specific monetary concessions from service providers, and you remain responsible for any legitimate early termination charges incurred under your existing third-party merchant contracts.',
    keyPoints: ['Market benchmark guidance for telecom and software subscriptions', 'No guarantee of provider concession or unilateral vendor waiver', 'User responsibility for pre-existing contractual early-exit fees']
  },
  {
    number: '09',
    title: 'Append-Only Ledger Integrity and Audit Trails',
    paragraph: 'To uphold financial auditing standards, Money Command enforces an immutable, append-only journal policy wherein posted financial transactions cannot be deleted or overwritten after verification. Any bookkeeping corrections, merchant refunds, or accounting errors must be addressed via opposite reversing entries, ensuring an unbroken and mathematically verifiable audit trail for both founders and reviewing CPAs.',
    keyPoints: ['Posted double-entry transactions are non-destructive and permanent', 'Corrections posted strictly via balanced reversing entries (MC-010)', 'SHA-256 consequential audit log records every administrative event']
  },
  {
    number: '10',
    title: 'Termination, Data Portability, and Service Revocation',
    paragraph: 'You may discontinue your subscription and disconnect your WhatsApp integration at any time through the companion settings dashboard or by messaging our bot with standard cancellation commands. Upon account closure, you maintain the right to export all historical double-entry transactions, documents, and tax workpapers in standardized CSV format prior to permanent tenant record deactivation and database purge.',
    keyPoints: ['Instant, unhindered account cancellation and bot disconnection', 'Full data portability with complete CSV/PDF export of workpapers', 'Permanent database tenant purge executed within thirty days of closure']
  },
  {
    number: '11',
    title: 'Limitation of Liability and Indemnification',
    paragraph: 'To the maximum extent permissible under Canadian law, Money Command and its officers, directors, and affiliates shall not be liable for indirect, punitive, or consequential damages resulting from data delays or service interruptions. You agree to defend and hold harmless Money Command against third-party claims arising from your breach of these terms, fraudulent financial inputs, or unauthorized corporate entity declarations.',
    keyPoints: ['Cap on liability limited to fees paid in preceding twelve months', 'Indemnification against unlawful, fraudulent, or abusive usage', 'Waiver of indirect, incidental, or exemplary commercial damages']
  },
  {
    number: '12',
    title: 'Governing Law, Jurisdiction, and Dispute Resolution',
    paragraph: 'These Terms of Service are construed and governed exclusively in accordance with the substantive laws of the Province of Ontario and the federal laws of Canada applicable therein. Any legal proceeding, dispute, or claim arising out of or relating to these terms shall be submitted to the exclusive jurisdiction of the competent provincial courts located in Toronto, Ontario, Canada.',
    keyPoints: ['Exclusive jurisdiction of provincial and federal courts in Toronto, ON', 'Application of Ontario law and federal Canadian commercial statutes', 'Severability clause maintains validity of remaining term provisions']
  }
];

export default function TermsOfServicePage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 w-full">
        {/* Back Link & Category Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Financial OS Landing</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-secondary border border-border text-foreground">
                  <FileText className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Legal & Governance Framework
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Authoritative terms governing the Money Command double-entry core, conversational ingest, and permissioned actions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-semibold text-foreground">Effective Date: November 1, 2026</span>
              <span className="text-muted-foreground block text-[11px] font-mono">Jurisdiction: Ontario & Canada Federal Law</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span>Version: MC-TOS-2026.2</span>
            <span>&middot;</span>
            <span className="text-emerald-500 font-bold">12 Verified Sections</span>
          </div>
        </div>

        {/* Quick Table of Contents Jump Grid */}
        <div className="p-5 sm:p-6 rounded-3xl bg-secondary/40 border border-border space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">
            Table of Contents & Quick Navigation
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {TERMS_SECTIONS.map((sec) => (
              <a
                key={sec.number}
                href={`#section-${sec.number}`}
                className="p-2 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 font-medium"
              >
                <span className="font-mono text-[10px] text-foreground font-bold">{sec.number}.</span>
                <span className="truncate">{sec.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 12 Detailed Sections with 3-4 Line Paragraphs */}
        <div className="space-y-8 divide-y divide-border/60">
          {TERMS_SECTIONS.map((sec) => (
            <section
              key={sec.number}
              id={`section-${sec.number}`}
              className="pt-8 first:pt-0 space-y-3 scroll-mt-24"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-md bg-secondary border border-border text-[11px] font-mono font-bold text-foreground">
                  Section {sec.number}
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {sec.title}
                </h2>
              </div>

              {/* 3-4 Lines Substantial Paragraph */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed sm:leading-[1.75] font-normal text-pretty">
                {sec.paragraph}
              </p>

              {sec.keyPoints && (
                <div className="pt-2">
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-foreground font-medium">
                    {sec.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-card border border-border shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug text-muted-foreground text-[11px]">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Legal Advisory & Help Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-secondary text-foreground border border-border">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Questions Regarding Our Terms?</h3>
              <p className="text-xs text-muted-foreground">
                Our legal and security officers are available to assist with contract questions, organizational pilots, and CPA grants.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
            <a
              href="mailto:legal@moneycommand.ca"
              className="px-4 py-2 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Legal & Compliance
            </a>
            <Link
              href="/privacy"
              className="px-4 py-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border font-medium transition-colors"
            >
              Review Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-xs text-muted-foreground font-mono space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Link href="/terms" className="text-foreground underline">Terms of Service</Link>
          <span>&middot;</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span>&middot;</span>
          <Link href="/compliance" className="hover:text-foreground transition-colors">Security & Compliance</Link>
        </div>
        <p>&copy; 2026 Money Command Technologies Inc. Ontario, Canada. All rights reserved.</p>
      </footer>
    </div>
  );
}
