// This file is auto-generated. Do not edit manually.
// Generated from schema.prisma by running `npm run generate:types` in the backend directory

export enum AccountType {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  EQUITY = "EQUITY",
  REVENUE = "REVENUE",
  EXPENSE = "EXPENSE",
}

export enum ActiveStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum BankAccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  OTHER = "OTHER",
}

export enum BillStatus {
  DRAFT = "DRAFT",
  RECEIVED = "RECEIVED",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  VOID = "VOID",
}

export enum ContactType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

export enum DocStatus {
  DRAFT = "DRAFT",
  APPROVED = "APPROVED",
  POSTED = "POSTED",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  VOID = "VOID",
}

export enum IdentityProvider {
  FIREBASE = "FIREBASE",
  AUTH0 = "AUTH0",
  SAML = "SAML",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  VOID = "VOID",
}

export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  CHECK = "CHECK",
  ACH = "ACH",
}

export enum Role {
  ADMIN = "ADMIN",
  AUDITOR = "AUDITOR",
}

export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

