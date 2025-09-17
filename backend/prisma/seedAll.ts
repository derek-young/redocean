/*
Prisma TypeScript seed script for rich accounting test data.

Usage:
  - set env: DATABASE_URL (Prisma), TENANT_ID, USER_ID
  - run with: npx ts-node prisma_accounting_seed.ts

What it does (summary):
  - Creates a chart of accounts for the given tenant
  - Creates sequences (invoice_number, bill_number)
  - Creates a fiscal year
  - Creates tax rates, bank accounts, a fixed asset
  - Generates invoices (monthly) for existing customers
  - Generates vendor bills (monthly) for existing vendors
  - Posts JournalEntries + Transactions for invoice posting, bill posting, and payments
  - Creates bank statements and reconciliations

Note: the script is idempotent (uses upsert/find-or-create patterns) so you can re-run it safely.
*/

import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// ENV inputs
const TENANT_ID = process.env.TENANT_ID || "";
const USER_ID = process.env.USER_ID || "";
if (!TENANT_ID || !USER_ID) {
  console.error("Please set TENANT_ID and USER_ID environment variables.");
  process.exit(1);
}

// deterministic pseudo-random helper
let seed = 42;
function rand(min: number, max: number) {
  seed = (seed * 1664525 + 1013904223) % 0xffffffff;
  return Math.floor(min + (seed / 0xffffffff) * (max - min + 1));
}

async function upsertAccount(
  code: string,
  name: string,
  type: Prisma.AccountType,
  description?: string,
  parentCode?: string
) {
  const existing = await prisma.account.findFirst({
    where: { code, tenantId: TENANT_ID },
  });
  if (existing) return existing;

  let parentId: string | undefined = undefined;
  if (parentCode) {
    const p = await prisma.account.findFirst({
      where: { code: parentCode, tenantId: TENANT_ID },
    });
    parentId = p?.id;
  }

  return prisma.account.create({
    data: {
      code,
      name,
      description,
      type,
      tenantId: TENANT_ID,
      parentId,
    },
  });
}

async function createSequenceIfMissing(
  name: string,
  prefix?: string,
  start = 1000
) {
  return prisma.sequence.upsert({
    where: { tenantId_name: { tenantId: TENANT_ID, name } } as any,
    update: {},
    create: { name, prefix, nextValue: start, tenantId: TENANT_ID },
  });
}

async function nextSequenceValue(name: string) {
  // naive next value: read, increment
  const seq = await prisma.sequence.findFirst({
    where: { tenantId: TENANT_ID, name },
  });
  if (!seq) throw new Error(`Sequence ${name} not found`);
  const next = await prisma.sequence.update({
    where: { id: seq.id },
    data: { nextValue: seq.nextValue + 1 },
  });
  const prefix = seq.prefix || "";
  return `${prefix}${next.nextValue - 1}`;
}

async function createFiscalYear(startDate: string, endDate: string) {
  const fy = await prisma.fiscalYear.create({
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      tenantId: TENANT_ID,
    },
  });
  return fy;
}

async function createJournalEntry(
  date: string,
  memo: string | null,
  transactions: {
    accountCode: string;
    type: "DEBIT" | "CREDIT";
    amount: string;
  }[],
  linked?: {
    invoiceId?: string;
    billId?: string;
    paymentId?: string;
    bankAccountId?: string;
    sourceType?: string;
  }
) {
  // ensure accounts
  const txsResolved = await Promise.all(
    transactions.map(async (t) => {
      const acct = await prisma.account.findFirst({
        where: { code: t.accountCode, tenantId: TENANT_ID },
      });
      if (!acct) throw new Error(`Missing account ${t.accountCode}`);
      return { accountId: acct.id, type: t.type, amount: t.amount };
    })
  );

  // entry number
  const entryNumber =
    parseInt(
      (await nextSequenceValue("journal_entry_number")).replace(/[^0-9]/g, ""),
      10
    ) || Date.now();

  const je = await prisma.journalEntry.create({
    data: {
      date: new Date(date),
      memo: memo ?? undefined,
      entryNumber,
      tenantId: TENANT_ID,
      postedAt: new Date(date),
      status: "POSTED",
      ...linked,
      transactions: {
        create: txsResolved.map((r) => ({
          accountId: r.accountId,
          type: r.type,
          amount: new Prisma.Decimal(r.amount),
        })),
      },
    },
    include: { transactions: true },
  });

  return je;
}

async function seedChartOfAccounts() {
  // Assets
  await upsertAccount("1000", "Cash", "ASSET", "Operating cash");
  await upsertAccount(
    "1010",
    "Bank - Checking",
    "ASSET",
    "Primary checking account"
  );
  await upsertAccount(
    "1100",
    "Accounts Receivable",
    "ASSET",
    "Customers owe us"
  );
  await upsertAccount("1200", "Inventory", "ASSET");
  await upsertAccount("1500", "Fixed Assets", "ASSET");
  await upsertAccount("1501", "Accumulated Depreciation", "ASSET");

  // Liabilities
  await upsertAccount("2000", "Accounts Payable", "LIABILITY");
  await upsertAccount("2100", "Loan Payable", "LIABILITY");

  // Equity
  await upsertAccount("3000", "Owner's Equity", "EQUITY");
  await upsertAccount("3100", "Retained Earnings", "EQUITY");

  // Revenue
  await upsertAccount("4000", "Sales Revenue", "REVENUE");
  await upsertAccount("4100", "Service Revenue", "REVENUE");

  // COGS & Expenses
  await upsertAccount("5000", "Cost of Goods Sold", "EXPENSE");
  await upsertAccount("5200", "Rent Expense", "EXPENSE");
  await upsertAccount("5300", "Salaries Expense", "EXPENSE");
  await upsertAccount("5400", "Bank Fees", "EXPENSE");
}

async function seedTaxRates() {
  await prisma.taxRate.upsert({
    where: { id: "taxrate-sales-standard" },
    update: {},
    create: {
      id: "taxrate-sales-standard",
      name: "Standard Sales Tax",
      rate: new Prisma.Decimal("0.0750"),
      tenantId: TENANT_ID,
    },
  });
}

async function seedBankAccounts() {
  await prisma.bankAccount.upsert({
    where: { id: "bank-checking-1" },
    update: { name: "Primary Checking" },
    create: {
      id: "bank-checking-1",
      name: "Primary Checking",
      tenantId: TENANT_ID,
      type: "CHECKING",
    },
  });
}

async function seedSequences() {
  // simple sequences
  await createSequenceIfMissing("invoice_number", "INV-");
  await createSequenceIfMissing("bill_number", "BILL-");
  await createSequenceIfMissing("journal_entry_number", "JE-101");
}

async function pickCustomers(n = 3) {
  const customers = await prisma.customer.findMany({
    where: { tenantId: TENANT_ID },
    take: n,
  });
  if (!customers || customers.length === 0)
    throw new Error("No customers found for tenant.");
  return customers;
}
async function pickVendors(n = 3) {
  const vendors = await prisma.vendor.findMany({
    where: { tenantId: TENANT_ID },
    take: n,
  });
  if (!vendors || vendors.length === 0)
    throw new Error("No vendors found for tenant.");
  return vendors;
}

async function seedInvoicesPeriod(startISO: string, months = 6) {
  const customers = await pickCustomers(6);
  const invoiceAcct = await prisma.account.findFirst({
    where: { code: "1100", tenantId: TENANT_ID },
  }); // AR
  const revenueAcct = await prisma.account.findFirst({
    where: { code: "4000", tenantId: TENANT_ID },
  });
  if (!invoiceAcct || !revenueAcct)
    throw new Error("Missing AR or Revenue accounts");

  const invoicesCreated: string[] = [];

  for (let m = 0; m < months; m++) {
    const date = new Date(startISO);
    date.setMonth(date.getMonth() + m);
    const iso = date.toISOString();

    for (const cust of customers.slice(0, 3)) {
      const invoiceNumber = await nextSequenceValue("invoice_number");
      const lineAmount = rand(500, 5000).toString();
      const total = lineAmount;
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          date: date,
          dueDate: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
          totalAmount: new Prisma.Decimal(total),
          balanceDue: new Prisma.Decimal(total),
          createdById: USER_ID,
          customerId: cust.id,
          tenantId: TENANT_ID,
          status: "SENT",
          lines: {
            create: [
              {
                description: `Services for ${date.toISOString().slice(0, 10)}`,
                quantity: new Prisma.Decimal("1.00"),
                unitAmount: new Prisma.Decimal(total),
                lineAmount: new Prisma.Decimal(total),
              },
            ],
          },
        },
      });

      // Post invoice -> JE: Debit AR, Credit Revenue
      await createJournalEntry(
        iso,
        `Post Invoice ${invoice.invoiceNumber}`,
        [
          { accountCode: "1100", type: "DEBIT", amount: total },
          { accountCode: "4000", type: "CREDIT", amount: total },
        ],
        { invoiceId: invoice.id, sourceType: "INVOICE" }
      );

      invoicesCreated.push(invoice.id);

      // Randomly pay some invoices partially/fully
      if (rand(1, 100) > 60) {
        // create a payment (bank)
        const paymentAmount = rand(
          Math.max(100, parseInt(total) / 4),
          parseInt(total)
        ).toString();
        const bank = await prisma.bankAccount.findFirst({
          where: { tenantId: TENANT_ID },
        });
        const payment = await prisma.payment.create({
          data: {
            amount: new Prisma.Decimal(paymentAmount),
            date: new Date(iso),
            method: "BANK_TRANSFER",
            createdById: USER_ID,
            tenantId: TENANT_ID,
            bankAccountId: bank?.id,
            allocations: {
              create: [
                {
                  invoiceId: invoice.id,
                  amount: new Prisma.Decimal(paymentAmount),
                },
              ],
            },
          },
        });

        // JE: Debit Cash, Credit AR
        await createJournalEntry(
          iso,
          `Payment ${payment.id} for ${invoice.invoiceNumber}`,
          [
            { accountCode: "1010", type: "DEBIT", amount: paymentAmount },
            { accountCode: "1100", type: "CREDIT", amount: paymentAmount },
          ],
          {
            paymentId: payment.id,
            bankAccountId: bank?.id,
            sourceType: "PAYMENT",
          }
        );

        // Adjust invoice balanceDue cached
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            balanceDue: new Prisma.Decimal(
              (parseFloat(total) - parseFloat(paymentAmount)).toFixed(2)
            ),
          },
        });
      }
    }
  }
  return invoicesCreated;
}

async function seedBillsPeriod(startISO: string, months = 6) {
  const vendors = await pickVendors(6);
  const apAcct = await prisma.account.findFirst({
    where: { code: "2000", tenantId: TENANT_ID },
  }); // AP
  const expenseAcct = await prisma.account.findFirst({
    where: { code: "5200", tenantId: TENANT_ID },
  }); // Rent expense as example
  if (!apAcct || !expenseAcct)
    throw new Error("Missing AP or Expense accounts");

  const billsCreated: string[] = [];
  for (let m = 0; m < months; m++) {
    const date = new Date(startISO);
    date.setMonth(date.getMonth() + m);
    const iso = date.toISOString();

    for (const ven of vendors.slice(0, 2)) {
      const billNumber = await nextSequenceValue("bill_number");
      const lineAmount = rand(200, 2000).toString();
      const total = lineAmount;
      const bill = await prisma.bill.create({
        data: {
          billNumber,
          date: date,
          dueDate: new Date(date.getTime() + 20 * 24 * 60 * 60 * 1000),
          totalAmount: new Prisma.Decimal(total),
          balanceDue: new Prisma.Decimal(total),
          createdById: USER_ID,
          vendorId: ven.id,
          tenantId: TENANT_ID,
          status: "RECEIVED",
          lines: {
            create: [
              {
                description: `Goods ${date.toISOString().slice(0, 10)}`,
                quantity: new Prisma.Decimal("1.00"),
                unitAmount: new Prisma.Decimal(total),
                lineAmount: new Prisma.Decimal(total),
              },
            ],
          },
        },
      });

      // Post bill -> JE: Debit Expense, Credit AP
      await createJournalEntry(
        iso,
        `Post Bill ${bill.billNumber}`,
        [
          { accountCode: "5200", type: "DEBIT", amount: total },
          { accountCode: "2000", type: "CREDIT", amount: total },
        ],
        { billId: bill.id, sourceType: "BILL" }
      );

      billsCreated.push(bill.id);

      // Randomly pay some bills
      if (rand(1, 100) > 50) {
        const paymentAmount = rand(50, parseInt(total)).toString();
        const bank = await prisma.bankAccount.findFirst({
          where: { tenantId: TENANT_ID },
        });
        const payment = await prisma.payment.create({
          data: {
            amount: new Prisma.Decimal(paymentAmount),
            date: new Date(iso),
            method: "BANK_TRANSFER",
            createdById: USER_ID,
            tenantId: TENANT_ID,
            bankAccountId: bank?.id,
            allocations: {
              create: [
                { billId: bill.id, amount: new Prisma.Decimal(paymentAmount) },
              ],
            },
          },
        });

        // JE: Debit AP, Credit Cash
        await createJournalEntry(
          iso,
          `Bill Payment ${payment.id} for ${bill.billNumber}`,
          [
            { accountCode: "2000", type: "DEBIT", amount: paymentAmount },
            { accountCode: "1010", type: "CREDIT", amount: paymentAmount },
          ],
          {
            paymentId: payment.id,
            bankAccountId: bank?.id,
            sourceType: "PAYMENT",
          }
        );

        await prisma.bill.update({
          where: { id: bill.id },
          data: {
            balanceDue: new Prisma.Decimal(
              (parseFloat(total) - parseFloat(paymentAmount)).toFixed(2)
            ),
          },
        });
      }
    }
  }
  return billsCreated;
}

async function seedBankStatementsAndRecs() {
  const bank = await prisma.bankAccount.findFirst({
    where: { tenantId: TENANT_ID },
  });
  if (!bank) return;
  // one statement covering the months seeded
  const statementDate = new Date();
  const starting = new Prisma.Decimal("10000.00");
  const ending = new Prisma.Decimal((10000 + rand(-2000, 2000)).toString());
  const stmt = await prisma.bankStatement.create({
    data: {
      bankAccountId: bank.id,
      statementDate,
      startingBalance: starting,
      endingBalance: ending,
      tenantId: TENANT_ID,
    },
  });

  // lines (pull some recent payments/JE amounts to show)
  const recentJEs = await prisma.journalEntry.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { date: "desc" },
    take: 8,
  });
  for (const je of recentJEs) {
    // sum cash-related transactions in JE
    const cashTx = await prisma.transaction
      .findFirst({
        where: {
          journalEntryId: je.id,
          tenantId: TENANT_ID,
          account: { code: "1010" } as any,
        },
        include: { account: true },
      })
      .catch(() => null);
    if (cashTx) {
      await prisma.bankStatementLine.create({
        data: {
          amount: cashTx.amount as any,
          date: je.date,
          description: `JE ${je.entryNumber} cash`,
          statementId: stmt.id,
        },
      });
    }
  }

  // reconciliation record
  await prisma.reconciliation.create({
    data: {
      bankAccountId: bank.id,
      clearedBalance: ending,
      periodStart: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      periodEnd: new Date(),
      statementEndingBalance: ending,
      tenantId: TENANT_ID,
    },
  });
}

async function seedFixedAsset() {
  const fixedAcct = await upsertAccount("1510", "Office Furniture", "ASSET");
  const accDepAcct = await upsertAccount(
    "1511",
    "Accumulated Depreciation - Furniture",
    "ASSET"
  );
  const asset = await prisma.fixedAsset.upsert({
    where: { id: "fixed-asset-furniture-1" },
    update: {},
    create: {
      id: "fixed-asset-furniture-1",
      accountId: fixedAcct.id,
      accumulatedAccountId: accDepAcct.id,
      cost: new Prisma.Decimal("8500.00"),
      name: "Office Furniture Set",
      purchaseDate: new Date(),
      salvage: new Prisma.Decimal("500.00"),
      tenantId: TENANT_ID,
      usefulLifeMonths: 60,
    },
  });

  // create a depreciation JE for one period (simple straight-line monthly)
  const monthlyDep = ((8500 - 500) / 60).toFixed(2);
  await createJournalEntry(
    new Date().toISOString(),
    "Depreciation - furniture",
    [
      { accountCode: "5400", type: "DEBIT", amount: monthlyDep }, // using Bank Fees as depreciation placeholder expense for seed
      { accountCode: accDepAcct.code, type: "CREDIT", amount: monthlyDep },
    ],
    { sourceType: "DEPRECIATION" }
  );
}

async function main() {
  console.log("Seeding chart of accounts...");
  await seedChartOfAccounts();

  console.log("Seeding sequences...");
  await seedSequences();

  console.log("Seeding tax rates and bank accounts...");
  await seedTaxRates();
  await seedBankAccounts();

  console.log("Creating fiscal year 2025...");
  await createFiscalYear("2025-01-01", "2025-12-31");

  console.log("Seeding fixed asset...");
  await seedFixedAsset();

  console.log("Seeding invoices across 6 months...");
  await seedInvoicesPeriod("2025-01-01", 6);

  console.log("Seeding bills across 6 months...");
  await seedBillsPeriod("2025-01-01", 6);

  console.log("Seeding bank statements and reconciliations...");
  await seedBankStatementsAndRecs();

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
