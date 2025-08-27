import { AccountType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create initial tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Galactic Trading Company",
      subdomain: "galacticetradingco",
    },
  });
  console.log("✅ Created tenant:", tenant.name);

  // Create initial user
  const user = await prisma.user.create({
    data: {
      email: "az@galactictradingco.com",
      firstName: "Admiral Zelara",
      lastName: "Vey",
      role: "ADMIN",
    },
  });
  console.log("✅ Created user:", user.email);

  // Create user-tenant membership
  await prisma.userTenantMembership.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
    },
  });

  // Create standard chart of accounts
  const accounts = await createStandardAccounts(tenant.id);
  console.log(`✅ Created ${accounts.length} standard accounts`);

  const vendors = await createVendors(tenant.id);
  console.log(`✅ Created ${vendors.length} vendors`);

  const customers = await createCustomers(tenant.id);
  console.log(`✅ Created ${customers.length} customers`);

  console.log("🎉 Database seeding completed!");
}

async function createStandardAccounts(tenantId: string) {
  const accounts = [
    // Assets (1000-1999)
    { code: "1000", name: "Cash", type: AccountType.ASSET },
    { code: "1100", name: "Accounts Receivable", type: AccountType.ASSET },
    { code: "1200", name: "Inventory", type: AccountType.ASSET },
    { code: "1300", name: "Prepaid Expenses", type: AccountType.ASSET },
    { code: "1400", name: "Fixed Assets", type: AccountType.ASSET },
    { code: "1410", name: "Equipment", type: AccountType.ASSET },
    { code: "1420", name: "Furniture", type: AccountType.ASSET },
    { code: "1430", name: "Vehicles", type: AccountType.ASSET },
    { code: "1500", name: "Accumulated Depreciation", type: AccountType.ASSET },

    // Liabilities (2000-2999)
    { code: "2000", name: "Accounts Payable", type: AccountType.LIABILITY },
    { code: "2100", name: "Credit Cards", type: AccountType.LIABILITY },
    { code: "2200", name: "Short-term Loans", type: AccountType.LIABILITY },
    { code: "2300", name: "Long-term Loans", type: AccountType.LIABILITY },
    { code: "2400", name: "Accrued Expenses", type: AccountType.LIABILITY },
    { code: "2500", name: "Sales Tax Payable", type: AccountType.LIABILITY },
    {
      code: "2600",
      name: "Payroll Taxes Payable",
      type: AccountType.LIABILITY,
    },

    // Equity (3000-3999)
    { code: "3000", name: "Owner's Equity", type: AccountType.EQUITY },
    { code: "3100", name: "Retained Earnings", type: AccountType.EQUITY },
    { code: "3200", name: "Owner's Draw", type: AccountType.EQUITY },

    // Revenue (4000-4999)
    { code: "4000", name: "Sales Revenue", type: AccountType.REVENUE },
    { code: "4100", name: "Service Revenue", type: AccountType.REVENUE },
    { code: "4200", name: "Other Income", type: AccountType.REVENUE },
    { code: "4300", name: "Interest Income", type: AccountType.REVENUE },

    // Expenses (5000-5999)
    { code: "5000", name: "Cost of Goods Sold", type: AccountType.EXPENSE },
    { code: "5100", name: "Advertising", type: AccountType.EXPENSE },
    { code: "5200", name: "Office Supplies", type: AccountType.EXPENSE },
    { code: "5300", name: "Rent Expense", type: AccountType.EXPENSE },
    { code: "5400", name: "Utilities", type: AccountType.EXPENSE },
    { code: "5500", name: "Insurance", type: AccountType.EXPENSE },
    { code: "5600", name: "Payroll Expense", type: AccountType.EXPENSE },
    { code: "5700", name: "Payroll Taxes", type: AccountType.EXPENSE },
    { code: "5800", name: "Professional Services", type: AccountType.EXPENSE },
    { code: "5900", name: "Miscellaneous Expenses", type: AccountType.EXPENSE },
  ];

  const createdAccounts = [];

  for (const account of accounts) {
    const created = await prisma.account.create({
      data: {
        ...account,
        tenantId,
      },
    });
    createdAccounts.push(created);
  }

  return createdAccounts;
}

async function createVendors(tenantId: string) {
  const vendors = [
    {
      name: "Dark Matter Refinery Ltd.",
      addresses: [
        {
          street1: "42 Event Horizon Blvd",
          city: "Singularity City",
          state: "Nebula Province",
          zip: "0X42DMR",
        },
      ],
    },
    {
      name: "CryoVault Logistics",
      addresses: [
        {
          street1: "88 Cryostasis Parkway",
          city: "Frostbyte Station",
          state: "Cryogenica",
          zip: "CV-4242",
        },
      ],
    },
    {
      name: "Nova Fuel Consortium",
      addresses: [
        {
          street1: "7 Supernova Loop",
          city: "Starlight Harbor",
          state: "Quasar District",
          zip: "NF-9001",
        },
      ],
    },
    {
      name: "Asteroid Outfitters",
      addresses: [
        {
          street1: "123 Main St",
          city: "Galactic City",
          state: "Terran State",
          zip: "12345",
        },
      ],
    },
  ];

  const createdVendors = [];

  for (const vendor of vendors) {
    const { addresses, ...vendorData } = vendor;
    const created = await prisma.vendor.create({
      data: {
        ...vendorData,
        tenantId,
        addresses: {
          create: addresses,
        },
      },
    });

    createdVendors.push(created);
  }

  return createdVendors;
}

async function createCustomers(tenantId: string) {
  const customers = [
    {
      name: "Orion Spice Syndicate",
      addresses: [
        {
          street1: "42 Nebula Spice Lane",
          city: "Orion's Belt",
          state: "Constellation District",
          zip: "OR-1572",
        },
      ],
    },
    {
      name: "Tau Ceti Terraformers",
      addresses: [
        {
          street1: "777 Atmosphere Boulevard",
          city: "New Terra",
          state: "Habitable Zone",
          zip: "TC-2024",
        },
      ],
    },
    {
      name: "Betelgeuse Royal Court",
      addresses: [
        {
          street1: "1 Red Giant Palace",
          city: "Stellar Court",
          state: "Royal Nebula",
          zip: "BG-9999",
        },
      ],
    },
    {
      name: "Alpha Centauri Mining Guild",
      addresses: [
        {
          street1: "88 Proxima Mining Complex",
          city: "Triple Star Station",
          state: "Binary System",
          zip: "AC-4.37",
        },
      ],
    },
  ];

  const createdCustomers = [];

  for (const customer of customers) {
    const { addresses, ...customerData } = customer;
    const created = await prisma.customer.create({
      data: {
        ...customerData,
        tenantId,
        addresses: {
          create: addresses,
        },
      },
    });

    createdCustomers.push(created);
  }

  return createdCustomers;
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
