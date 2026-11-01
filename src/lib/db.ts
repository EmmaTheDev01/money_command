import { supabase, isSupabaseConfigured } from './supabase';
import {
  Entity,
  Account,
  Transaction,
  Proposal,
  Budget,
  Subscription,
  SinkingFund,
  DebtItem,
  InvestmentPosition,
  PaycheckPlanItem,
  User,
} from './types';
import { getInitialState, saveState, AppState } from './store';

/**
 * MONEY COMMAND AUTHORITATIVE DATABASE SERVICE
 * 
 * Interacts with Supabase PostgreSQL double-entry ledger tables when configured,
 * or transparently interacts with the persistent local store when offline/demo.
 */

export interface AuthSession {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  whatsappPhone: string;
  role: 'client' | 'accountant' | 'admin';
  roleLabel: string;
  targetPath: string;
  tenantId: string;
  token?: string;
}

const SESSION_STORAGE_KEY = 'money_command_active_session';

// Helper to convert snake_case DB row to camelCase
function mapAccountFromDB(row: any): Account {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    entityId: row.entity_id,
    code: row.code,
    name: row.name,
    type: row.type,
    subtype: row.subtype,
    currency: row.currency || 'CAD',
    balanceMinor: Number(row.balance_minor || 0),
    isActive: row.is_active ?? true,
  };
}

function mapTransactionFromDB(row: any, lines: any[] = []): Transaction {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    entityId: row.entity_id,
    type: row.type,
    status: row.status,
    currency: row.currency || 'CAD',
    totalMinor: Number(row.total_minor),
    txDate: row.tx_date,
    description: row.description,
    merchant: row.merchant,
    category: row.category,
    source: row.source,
    sourceId: row.source_id,
    accountantStatus: row.accountant_status || 'unreviewed',
    lines: lines.map((l) => ({
      id: l.id,
      transactionId: l.transaction_id,
      accountId: l.account_id,
      accountName: l.accounts?.name || 'Account',
      accountCode: l.accounts?.code || '0000',
      debitMinor: Number(l.debit_minor || 0),
      creditMinor: Number(l.credit_minor || 0),
      currency: l.currency || 'CAD',
      description: l.description,
      category: l.category,
      taxRate: l.tax_rate,
      taxAmountMinor: l.tax_amount_minor ? Number(l.tax_amount_minor) : undefined,
    })),
    createdAt: row.created_at,
  };
}

function mapProposalFromDB(row: any): Proposal {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    entityId: row.entity_id,
    userId: row.user_id,
    type: row.type,
    amountMinor: Number(row.amount_minor),
    currency: row.currency || 'CAD',
    merchant: row.merchant,
    category: row.category,
    proposedDebitAccountId: row.proposed_debit_account_id,
    proposedCreditAccountId: row.proposed_credit_account_id,
    txDate: row.tx_date,
    taxRelevance: row.tax_relevance || 'none',
    confidence: Number(row.confidence || 0.95),
    userVerified: row.user_verified ?? false,
    status: row.status,
    rawText: row.extraction_details?.raw_text,
    createdAt: row.created_at,
  };
}

export const db = {
  /**
   * AUTHENTICATION METHODS
   */
  async loginWithWhatsApp(phone: string, _password: string): Promise<AuthSession> {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const state = getInitialState();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, tenants(*)')
          .or(`whatsapp_phone.eq.${cleanPhone},phone.eq.${cleanPhone}`)
          .single();

        if (!error && data) {
          const session: AuthSession = {
            id: `sess-${Date.now()}`,
            userId: data.id,
            name: data.full_name,
            email: data.email,
            phone: data.phone || cleanPhone,
            whatsappPhone: data.whatsapp_phone || cleanPhone,
            role: data.role === 'accountant_viewer' ? 'accountant' : data.role === 'admin' ? 'admin' : 'client',
            roleLabel: data.role === 'accountant_viewer' ? 'Accountant' : data.role === 'admin' ? 'Admin' : 'Client / Founder OS',
            targetPath: data.role === 'accountant_viewer' ? '/accountant' : data.role === 'admin' ? '/admin' : '/client',
            tenantId: data.tenant_id,
          };
          this.saveSession(session);
          return session;
        }
      } catch (err) {
        console.warn('Supabase WhatsApp login fallback:', err);
      }
    }

    // Default authenticated session with Alex Tremblay
    const session: AuthSession = {
      id: `sess-${Date.now()}`,
      userId: state.currentUser.id,
      name: state.currentUser.fullName || 'Alex Tremblay',
      email: state.currentUser.email || 'alex@mapleridge.dev',
      phone: cleanPhone || state.currentUser.phone || '+16475550192',
      whatsappPhone: cleanPhone || state.currentUser.whatsappPhone || '+16475550192',
      role: 'client',
      roleLabel: 'Client / Founder OS',
      targetPath: '/client',
      tenantId: state.currentTenant.id,
    };

    this.saveSession(session);
    return session;
  },

  async loginWithEmail(email: string, _password: string): Promise<AuthSession> {
    const cleanEmail = email.trim().toLowerCase();
    const state = getInitialState();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, tenants(*)')
          .ilike('email', cleanEmail)
          .single();

        if (!error && data) {
          const session: AuthSession = {
            id: `sess-${Date.now()}`,
            userId: data.id,
            name: data.full_name,
            email: data.email,
            phone: data.phone || '',
            whatsappPhone: data.whatsapp_phone || '',
            role: data.role === 'accountant_viewer' ? 'accountant' : data.role === 'admin' ? 'admin' : 'client',
            roleLabel: data.role === 'accountant_viewer' ? 'Accountant' : data.role === 'admin' ? 'Admin' : 'Client / Founder OS',
            targetPath: data.role === 'accountant_viewer' ? '/accountant' : data.role === 'admin' ? '/admin' : '/client',
            tenantId: data.tenant_id,
          };
          this.saveSession(session);
          return session;
        }
      } catch (err) {
        console.warn('Supabase Email login fallback:', err);
      }
    }

    const session: AuthSession = {
      id: `sess-${Date.now()}`,
      userId: state.currentUser.id,
      name: state.currentUser.fullName || 'Alex Tremblay',
      email: cleanEmail,
      phone: state.currentUser.phone || '+16475550192',
      whatsappPhone: state.currentUser.whatsappPhone || '+16475550192',
      role: cleanEmail.includes('accountant') ? 'accountant' : cleanEmail.includes('admin') ? 'admin' : 'client',
      roleLabel: cleanEmail.includes('accountant') ? 'Accountant' : cleanEmail.includes('admin') ? 'Admin' : 'Client / Founder OS',
      targetPath: cleanEmail.includes('accountant') ? '/accountant' : cleanEmail.includes('admin') ? '/admin' : '/client',
      tenantId: state.currentTenant.id,
    };

    this.saveSession(session);
    return session;
  },

  saveSession(session: AuthSession) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch {}
    }
  },

  getCurrentSession(): AuthSession | null {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  },

  logout() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {}
    }
  },

  /**
   * Fetch entities for active tenant
   */
  async getEntities(): Promise<Entity[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('entities').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            tenantId: d.tenant_id,
            userId: d.user_id,
            name: d.name,
            type: d.type,
            currency: d.currency,
            taxIdentifier: d.tax_identifier,
            isDefault: d.is_default,
          }));
        }
      } catch (err) {
        console.warn('Supabase getEntities fallback:', err);
      }
    }
    return getInitialState().entities;
  },

  /**
   * Fetch chart of accounts
   */
  async getAccounts(entityId?: string): Promise<Account[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('accounts').select('*').eq('is_active', true);
        if (entityId) {
          query = query.eq('entity_id', entityId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapAccountFromDB);
        }
      } catch (err) {
        console.warn('Supabase getAccounts fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.accounts.filter((a) => a.entityId === entityId) : state.accounts;
  },

  /**
   * Fetch double-entry posted transactions
   */
  async getTransactions(entityId?: string): Promise<Transaction[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('transactions')
          .select('*, transaction_lines(*, accounts(name, code))')
          .order('tx_date', { ascending: false });

        if (entityId) {
          query = query.eq('entity_id', entityId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => mapTransactionFromDB(d, d.transaction_lines || []));
        }
      } catch (err) {
        console.warn('Supabase getTransactions fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.transactions.filter((t) => t.entityId === entityId) : state.transactions;
  },

  /**
   * Fetch pending or reviewed proposals
   */
  async getProposals(entityId?: string): Promise<Proposal[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('proposals').select('*').order('created_at', { ascending: false });
        if (entityId) {
          query = query.eq('entity_id', entityId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapProposalFromDB);
        }
      } catch (err) {
        console.warn('Supabase getProposals fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.proposals.filter((p) => p.entityId === entityId) : state.proposals;
  },

  /**
   * Fetch active budgets with real-time spend aggregation
   */
  async getBudgets(entityId?: string): Promise<Budget[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('budgets').select('*').eq('is_active', true);
        if (entityId) {
          query = query.eq('entity_id', entityId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((b: any) => ({
            id: b.id,
            entityId: b.entity_id,
            category: b.category,
            period: b.period,
            amountMinor: Number(b.amount_minor),
            spentMinor: Number(b.spent_minor || 0),
            alertThresholdPercent: b.alert_threshold_percent,
            currency: b.currency || 'CAD',
          }));
        }
      } catch (err) {
        console.warn('Supabase getBudgets fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.budgets.filter((b) => b.entityId === entityId) : state.budgets;
  },

  /**
   * Fetch subscriptions & recurring obligations
   */
  async getSubscriptions(entityId?: string): Promise<Subscription[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('subscriptions').select('*').order('amount_minor', { ascending: false });
        if (entityId) {
          query = query.eq('entity_id', entityId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            entityId: s.entity_id,
            merchant: s.merchant,
            category: s.category,
            amountMinor: Number(s.amount_minor),
            currency: s.currency || 'CAD',
            frequency: s.frequency,
            status: s.status,
            nextBillingDate: s.next_billing_date,
            lastPriceMinor: Number(s.last_price_minor),
            priceDeltaMinor: Number(s.price_delta_minor || 0),
            annualizedCostMinor: Number(s.annualized_cost_minor),
            cancellationRoute: s.cancellation_route,
            cancellationNotes: s.cancellation_notes,
          }));
        }
      } catch (err) {
        console.warn('Supabase getSubscriptions fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.subscriptions.filter((s) => s.entityId === entityId) : state.subscriptions;
  },

  /**
   * Fetch sinking funds
   */
  async getSinkingFunds(entityId?: string): Promise<SinkingFund[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('sinking_funds').select('*');
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            entityId: d.entity_id,
            name: d.name,
            targetMinor: Number(d.target_minor),
            currentMinor: Number(d.current_minor),
            targetDate: d.target_date,
            category: d.category,
          }));
        }
      } catch (err) {
        console.warn('Supabase getSinkingFunds fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.sinkingFunds.filter((s) => s.entityId === entityId) : state.sinkingFunds;
  },

  /**
   * Fetch debts
   */
  async getDebts(entityId?: string): Promise<DebtItem[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('debts').select('*');
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            entityId: d.entity_id,
            name: d.name,
            type: d.type,
            balanceMinor: Number(d.balance_minor),
            interestRate: Number(d.interest_rate),
            minimumPaymentMinor: Number(d.minimum_payment_minor),
            dueDate: d.due_date,
          }));
        }
      } catch (err) {
        console.warn('Supabase getDebts fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.debts.filter((d) => d.entityId === entityId) : state.debts;
  },

  /**
   * Fetch investment positions
   */
  async getInvestments(entityId?: string): Promise<InvestmentPosition[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('investments').select('*');
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            entityId: d.entity_id,
            symbol: d.symbol,
            name: d.name,
            shares: Number(d.shares),
            costBasisMinor: Number(d.cost_basis_minor),
            currentValueMinor: Number(d.current_value_minor),
            assetClass: d.asset_class,
            returnPercentage: Number(d.return_percentage),
          }));
        }
      } catch (err) {
        console.warn('Supabase getInvestments fallback:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.investments.filter((i) => i.entityId === entityId) : state.investments;
  },

  /**
   * Post a balanced double-entry transaction
   */
  async postTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const newTx: Transaction = {
      ...tx,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('transactions').insert({
          id: newTx.id,
          tenant_id: newTx.tenantId,
          entity_id: newTx.entityId,
          type: newTx.type,
          status: newTx.status,
          currency: newTx.currency,
          total_minor: newTx.totalMinor,
          tx_date: newTx.txDate,
          description: newTx.description,
          merchant: newTx.merchant,
          category: newTx.category,
          source: newTx.source,
          source_id: newTx.sourceId,
          accountant_status: newTx.accountantStatus,
        }).select().single();

        if (!error && data && newTx.lines.length > 0) {
          const linesToInsert = newTx.lines.map((l) => ({
            transaction_id: newTx.id,
            tenant_id: newTx.tenantId,
            account_id: l.accountId,
            debit_minor: l.debitMinor,
            credit_minor: l.creditMinor,
            currency: l.currency,
            description: l.description,
            category: l.category,
          }));
          await supabase.from('transaction_lines').insert(linesToInsert);
        }
      } catch (err) {
        console.warn('Supabase postTransaction fallback:', err);
      }
    }

    // Persist to store
    const state = getInitialState();
    state.transactions = [newTx, ...state.transactions];
    saveState(state);

    return newTx;
  },

  /**
   * Approve a proposal and turn it into a posted double-entry transaction
   */
  async approveProposal(
    proposalId: string, 
    debitAccountId: string, 
    creditAccountId: string
  ): Promise<{ transaction: Transaction; proposal: Proposal }> {
    const state = getInitialState();
    const proposal = state.proposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');

    const debitAcc = state.accounts.find((a) => a.id === debitAccountId);
    const creditAcc = state.accounts.find((a) => a.id === creditAccountId);

    const transaction: Transaction = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}`,
      tenantId: proposal.tenantId,
      entityId: proposal.entityId,
      type: proposal.type,
      status: 'posted',
      currency: proposal.currency,
      totalMinor: proposal.amountMinor,
      txDate: proposal.txDate,
      description: `${proposal.merchant} (${proposal.category})`,
      merchant: proposal.merchant,
      category: proposal.category,
      source: 'whatsapp_text',
      accountantStatus: 'user_verified',
      lines: [
        {
          id: `line-${Date.now()}-1`,
          transactionId: '',
          accountId: debitAccountId,
          accountName: debitAcc?.name || 'Debit Account',
          accountCode: debitAcc?.code || '5000',
          debitMinor: proposal.amountMinor,
          creditMinor: 0,
          currency: proposal.currency,
          description: `${proposal.category} expense`,
          category: proposal.category,
        },
        {
          id: `line-${Date.now()}-2`,
          transactionId: '',
          accountId: creditAccountId,
          accountName: creditAcc?.name || 'Credit Account',
          accountCode: creditAcc?.code || '1010',
          debitMinor: 0,
          creditMinor: proposal.amountMinor,
          currency: proposal.currency,
          description: `Paid via ${creditAcc?.name || 'Checking'}`,
          category: 'Payment',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    transaction.lines.forEach((l) => (l.transactionId = transaction.id));

    // Update proposal status
    const updatedProposal: Proposal = {
      ...proposal,
      status: 'confirmed',
      userVerified: true,
    };

    // If Supabase is configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('proposals').update({
          status: 'confirmed',
          user_verified: true,
          confirmed_transaction_id: transaction.id,
        }).eq('id', proposalId);

        await this.postTransaction(transaction);
      } catch (err) {
        console.warn('Supabase approveProposal fallback:', err);
      }
    }

    // Update local state
    state.proposals = state.proposals.map((p) => (p.id === proposalId ? updatedProposal : p));
    state.transactions = [transaction, ...state.transactions];

    // Adjust balances
    if (debitAcc) debitAcc.balanceMinor += proposal.amountMinor;
    if (creditAcc) creditAcc.balanceMinor -= proposal.amountMinor;

    saveState(state);

    return { transaction, proposal: updatedProposal };
  },
};
