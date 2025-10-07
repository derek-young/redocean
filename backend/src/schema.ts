import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  integer,
  boolean,
  decimal,
  json,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// ===========================================
// HELPER FUNCTIONS
// ===========================================

const cuid = () => createId();

// ===========================================
// ENUMS
// ===========================================

export const accountTypeEnum = pgEnum("AccountType", [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
]);

export const activeStatusEnum = pgEnum("ActiveStatus", ["ACTIVE", "ARCHIVED"]);

export const bankAccountTypeEnum = pgEnum("BankAccountType", [
  "CHECKING",
  "SAVINGS",
  "OTHER",
]);

export const billStatusEnum = pgEnum("BillStatus", [
  "DRAFT",
  "RECEIVED",
  "PARTIALLY_PAID",
  "PAID",
  "VOID",
]);

export const contactTypeEnum = pgEnum("ContactType", ["PRIMARY", "SECONDARY"]);

export const docStatusEnum = pgEnum("DocStatus", [
  "DRAFT",
  "APPROVED",
  "POSTED",
  "PAID",
  "PARTIALLY_PAID",
  "VOID",
]);

export const identityProviderEnum = pgEnum("IdentityProvider", [
  "FIREBASE",
  "AUTH0",
  "SAML",
]);

export const invoiceStatusEnum = pgEnum("InvoiceStatus", [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "VOID",
]);

export const paymentMethodEnum = pgEnum("PaymentMethod", [
  "CASH",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "CHECK",
  "ACH",
]);

export const roleEnum = pgEnum("Role", ["ADMIN", "AUDITOR"]);

export const transactionTypeEnum = pgEnum("TransactionType", [
  "DEBIT",
  "CREDIT",
]);

// ===========================================
// USER & TENANT MANAGEMENT
// ===========================================

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: roleEnum("role").default("ADMIN").notNull(),
  status: activeStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const identities = pgTable(
  "identities",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    provider: identityProviderEnum("provider").notNull(),
    externalUid: text("external_uid").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    providerExternalUidUnique: unique("provider_external_uid_unique").on(
      table.provider,
      table.externalUid
    ),
  })
);

export const tenants = pgTable("tenants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: text("name").notNull(),
  subdomain: text("subdomain").unique().notNull(),
  status: activeStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userTenantMemberships = pgTable(
  "user_tenant_memberships",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userTenantUnique: unique("user_tenant_unique").on(
      table.userId,
      table.tenantId
    ),
  })
);

// ===========================================
// CUSTOMER & VENDOR MANAGEMENT
// ===========================================

export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: text("name").notNull(),
  status: activeStatusEnum("status").default("ACTIVE").notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: text("name").notNull(),
  status: activeStatusEnum("status").default("ACTIVE").notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  customerId: text("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),
  isPrimary: boolean("is_primary").default(false).notNull(),
  vendorId: text("vendor_id").references(() => vendors.id, {
    onDelete: "cascade",
  }),
  street1: text("street1").notNull(),
  street2: text("street2"),
  street3: text("street3"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").default("US").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contacts = pgTable(
  "contacts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    customerId: text("customer_id").references(() => customers.id, {
      onDelete: "cascade",
    }),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    phone: text("phone"),
    status: activeStatusEnum("status").default("ACTIVE").notNull(),
    type: contactTypeEnum("type").default("PRIMARY").notNull(),
    vendorId: text("vendor_id").references(() => vendors.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailVendorCustomerUnique: unique("email_vendor_customer_unique").on(
      table.email,
      table.vendorId,
      table.customerId
    ),
  })
);

// ===========================================
// ACCOUNTING
// ===========================================

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    code: text("code").notNull(),
    description: text("description"),
    name: text("name").notNull(),
    status: activeStatusEnum("status").default("ACTIVE").notNull(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    type: accountTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    parentId: text("parent_id").references((): any => accounts.id, {
      onDelete: "set null",
    }),
  },
  (table) => ({
    codeTenantUnique: unique("code_tenant_unique").on(
      table.code,
      table.tenantId
    ),
  })
);

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    createdById: text("created_by_id").references(() => users.id),
    date: timestamp("date").notNull(),
    entryNumber: text("entry_number").notNull(),
    memo: text("memo"),
    postedAt: timestamp("posted_at"),
    reference: text("reference"),
    status: docStatusEnum("status"),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    bankAccountId: text("bank_account_id").references(
      (): any => bankAccounts.id,
      { onDelete: "set null" }
    ),
    billId: text("bill_id").references((): any => bills.id, {
      onDelete: "set null",
    }),
    invoiceId: text("invoice_id").references((): any => invoices.id, {
      onDelete: "set null",
    }),
    paymentId: text("payment_id").references((): any => payments.id, {
      onDelete: "set null",
    }),
    sourceId: text("source_id"),
    sourceType: text("source_type"),
  },
  (table) => ({
    entryNumberTenantUnique: unique("entry_number_tenant_unique").on(
      table.entryNumber,
      table.tenantId
    ),
    tenantDateIndex: index("tenant_date_index").on(table.tenantId, table.date),
  })
);

export const transactions = pgTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD").notNull(),
  description: text("description"),
  journalEntryId: text("journal_entry_id")
    .notNull()
    .references(() => journalEntries.id),
  tenantId: text("tenant_id").notNull(),
  type: transactionTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fixedAssets = pgTable("fixed_assets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  accumulatedAccountId: text("accumulated_account_id")
    .notNull()
    .references(() => accounts.id),
  cost: decimal("cost", { precision: 12, scale: 2 }).notNull(),
  depreciationMethod: text("depreciation_method"),
  name: text("name").notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  salvage: decimal("salvage", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  usefulLifeMonths: integer("useful_life_months").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fiscalYears = pgTable("fiscal_years", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  isClosed: boolean("is_closed").default(false).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===========================================
// INVOICING & BILLING
// ===========================================

export const invoices = pgTable(
  "invoices",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    createdById: text("created_by_id")
      .notNull()
      .references(() => users.id),
    currency: text("currency").default("USD").notNull(),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    date: timestamp("date").notNull(),
    dueDate: timestamp("due_date"),
    invoiceNumber: text("invoice_number").notNull(),
    memo: text("memo"),
    status: invoiceStatusEnum("status").default("DRAFT").notNull(),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    total: decimal("total", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    postedAt: timestamp("posted_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    invoiceNumberTenantUnique: unique("invoice_number_tenant_unique").on(
      table.invoiceNumber,
      table.tenantId
    ),
  })
);

export const invoiceLines = pgTable("invoice_lines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id),
  description: text("description"),
  quantity: decimal("quantity", { precision: 10, scale: 2 })
    .default("1.00")
    .notNull(),
  unitAmount: decimal("unit_amount", { precision: 12, scale: 2 }).notNull(),
  lineAmount: decimal("line_amount", { precision: 12, scale: 2 }).notNull(),
  taxRateId: text("tax_rate_id").references((): any => taxRates.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bills = pgTable(
  "bills",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    createdById: text("created_by_id")
      .notNull()
      .references(() => users.id),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    vendorId: text("vendor_id")
      .notNull()
      .references(() => vendors.id),
    billNumber: text("bill_number").notNull(),
    date: timestamp("date").notNull(),
    dueDate: timestamp("due_date"),
    status: billStatusEnum("status").default("DRAFT").notNull(),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
    balanceDue: decimal("balance_due", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    billNumberTenantUnique: unique("bill_number_tenant_unique").on(
      table.billNumber,
      table.tenantId
    ),
  })
);

export const billLines = pgTable("bill_lines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  billId: text("bill_id")
    .notNull()
    .references(() => bills.id),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 })
    .default("1.00")
    .notNull(),
  unitAmount: decimal("unit_amount", { precision: 12, scale: 2 }).notNull(),
  lineAmount: decimal("line_amount", { precision: 12, scale: 2 }).notNull(),
  taxRateId: text("tax_rate_id").references((): any => taxRates.id),
});

export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  bankAccountId: text("bank_account_id").references((): any => bankAccounts.id),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id),
  currency: text("currency").default("USD").notNull(),
  date: timestamp("date").notNull(),
  method: paymentMethodEnum("method").notNull(),
  note: text("note"),
  reference: text("reference"),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentAllocations = pgTable("payment_allocations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  billId: text("bill_id").references(() => bills.id),
  invoiceId: text("invoice_id").references(() => invoices.id),
  paymentId: text("payment_id")
    .notNull()
    .references(() => payments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taxRates = pgTable("tax_rates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: text("name").notNull(),
  rate: decimal("rate", { precision: 5, scale: 4 }).notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===========================================
// BANKING
// ===========================================

export const bankAccounts = pgTable("bank_accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  name: text("name").notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  type: bankAccountTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bankStatements = pgTable("bank_statements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  bankAccountId: text("bank_account_id")
    .notNull()
    .references(() => bankAccounts.id),
  statementDate: timestamp("statement_date").notNull(),
  startingBalance: decimal("starting_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  endingBalance: decimal("ending_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bankStatementLines = pgTable("bank_statement_lines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  statementId: text("statement_id")
    .notNull()
    .references(() => bankStatements.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reconciliations = pgTable("reconciliations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  bankAccountId: text("bank_account_id")
    .notNull()
    .references(() => bankAccounts.id),
  clearedBalance: decimal("cleared_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  statementEndingBalance: decimal("statement_ending_balance", {
    precision: 12,
    scale: 2,
  }).notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reconciledAt: timestamp("reconciled_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===========================================
// OTHER
// ===========================================

export const attachments = pgTable("attachments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id),
  filename: text("filename").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  url: text("url").notNull(),
  billId: text("bill_id").references(() => bills.id),
  invoiceId: text("invoice_id").references(() => invoices.id),
  paymentId: text("payment_id").references(() => payments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid()),
  action: text("action").notNull(),
  objectType: text("object_type").notNull(),
  objectId: text("object_id").notNull(),
  oldValue: json("old_value"),
  newValue: json("new_value"),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sequences = pgTable(
  "sequences",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => cuid()),
    name: text("name").notNull(),
    nextValue: integer("next_value").default(1).notNull(),
    prefix: text("prefix"),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    tenantNameUnique: unique("tenant_name_unique").on(
      table.tenantId,
      table.name
    ),
  })
);

// ===========================================
// RELATIONS
// ===========================================

export const usersRelations = relations(users, ({ many }) => ({
  attachments: many(attachments),
  auditLogs: many(auditLogs),
  bills: many(bills),
  identities: many(identities),
  invoices: many(invoices),
  journalEntries: many(journalEntries),
  payments: many(payments),
  userTenantMemberships: many(userTenantMemberships),
}));

export const identitiesRelations = relations(identities, ({ one }) => ({
  user: one(users, {
    fields: [identities.userId],
    references: [users.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  accounts: many(accounts),
  attachments: many(attachments),
  auditLogs: many(auditLogs),
  bankAccounts: many(bankAccounts),
  bankStatements: many(bankStatements),
  bills: many(bills),
  customers: many(customers),
  fiscalYears: many(fiscalYears),
  fixedAssets: many(fixedAssets),
  invoices: many(invoices),
  journalEntries: many(journalEntries),
  payments: many(payments),
  reconciliations: many(reconciliations),
  sequences: many(sequences),
  taxRates: many(taxRates),
  userTenantMemberships: many(userTenantMemberships),
  vendors: many(vendors),
}));

export const userTenantMembershipsRelations = relations(
  userTenantMemberships,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [userTenantMemberships.tenantId],
      references: [tenants.id],
    }),
    user: one(users, {
      fields: [userTenantMemberships.userId],
      references: [users.id],
    }),
  })
);

export const customersRelations = relations(customers, ({ one, many }) => ({
  addresses: many(addresses),
  contacts: many(contacts),
  invoices: many(invoices),
  tenant: one(tenants, {
    fields: [customers.tenantId],
    references: [tenants.id],
  }),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  addresses: many(addresses),
  bills: many(bills),
  contacts: many(contacts),
  tenant: one(tenants, {
    fields: [vendors.tenantId],
    references: [tenants.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
  vendor: one(vendors, {
    fields: [addresses.vendorId],
    references: [vendors.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  customer: one(customers, {
    fields: [contacts.customerId],
    references: [customers.id],
  }),
  vendor: one(vendors, {
    fields: [contacts.vendorId],
    references: [vendors.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  parent: one(accounts, {
    fields: [accounts.parentId],
    references: [accounts.id],
  }),
  children: many(accounts),
  accumulatedOnFixedAssets: many(fixedAssets, {
    relationName: "accumulatedAccount",
  }),
  fixedAssets: many(fixedAssets, { relationName: "fixedAssetAccount" }),
  tenant: one(tenants, {
    fields: [accounts.tenantId],
    references: [tenants.id],
  }),
  transactions: many(transactions),
}));

export const journalEntriesRelations = relations(
  journalEntries,
  ({ one, many }) => ({
    bankAccount: one(bankAccounts, {
      fields: [journalEntries.bankAccountId],
      references: [bankAccounts.id],
    }),
    bill: one(bills, {
      fields: [journalEntries.billId],
      references: [bills.id],
    }),
    createdBy: one(users, {
      fields: [journalEntries.createdById],
      references: [users.id],
    }),
    invoice: one(invoices, {
      fields: [journalEntries.invoiceId],
      references: [invoices.id],
    }),
    payment: one(payments, {
      fields: [journalEntries.paymentId],
      references: [payments.id],
    }),
    tenant: one(tenants, {
      fields: [journalEntries.tenantId],
      references: [tenants.id],
    }),
    transactions: many(transactions),
  })
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  journalEntry: one(journalEntries, {
    fields: [transactions.journalEntryId],
    references: [journalEntries.id],
  }),
}));

export const fixedAssetsRelations = relations(fixedAssets, ({ one }) => ({
  account: one(accounts, {
    fields: [fixedAssets.accountId],
    references: [accounts.id],
    relationName: "fixedAssetAccount",
  }),
  accumulatedOn: one(accounts, {
    fields: [fixedAssets.accumulatedAccountId],
    references: [accounts.id],
    relationName: "accumulatedAccount",
  }),
  tenant: one(tenants, {
    fields: [fixedAssets.tenantId],
    references: [tenants.id],
  }),
}));

export const fiscalYearsRelations = relations(fiscalYears, ({ one }) => ({
  tenant: one(tenants, {
    fields: [fiscalYears.tenantId],
    references: [tenants.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  attachments: many(attachments),
  journalEntries: many(journalEntries),
  createdBy: one(users, {
    fields: [invoices.createdById],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  lines: many(invoiceLines),
  payments: many(paymentAllocations),
  tenant: one(tenants, {
    fields: [invoices.tenantId],
    references: [tenants.id],
  }),
}));

export const invoiceLinesRelations = relations(invoiceLines, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceLines.invoiceId],
    references: [invoices.id],
  }),
  taxRate: one(taxRates, {
    fields: [invoiceLines.taxRateId],
    references: [taxRates.id],
  }),
}));

export const billsRelations = relations(bills, ({ one, many }) => ({
  attachments: many(attachments),
  journalEntries: many(journalEntries),
  createdBy: one(users, {
    fields: [bills.createdById],
    references: [users.id],
  }),
  lines: many(billLines),
  payments: many(paymentAllocations),
  tenant: one(tenants, {
    fields: [bills.tenantId],
    references: [tenants.id],
  }),
  vendor: one(vendors, {
    fields: [bills.vendorId],
    references: [vendors.id],
  }),
}));

export const billLinesRelations = relations(billLines, ({ one }) => ({
  bill: one(bills, {
    fields: [billLines.billId],
    references: [bills.id],
  }),
  taxRate: one(taxRates, {
    fields: [billLines.taxRateId],
    references: [taxRates.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  allocations: many(paymentAllocations),
  journalEntries: many(journalEntries),
  attachments: many(attachments),
  bankAccount: one(bankAccounts, {
    fields: [payments.bankAccountId],
    references: [bankAccounts.id],
  }),
  createdBy: one(users, {
    fields: [payments.createdById],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [payments.tenantId],
    references: [tenants.id],
  }),
}));

export const paymentAllocationsRelations = relations(
  paymentAllocations,
  ({ one }) => ({
    bill: one(bills, {
      fields: [paymentAllocations.billId],
      references: [bills.id],
    }),
    invoice: one(invoices, {
      fields: [paymentAllocations.invoiceId],
      references: [invoices.id],
    }),
    payment: one(payments, {
      fields: [paymentAllocations.paymentId],
      references: [payments.id],
    }),
  })
);

export const taxRatesRelations = relations(taxRates, ({ one, many }) => ({
  billLines: many(billLines),
  invoiceLines: many(invoiceLines),
  tenant: one(tenants, {
    fields: [taxRates.tenantId],
    references: [tenants.id],
  }),
}));

export const bankAccountsRelations = relations(
  bankAccounts,
  ({ one, many }) => ({
    journalEntries: many(journalEntries),
    payments: many(payments),
    reconciliations: many(reconciliations),
    statements: many(bankStatements),
    tenant: one(tenants, {
      fields: [bankAccounts.tenantId],
      references: [tenants.id],
    }),
  })
);

export const bankStatementsRelations = relations(
  bankStatements,
  ({ one, many }) => ({
    bankAccount: one(bankAccounts, {
      fields: [bankStatements.bankAccountId],
      references: [bankAccounts.id],
    }),
    lines: many(bankStatementLines),
    tenant: one(tenants, {
      fields: [bankStatements.tenantId],
      references: [tenants.id],
    }),
  })
);

export const bankStatementLinesRelations = relations(
  bankStatementLines,
  ({ one }) => ({
    statement: one(bankStatements, {
      fields: [bankStatementLines.statementId],
      references: [bankStatements.id],
    }),
  })
);

export const reconciliationsRelations = relations(
  reconciliations,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [reconciliations.tenantId],
      references: [tenants.id],
    }),
    bankAccount: one(bankAccounts, {
      fields: [reconciliations.bankAccountId],
      references: [bankAccounts.id],
    }),
  })
);

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  bill: one(bills, {
    fields: [attachments.billId],
    references: [bills.id],
  }),
  createdBy: one(users, {
    fields: [attachments.createdById],
    references: [users.id],
  }),
  invoice: one(invoices, {
    fields: [attachments.invoiceId],
    references: [invoices.id],
  }),
  payment: one(payments, {
    fields: [attachments.paymentId],
    references: [payments.id],
  }),
  tenant: one(tenants, {
    fields: [attachments.tenantId],
    references: [tenants.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditLogs.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const sequencesRelations = relations(sequences, ({ one }) => ({
  tenant: one(tenants, {
    fields: [sequences.tenantId],
    references: [tenants.id],
  }),
}));
