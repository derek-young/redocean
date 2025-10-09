// This file is auto-generated. Do not edit manually.
// Generated from schema.prisma by running `npm run generate:types` in the backend directory

import type { AccountType, ActiveStatus, BankAccountType, BillStatus, ContactType, DocStatus, IdentityProvider, ItemType, InvoiceStatus, PaymentMethod, Role, TransactionType } from "./prismaEnums";

export interface UserModel {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface IdentityModel {
  id: string;
  provider: IdentityProvider;
  externalUid: string;
  userId: string;
}

export interface TenantModel {
  id: string;
  name: string;
  subdomain: string;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface UserTenantMembershipModel {
  id: string;
  tenantId: string;
  userId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerModel {
  id: string;
  name: string;
  status: ActiveStatus;
  tenantId: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface VendorModel {
  id: string;
  name: string;
  status: ActiveStatus;
  tenantId: string;
  createdAt: Date;
  deletedAt?: Date;
  updatedAt: Date;
}

export interface AddressModel {
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

export interface ContactModel {
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

export interface AccountModel {
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

export interface JournalEntryModel {
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

export interface TransactionModel {
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

export interface FixedAssetModel {
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

export interface FiscalYearModel {
  id: string;
  isClosed: boolean;
  startDate: Date;
  endDate: Date;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceModel {
  id: string;
  createdById: string;
  currency: string;
  customerId: string;
  date: Date;
  discount: number;
  dueDate?: Date;
  salesTax: number;
  invoiceNumber: string;
  memo?: string;
  status: InvoiceStatus;
  tenantId: string;
  total: number;
  createdAt: Date;
  postedAt?: Date;
  updatedAt: Date;
}

export interface InvoiceLineModel {
  id: string;
  invoiceId: string;
  description?: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  itemId?: string;
  taxRateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemModel {
  id: string;
  name: string;
  sku?: string;
  tenantId: string;
  category?: string;
  type: ItemType;
  price?: number;
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillModel {
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

export interface BillLineModel {
  id: string;
  billId: string;
  description: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  taxRateId?: string;
}

export interface PaymentModel {
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

export interface PaymentAllocationModel {
  id: string;
  amount: number;
  billId?: string;
  invoiceId?: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxRateModel {
  id: string;
  name: string;
  rate: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccountModel {
  id: string;
  name: string;
  tenantId: string;
  type: BankAccountType;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankStatementModel {
  id: string;
  bankAccountId: string;
  statementDate: Date;
  startingBalance: number;
  endingBalance: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankStatementLineModel {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  statementId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReconciliationModel {
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

export interface AttachmentModel {
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

export interface AuditLogModel {
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

export interface SequenceModel {
  id: string;
  name: string;
  nextValue: number;
  prefix?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

