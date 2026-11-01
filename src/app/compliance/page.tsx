'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import MoneyCommandLogo from '@/components/MoneyCommandLogo';
import { 
  ShieldCheck, 
  Database, 
  ArrowLeft, 
  Printer, 
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  Server,
  Activity
} from 'lucide-react';

interface LegalSection {
  number: string;
  title: string;
  paragraph: string;
  keyPoints?: string[];
}

const COMPLIANCE_SECTIONS: LegalSection[] = [
  {
    number: '01',
    title: 'Institutional-Grade Security Philosophy',
    paragraph: 'Money Command is engineered around defense-in-depth principles, providing founders, accountants, and commercial enterprises with the highest standards of financial data integrity and security. Our architecture enforces strict segregation between presentation interfaces, AI extraction pipelines, and immutable double-entry database layers, ensuring deterministic accounting accuracy and enterprise-grade resilience.',
    keyPoints: ['Defense-in-depth multi-layered security architecture', 'Strict isolation between user interfaces and database kernels', 'Zero single-point-of-failure infrastructure design']
  },
  {
    number: '02',
    title: 'Row-Level Security (RLS) and Tenant Isolation',
    paragraph: 'Our relational PostgreSQL database implements kernel-level Row-Level Security (RLS) policies across all twenty-eight database tables to ensure absolute tenant isolation. Every query executed across webhooks, client dashboards, and accountant portals requires an authenticated cryptographic tenant token, preventing cross-tenant leakage or unauthorized ledger inspection even at the raw database query layer.',
    keyPoints: ['RLS policies enforced at PostgreSQL engine layer on 28 tables', 'Every transaction and proposal strictly bounded by tenant UUIDs', 'Zero possibility of cross-organization or cross-entity record visibility']
  },
  {
    number: '03',
    title: 'Deterministic Double-Entry Ledger Invariant (MC-001)',
    paragraph: 'Unlike probabilistic spreadsheet tools, Money Command enforces the classical accounting equation where the sum of debits must mathematically equal the sum of credits for every posted journal. All monetary balances are stored exclusively in integer minor units (CAD cents) to eradicate floating-point rounding errors, backed by database constraints that immediately reject unbalanced transaction candidates.',
    keyPoints: ['Sum of debits must mathematically equal sum of credits', 'Integer-cent storage completely eliminates floating-point drift', 'Automated release gates guarantee zero unreconciled posted journals']
  },
  {
    number: '04',
    title: 'Meta WhatsApp Cloud HMAC-SHA256 Signature Validation',
    paragraph: 'Every inbound payload received from Meta’s WhatsApp Business API must pass strict cryptographic HMAC-SHA256 signature verification matching our registered App Secret before parsing begins. Payloads presenting invalid signatures, expired timestamps, or unauthorized sender origins are instantly dropped with HTTP 403 Forbidden responses, immunizing the platform against spoofing and injection vectors.',
    keyPoints: ['Mandatory x-hub-signature-256 validation on all incoming webhooks', 'Unauthenticated or spoofed messaging payloads immediately rejected', 'Direct verification against Meta Cloud enterprise secret credentials']
  },
  {
    number: '05',
    title: 'Replay Attack Protection and Idempotent Event Logs',
    paragraph: 'To prevent duplicate billing entries or double-posted transactions, our ingest pipeline maintains a deduplicated registry of unique provider message identifiers (wamid) in an indexed source events table. Inbound duplicate webhooks caused by network retries or carrier replay are identified immediately, validated against existing database records, and acknowledged with zero redundant proposals or ledger mutations.',
    keyPoints: ['Deduplication against unique Meta wamid message identifiers', 'Zero duplicate double-entry proposals created from network retries', 'Historical source event registry maintains complete raw inbound logs']
  },
  {
    number: '06',
    title: 'Append-Only Consequential Audit Stream',
    paragraph: 'All consequential mutations—including transaction confirmations, reversing journal entries, feature flag modifications, and accountant review certifications—are captured in an append-only audit log. Each audit record archives the operator identifier, timestamp, mutated entity ID, before-and-after state diffs, and cryptographic hash fingerprints, establishing an evidentiary paper trail for forensic verification.',
    keyPoints: ['Immutable audit trail records all consequential state transitions', 'Before-and-after JSONB diffs preserved for forensic verification', 'SHA-256 hash chaining prevents retrospective log tampering']
  },
  {
    number: '07',
    title: 'Zero-Trust Role-Based Access Control (RBAC)',
    paragraph: 'Money Command enforces granular Role-Based Access Controls governing distinct permissions for Owners, Administrators, Standard Members, and Accountant Viewers across all routes. Privileged administrative dashboards and system diagnostic consoles are guarded by server-side and client-side authentication barriers that reject unverified sessions before any UI or data payload is transmitted.',
    keyPoints: ['Strict role hierarchy: Owner, Admin, Member, Accountant Viewer', 'Multi-factor authentication required on privileged administrative suites', 'Zero unauthorized UI rendering or data transmission before auth verification']
  },
  {
    number: '08',
    title: 'CRA Statutory Tax Schedule Readiness',
    paragraph: 'Our Ontario tax engine structures deductible business expenses in exact alignment with Canada Revenue Agency guidelines, separating input tax credits (13% HST) from net operational expenses. All exported accountant workpapers and T2125 schedule candidates maintain bidirectional cryptographic links to uploaded receipt documents, providing full provenance in the event of a CRA desk review or tax audit.',
    keyPoints: ['Automated separation of Ontario 13% HST input tax credits (ITCs)', 'Exact alignment with CRA T2125 business expense category codes', 'Bidirectional provenance linking journals to encrypted receipt images']
  },
  {
    number: '09',
    title: 'Data Encryption at Rest and in Transit',
    paragraph: 'Customer data, encrypted credentials, and receipt attachments are protected both in transit across public telecommunications networks and at rest in high-availability database clusters. We enforce TLS 1.3 with Perfect Forward Secrecy for all web and API connections, combined with AES-GCM-256 encryption across storage volumes, automated database snapshots, and persistent object storage repositories.',
    keyPoints: ['TLS 1.3 encryption with Perfect Forward Secrecy across all endpoints', 'AES-GCM-256 encryption applied to databases, vaults, and backups', 'Automated key rotation managed via hardware security modules (HSM)']
  },
  {
    number: '10',
    title: 'Third-Party Bill Negotiation and Cancellation Boundaries',
    paragraph: 'Automated actions that interact with external service providers operate strictly within user-defined authorization boundaries governed by cryptographic terms-hash approvals. The Action Orchestrator cannot unilaterally agree to contracts, incur penalties, or submit binding cancellations without an explicit step-up authorization token generated by the verified account owner.',
    keyPoints: ['Cryptographic terms_hash validation on all automated actions', 'Action Orchestrator cannot execute contracts without step-up consent', 'Complete transparency of early exit fees, terms, and billing adjustments']
  },
  {
    number: '11',
    title: 'Continuous Vulnerability Assessment and Penetration Testing',
    paragraph: 'Our codebase, dependencies, and infrastructure undergo continuous automated static code analysis, software bill of materials (SBOM) scanning, and scheduled third-party penetration audits. Vulnerabilities identified in dependencies or API endpoints are triaged according to CVSS severity rankings, with critical operational patches deployed through our zero-downtime continuous integration pipeline.',
    keyPoints: ['Automated static application security testing (SAST) in CI/CD pipeline', 'Software Bill of Materials (SBOM) dependency vulnerability scans', 'Third-party penetration testing and formal remediation verification']
  },
  {
    number: '12',
    title: 'Business Continuity, High Availability, and Disaster Recovery',
    paragraph: 'Money Command operates on geo-redundant Canadian infrastructure with automated multi-zone failover, point-in-time database recovery, and continuous read-replica synchronization. In the event of primary zone degradation, our automated failover routines restore transactional processing within minutes, ensuring continuous uninterrupted bookkeeping access for Canadian founders and businesses.',
    keyPoints: ['Multi-zone geo-redundant hosting in Canadian enterprise centers', 'Automated point-in-time database recovery with minute-level RPO', 'Zero-data-loss failover architecture maintains uninterrupted service']
  }
];

export default function CompliancePage() {
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
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Security, Compliance & Data Governance
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Security & Compliance
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Institutional-grade security protocols, double-entry invariants, and statutory Canadian CRA readiness standards.
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

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-card border border-border space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Row-Level Security</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              PostgreSQL kernel isolation across 28 production tables with cryptographic tenant context.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Double-Entry Core</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mathematical equilibrium where debits equal credits with zero integer minor unit float drift.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>CRA Tax Ready</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Full T2125 and Ontario 13% HST schedule alignment with immutable receipt provenance.
            </p>
          </div>
        </div>

        {/* Quick Table of Contents Jump Grid */}
        <div className="p-5 sm:p-6 rounded-3xl bg-secondary/40 border border-border space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">
            Table of Contents & Quick Navigation
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {COMPLIANCE_SECTIONS.map((sec) => (
              <a
                key={sec.number}
                href={`#compliance-sec-${sec.number}`}
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
          {COMPLIANCE_SECTIONS.map((sec) => (
            <section
              key={sec.number}
              id={`compliance-sec-${sec.number}`}
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

        {/* Security Assessment & Whitepaper Inquiries Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-secondary text-foreground border border-border">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Security Audit Reports & CPA Grants</h3>
              <p className="text-xs text-muted-foreground">
                Enterprises, accelerators, and accounting firms may request our full security whitepaper and architectural audits.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
            <a
              href="mailto:security@moneycommand.ca"
              className="px-4 py-2 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Request Compliance Packet
            </a>
            <Link
              href="/terms"
              className="px-4 py-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 border border-border font-medium transition-colors"
            >
              Review Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-xs text-muted-foreground font-mono space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span>&middot;</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span>&middot;</span>
          <Link href="/compliance" className="text-foreground underline">Security & Compliance</Link>
        </div>
        <p>&copy; 2026 Money Command Technologies Inc. Ontario, Canada. All rights reserved.</p>
      </footer>
    </div>
  );
}
