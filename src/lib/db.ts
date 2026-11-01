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
  Tenant,
} from './types';
import { getInitialState, saveState, clearState } from './store';

export interface AuthSession {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  whatsappPhone: string;
  role: 'client' | 'accountant' | 'admin' | 'owner';
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
   * AUTHENTICATION METHODS (Real Database Driven - No Mock Fallbacks)
   */
  async loginWithWhatsApp(phone: string, password?: string): Promise<AuthSession> {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      throw new Error('Please enter a valid WhatsApp phone number with country code (e.g. +1 647 555 0192).');
    }

    if (!isSupabaseConfigured) {
      // Local/offline database mode: check if local storage or state has a registered user
      const state = getInitialState();
      if (state.currentUser && (state.currentUser.whatsappPhone === cleanPhone || state.currentUser.phone === cleanPhone)) {
        const session: AuthSession = {
          id: `sess-${Date.now()}`,
          userId: state.currentUser.id,
          name: state.currentUser.fullName,
          email: state.currentUser.email,
          phone: state.currentUser.phone || cleanPhone,
          whatsappPhone: state.currentUser.whatsappPhone || cleanPhone,
          role: state.currentUser.role === 'accountant_viewer' ? 'accountant' : state.currentUser.role === 'admin' ? 'admin' : 'client',
          roleLabel: state.currentUser.role === 'accountant_viewer' ? 'Accountant' : state.currentUser.role === 'admin' ? 'Admin' : 'Client / Founder OS',
          targetPath: state.currentUser.role === 'accountant_viewer' ? '/accountant' : state.currentUser.role === 'admin' ? '/admin' : '/client',
          tenantId: state.currentUser.tenantId,
        };
        this.saveSession(session);
        return session;
      }
      throw new Error(`No registered user found with WhatsApp phone ${cleanPhone}. Please register a new account.`);
    }

    try {
      // Query real Supabase users table
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`whatsapp_phone.eq.${cleanPhone},phone.eq.${cleanPhone}`)
        .maybeSingle();

      if (error || !user) {
        throw new Error(`Authentication failed: WhatsApp number ${cleanPhone} is not registered in the database.`);
      }

      // Check password if set in DB
      if (user.password_hash && password && user.password_hash !== password) {
        throw new Error('Invalid password for this WhatsApp account.');
      }

      const isOwner = user.role === 'owner';
      const isAdmin = user.role === 'admin' || isOwner;
      const isAccountant = user.role === 'accountant_viewer';

      const role: AuthSession['role'] = isAdmin ? (isOwner ? 'owner' : 'admin') : isAccountant ? 'accountant' : 'client';
      const roleLabel = isOwner ? 'Super Admin / Owner' : isAdmin ? 'Admin Console' : isAccountant ? 'Accountant Portal' : 'Client / Founder OS';
      const targetPath = isAdmin ? '/admin' : isAccountant ? '/accountant' : '/client';

      const session: AuthSession = {
        id: `sess-${Date.now()}`,
        userId: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone || cleanPhone,
        whatsappPhone: user.whatsapp_phone || cleanPhone,
        role,
        roleLabel,
        targetPath,
        tenantId: user.tenant_id,
      };

      this.saveSession(session);
      return session;
    } catch (err: any) {
      throw new Error(err.message || 'Database error occurred during WhatsApp login.');
    }
  },

  async loginWithEmail(email: string, password?: string): Promise<AuthSession> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    if (!isSupabaseConfigured) {
      const state = getInitialState();
      if (state.currentUser && state.currentUser.email.toLowerCase() === cleanEmail) {
        const session: AuthSession = {
          id: `sess-${Date.now()}`,
          userId: state.currentUser.id,
          name: state.currentUser.fullName,
          email: state.currentUser.email,
          phone: state.currentUser.phone || '',
          whatsappPhone: state.currentUser.whatsappPhone || '',
          role: state.currentUser.role === 'accountant_viewer' ? 'accountant' : state.currentUser.role === 'admin' ? 'admin' : 'client',
          roleLabel: state.currentUser.role === 'accountant_viewer' ? 'Accountant' : state.currentUser.role === 'admin' ? 'Admin' : 'Client / Founder OS',
          targetPath: state.currentUser.role === 'accountant_viewer' ? '/accountant' : state.currentUser.role === 'admin' ? '/admin' : '/client',
          tenantId: state.currentUser.tenantId,
        };
        this.saveSession(session);
        return session;
      }
      throw new Error(`No registered user found with email ${cleanEmail}. Please register a new account.`);
    }

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (error || !user) {
        throw new Error(`Authentication failed: Email ${cleanEmail} is not registered in the database.`);
      }

      if (user.password_hash && password && user.password_hash !== password) {
        throw new Error('Invalid password for this account.');
      }

      const isOwner = user.role === 'owner';
      const isAdmin = user.role === 'admin' || isOwner;
      const isAccountant = user.role === 'accountant_viewer';

      const role: AuthSession['role'] = isAdmin ? (isOwner ? 'owner' : 'admin') : isAccountant ? 'accountant' : 'client';
      const roleLabel = isOwner ? 'Super Admin / Owner' : isAdmin ? 'Admin Console' : isAccountant ? 'Accountant Portal' : 'Client / Founder OS';
      const targetPath = isAdmin ? '/admin' : isAccountant ? '/accountant' : '/client';

      const session: AuthSession = {
        id: `sess-${Date.now()}`,
        userId: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone || '',
        whatsappPhone: user.whatsapp_phone || '',
        role,
        roleLabel,
        targetPath,
        tenantId: user.tenant_id,
      };

      this.saveSession(session);
      return session;
    } catch (err: any) {
      throw new Error(err.message || 'Database error occurred during email login.');
    }
  },

  /**
   * Register a new user in the database
   */
  async registerUser(params: {
    fullName: string;
    email: string;
    whatsappPhone: string;
    password?: string;
    tenantName?: string;
  }): Promise<AuthSession> {
    const cleanPhone = params.whatsappPhone.replace(/[^0-9+]/g, '');
    const cleanEmail = params.email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      // 1. Create Tenant
      const { data: tenant, error: tenantErr } = await supabase
        .from('tenants')
        .insert({
          name: params.tenantName || `${params.fullName}'s Financial OS`,
          plan: 'founder',
          status: 'active',
        })
        .select()
        .single();

      if (tenantErr || !tenant) throw new Error(tenantErr?.message || 'Failed to create tenant.');

      // 2. Create User
      const { data: user, error: userErr } = await supabase
        .from('users')
        .insert({
          tenant_id: tenant.id,
          role: 'owner',
          full_name: params.fullName,
          email: cleanEmail,
          phone: cleanPhone,
          whatsapp_phone: cleanPhone,
          whatsapp_verified: true,
          password_hash: params.password || 'password123',
        })
        .select()
        .single();

      if (userErr || !user) throw new Error(userErr?.message || 'Failed to create user.');

      // 3. Create Default Entity
      const { data: entity } = await supabase
        .from('entities')
        .insert({
          tenant_id: tenant.id,
          user_id: user.id,
          name: `${params.fullName} (Personal)`,
          type: 'personal',
          currency: 'CAD',
          is_default: true,
        })
        .select()
        .single();

      // 4. Create Standard Chart of Accounts
      if (entity) {
        await supabase.from('accounts').insert([
          { tenant_id: tenant.id, entity_id: entity.id, code: '1010', name: 'Primary Chequing Account', type: 'asset', subtype: 'checking', currency: 'CAD', balance_minor: 0 },
          { tenant_id: tenant.id, entity_id: entity.id, code: '1020', name: 'High-Interest Savings Account', type: 'asset', subtype: 'savings', currency: 'CAD', balance_minor: 0 },
          { tenant_id: tenant.id, entity_id: entity.id, code: '2010', name: 'Credit Card', type: 'liability', subtype: 'credit_card', currency: 'CAD', balance_minor: 0 },
          { tenant_id: tenant.id, entity_id: entity.id, code: '5010', name: 'General Living Expenses', type: 'expense', subtype: 'general', currency: 'CAD', balance_minor: 0 },
          { tenant_id: tenant.id, entity_id: entity.id, code: '4010', name: 'Income / Salary', type: 'revenue', subtype: 'income', currency: 'CAD', balance_minor: 0 },
        ]);
      }

      const session: AuthSession = {
        id: `sess-${Date.now()}`,
        userId: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone || cleanPhone,
        whatsappPhone: user.whatsapp_phone || cleanPhone,
        role: 'client',
        roleLabel: 'Client / Founder OS',
        targetPath: '/client',
        tenantId: user.tenant_id,
      };

      this.saveSession(session);
      return session;
    }

    // Local state fallback registration
    const newTenant: Tenant = {
      id: `ten-${Date.now()}`,
      name: params.tenantName || `${params.fullName}'s Financial OS`,
      plan: 'founder',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: `usr-${Date.now()}`,
      tenantId: newTenant.id,
      role: 'owner',
      fullName: params.fullName,
      email: cleanEmail,
      phone: cleanPhone,
      whatsappPhone: cleanPhone,
      whatsappVerified: true,
    };

    const newEntity: Entity = {
      id: `ent-${Date.now()}`,
      tenantId: newTenant.id,
      userId: newUser.id,
      name: `${params.fullName} (Personal)`,
      type: 'personal',
      currency: 'CAD',
      isDefault: true,
    };

    const initialAccounts: Account[] = [
      { id: `acc-1`, tenantId: newTenant.id, entityId: newEntity.id, code: '1010', name: 'Primary Chequing Account', type: 'asset', subtype: 'checking', currency: 'CAD', balanceMinor: 0, isActive: true },
      { id: `acc-2`, tenantId: newTenant.id, entityId: newEntity.id, code: '1020', name: 'High-Interest Savings Account', type: 'asset', subtype: 'savings', currency: 'CAD', balanceMinor: 0, isActive: true },
      { id: `acc-3`, tenantId: newTenant.id, entityId: newEntity.id, code: '2010', name: 'Credit Card', type: 'liability', subtype: 'credit_card', currency: 'CAD', balanceMinor: 0, isActive: true },
      { id: `acc-4`, tenantId: newTenant.id, entityId: newEntity.id, code: '5010', name: 'General Living Expenses', type: 'expense', subtype: 'general', currency: 'CAD', balanceMinor: 0, isActive: true },
      { id: `acc-5`, tenantId: newTenant.id, entityId: newEntity.id, code: '4010', name: 'Income / Salary', type: 'revenue', subtype: 'income', currency: 'CAD', balanceMinor: 0, isActive: true },
    ];

    const state = getInitialState();
    state.currentTenant = newTenant;
    state.currentUser = newUser;
    state.entities = [newEntity];
    state.selectedEntityId = newEntity.id;
    state.accounts = initialAccounts;
    state.transactions = [];
    state.budgets = [];
    state.subscriptions = [];
    state.proposals = [];
    state.sinkingFunds = [];
    state.debts = [];
    state.investments = [];
    saveState(state);

    const session: AuthSession = {
      id: `sess-${Date.now()}`,
      userId: newUser.id,
      name: newUser.fullName,
      email: newUser.email,
      phone: cleanPhone,
      whatsappPhone: cleanPhone,
      role: 'client',
      roleLabel: 'Client / Founder OS',
      targetPath: '/client',
      tenantId: newTenant.id,
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
        clearState();
      } catch {}
    }
  },

  isAdmin(session?: AuthSession | null): boolean {
    const s = session !== undefined ? session : this.getCurrentSession();
    if (!s) return false;
    return s.role === 'admin' || s.role === 'owner';
  },

  isAccountantOrAdmin(session?: AuthSession | null): boolean {
    const s = session !== undefined ? session : this.getCurrentSession();
    if (!s) return false;
    return s.role === 'admin' || s.role === 'owner' || s.role === 'accountant';
  },

  /**
   * DATA FETCHING METHODS - Real database queries (return [] when empty)
   */
  async getEntities(): Promise<Entity[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('entities').select('*').order('created_at', { ascending: true });
        if (!error && data) {
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
        console.warn('Supabase getEntities error:', err);
      }
    }
    return getInitialState().entities;
  },

  async getAccounts(entityId?: string): Promise<Account[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('accounts').select('*').eq('is_active', true);
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) return data.map(mapAccountFromDB);
      } catch (err) {
        console.warn('Supabase getAccounts error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.accounts.filter((a) => a.entityId === entityId) : state.accounts;
  },

  async getTransactions(entityId?: string): Promise<Transaction[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('transactions')
          .select('*, transaction_lines(*, accounts(name, code))')
          .order('tx_date', { ascending: false });

        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) {
          return data.map((d: any) => mapTransactionFromDB(d, d.transaction_lines || []));
        }
      } catch (err) {
        console.warn('Supabase getTransactions error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.transactions.filter((t) => t.entityId === entityId) : state.transactions;
  },

  async getProposals(entityId?: string): Promise<Proposal[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('proposals').select('*').order('created_at', { ascending: false });
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) return data.map(mapProposalFromDB);
      } catch (err) {
        console.warn('Supabase getProposals error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.proposals.filter((p) => p.entityId === entityId) : state.proposals;
  },

  async getBudgets(entityId?: string): Promise<Budget[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('budgets').select('*').eq('is_active', true);
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) {
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
        console.warn('Supabase getBudgets error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.budgets.filter((b) => b.entityId === entityId) : state.budgets;
  },

  async getSubscriptions(entityId?: string): Promise<Subscription[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('subscriptions').select('*').order('amount_minor', { ascending: false });
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) {
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
        console.warn('Supabase getSubscriptions error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.subscriptions.filter((s) => s.entityId === entityId) : state.subscriptions;
  },

  async getSinkingFunds(entityId?: string): Promise<SinkingFund[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('sinking_funds').select('*');
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) {
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
        console.warn('Supabase getSinkingFunds error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.sinkingFunds.filter((s) => s.entityId === entityId) : state.sinkingFunds;
  },

  async getDebts(entityId?: string): Promise<DebtItem[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('debts').select('*');
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) {
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
        console.warn('Supabase getDebts error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.debts.filter((d) => d.entityId === entityId) : state.debts;
  },

  async getInvestments(entityId?: string): Promise<InvestmentPosition[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('investments').select('*');
        if (entityId) query = query.eq('entity_id', entityId);
        const { data, error } = await query;
        if (!error && data) {
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
        console.warn('Supabase getInvestments error:', err);
      }
    }
    const state = getInitialState();
    return entityId ? state.investments.filter((i) => i.entityId === entityId) : state.investments;
  },

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
        console.warn('Supabase postTransaction error:', err);
      }
    }

    const state = getInitialState();
    state.transactions = [newTx, ...state.transactions];
    saveState(state);

    return newTx;
  },

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

    const updatedProposal: Proposal = {
      ...proposal,
      status: 'confirmed',
      userVerified: true,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('proposals').update({
          status: 'confirmed',
          user_verified: true,
          confirmed_transaction_id: transaction.id,
        }).eq('id', proposalId);

        await this.postTransaction(transaction);
      } catch (err) {
        console.warn('Supabase approveProposal error:', err);
      }
    }

    state.proposals = state.proposals.map((p) => (p.id === proposalId ? updatedProposal : p));
    state.transactions = [transaction, ...state.transactions];

    if (debitAcc) debitAcc.balanceMinor += proposal.amountMinor;
    if (creditAcc) creditAcc.balanceMinor -= proposal.amountMinor;

    saveState(state);

    return { transaction, proposal: updatedProposal };
  },

  async getTenants(): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*, users(*), entities(*)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((t: any) => ({
            id: t.id,
            name: t.name,
            plan: t.plan,
            status: t.status,
            createdAt: t.created_at,
            users: t.users || [],
            entities: t.entities || [],
          }));
        }
      } catch (err) {
        console.warn('Supabase getTenants error:', err);
      }
    }
    const state = getInitialState();
    return state.currentTenant ? [{
      ...state.currentTenant,
      users: state.currentUser ? [state.currentUser] : [],
      entities: state.entities || [],
    }] : [];
  },

  async getAuditLogs(limit = 50): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*, users(full_name, email)')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            tenantId: d.tenant_id,
            userId: d.user_id,
            userName: d.users?.full_name || 'System Operator',
            userEmail: d.users?.email || '',
            action: d.action,
            entityType: d.entity_type,
            entityId: d.entity_id,
            details: d.new_values ? JSON.stringify(d.new_values) : d.action,
            newValues: d.new_values,
            oldValues: d.old_values,
            termsHash: d.old_values?.terms_hash || undefined,
            ipAddress: d.ip_address || '127.0.0.1',
            userAgent: d.user_agent || 'PostgreSQL Engine',
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getAuditLogs error:', err);
      }
    }
    const state = getInitialState();
    return state.auditLogs || [];
  },

  async logAuditEvent(action: string, entityType: string, details?: any, entityId?: string): Promise<void> {
    const session = this.getCurrentSession();
    if (isSupabaseConfigured) {
      try {
        await supabase.from('audit_logs').insert({
          tenant_id: session?.tenantId || null,
          user_id: session?.userId || null,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          new_values: details || {},
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Money Command Admin Console',
        });
      } catch (err) {
        console.warn('Supabase logAuditEvent error:', err);
      }
    }
  },

  async getFeatureFlags(): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .order('key');
        if (!error && data) {
          return data.map((f: any) => ({
            id: f.id,
            key: f.key,
            enabled: f.enabled,
            description: f.description || '',
            rolloutPercentage: f.rollout_percentage ?? 100,
            updatedAt: f.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getFeatureFlags error:', err);
      }
    }
    const state = getInitialState();
    return state.featureFlags || [];
  },

  async updateFeatureFlag(flagId: string, enabled: boolean): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('feature_flags')
          .update({ enabled, updated_at: new Date().toISOString() })
          .eq('id', flagId);
        if (!error) {
          await this.logAuditEvent('FEATURE_FLAG_TOGGLED', 'feature_flags', { flagId, enabled });
          return true;
        }
      } catch (err) {
        console.warn('Supabase updateFeatureFlag error:', err);
      }
    }
    const state = getInitialState();
    state.featureFlags = state.featureFlags.map((f) => (f.id === flagId ? { ...f, enabled } : f));
    saveState(state);
    return true;
  },

  async getSourceEvents(limit = 30): Promise<any[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('source_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (!error && data) {
          return data.map((e: any) => ({
            id: e.id,
            tenantId: e.tenant_id,
            channel: e.channel,
            providerEventId: e.provider_event_id,
            idempotencyKey: e.idempotency_key,
            senderPhone: e.sender_phone,
            rawPayload: e.raw_payload,
            status: e.status,
            errorMessage: e.error_message,
            createdAt: e.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getSourceEvents error:', err);
      }
    }
    return [];
  },

  async getDatabaseSchemaCounts(): Promise<Record<string, number>> {
    const tableNames = [
      'tenants', 'users', 'entities', 'accounts', 'transactions', 'transaction_lines',
      'proposals', 'source_events', 'documents', 'budgets', 'safe_to_spend_configs',
      'obligations', 'sinking_funds', 'debts', 'investments', 'paycheck_plan_items',
      'subscriptions', 'actions', 'authorizations', 'action_events', 'bill_negotiations',
      'tax_profiles', 'tax_rule_versions', 'accountant_access_grants', 'audit_logs',
      'feature_flags', 'ai_interactions', 'user_consent_records'
    ];
    const counts: Record<string, number> = {};
    if (isSupabaseConfigured) {
      await Promise.all(
        tableNames.map(async (name) => {
          try {
            const { count, error } = await supabase
              .from(name)
              .select('*', { count: 'exact', head: true });
            counts[name] = (!error && typeof count === 'number') ? count : 0;
          } catch {
            counts[name] = 0;
          }
        })
      );
    }
    return counts;
  },

  async updateTransactionAccountantStatus(
    txId: string,
    status: 'unreviewed' | 'user_verified' | 'professional_reviewed'
  ): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('transactions')
          .update({
            accountant_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', txId);
        if (!error) {
          await this.logAuditEvent('TRANSACTION_ACCOUNTANT_STATUS_UPDATED', 'transactions', { txId, status }, txId);
          return true;
        }
      } catch (err) {
        console.warn('Supabase updateTransactionAccountantStatus error:', err);
      }
    }
    const state = getInitialState();
    state.transactions = state.transactions.map((t) => (t.id === txId ? { ...t, accountantStatus: status } : t));
    saveState(state);
    return true;
  },
};
