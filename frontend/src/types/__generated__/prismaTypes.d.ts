// This file is auto-generated. Do not edit manually.
// Generated from schema.prisma by running `npm run generate:types` in the backend directory

import type { AccountType, ActiveStatus, BankAccountType, BillStatus, ContactType, DocStatus, IdentityProvider, InvoiceStatus, PaymentMethod, Role, TransactionType } from "./prismaEnums";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface Identity {
  id: string;
  provider: IdentityProvider;
  externalUid: string;
  userId: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface UserTenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  status: ActiveStatus;
  tenantId: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  status: ActiveStatus;
  tenantId: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  customerId?: string;
  isPrimary: boolean;
  vendorId?: string;
  street1: string;
  street2?: string;
  street3?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  customerId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: ActiveStatus;
  type: ContactType;
  vendorId?: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  code: string;
  description?: string;
  name: string;
  status: ActiveStatus;
  tenantId: string;
  type: AccountType;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
  parentId?: string;
}

export interface JournalEntry {
  id: string;
  createdById?: string;
  date: Date;
  entryNumber: string;
  memo?: string;
  postedAt?: Date;
  reference?: string;
  status?: DocStatus;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  bankAccountId?: string;
  billId?: string;
  invoiceId?: string;
  paymentId?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount?: number;
  currency: string;
  description?: string;
  journalEntryId: string;
  tenantId: string;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export interface FixedAsset {
  id: string;
  accountId: string;
  accumulatedAccountId: string;
  cost: number;
  depreciationMethod?: string;
  name: string;
  purchaseDate: Date;
  salvage: number;
  tenantId: string;
  usefulLifeMonths: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FiscalYear {
  id: string;
  isClosed: boolean;
  startDate: Date;
  endDate: Date;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  createdById: string;
  currency: string;
  customerId: string;
  date: Date;
  dueDate?: Date;
  invoiceNumber: string;
  memo?: string;
  status: InvoiceStatus;
  tenantId: string;
  total: number;
  createdAt: Date;
  postedAt?: Date;
  updatedAt: Date;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  description?: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  taxRateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  createdById: string;
  tenantId: string;
  vendorId: string;
  billNumber: string;
  date: Date;
  dueDate?: Date;
  status: BillStatus;
  totalAmount: number;
  balanceDue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillLine {
  id: string;
  billId: string;
  description: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  taxRateId?: string;
}

export interface Payment {
  id: string;
  amount: number;
  bankAccountId?: string;
  createdById: string;
  currency: string;
  date: Date;
  method: PaymentMethod;
  note?: string;
  reference?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentAllocation {
  id: string;
  amount: number;
  billId?: string;
  invoiceId?: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccount {
  id: string;
  name: string;
  tenantId: string;
  type: BankAccountType;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankStatement {
  id: string;
  bankAccountId: string;
  statementDate: Date;
  startingBalance: number;
  endingBalance: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankStatementLine {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  statementId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reconciliation {
  id: string;
  bankAccountId: string;
  clearedBalance: number;
  periodStart: Date;
  periodEnd: Date;
  statementEndingBalance: number;
  tenantId: string;
  createdAt: Date;
  reconciledAt?: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  createdById: string;
  filename: string;
  mimeType?: string;
  size?: number;
  tenantId: string;
  url: string;
  billId?: string;
  invoiceId?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  objectType: string;
  objectId: string;
  oldValue?: any;
  newValue?: any;
  tenantId: string;
  userId: string;
  createdAt: Date;
}

export interface Sequence {
  id: string;
  name: string;
  nextValue: number;
  prefix?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

