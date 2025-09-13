import { Account, Customer, PrismaClient, Vendor } from "@prisma/client";

import { accounts } from "./seedData";
import * as GTC from "./seedDataGalacticTradingCo";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const user = await prisma.user.create({
    data: {
      email: "az@galactictradingco.com",
      firstName: "Admiral Zelara",
      lastName: "Vey",
      role: "ADMIN",
    },
  });
  console.log("✅ Created user:", user.email);

  const tenantData = [
    {
      name: "Galactic Trading Company",
      subdomain: "galacticetradingco",
    },
    {
      name: "Stellar Defense Fleet",
      subdomain: "stellardefense",
    },
  ];

  for (const data of tenantData) {
    const tenant = await prisma.tenant.create({ data });
    console.log("✅ Created tenant:", tenant.name);

    await prisma.userTenantMembership.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    const accounts = await createStandardAccounts(tenant.id);
    console.log(
      `✅ Created ${accounts.length} standard accounts for ${tenant.name}`
    );

    const vendors = await createVendors(GTC.vendorData, tenant.id);
    console.log(`✅ Created ${vendors.length} vendors for ${tenant.name}`);

    const customers = await createCustomers(GTC.customerData, tenant.id);
    console.log(`✅ Created ${customers.length} customers for ${tenant.name}`);
  }

  console.log("🎉 Database seeding completed!");
}

async function createStandardAccounts(tenantId: string) {
  const createdAccounts: Account[] = [];

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

async function createCustomers(customers, tenantId: string) {
  const createdCustomers: Customer[] = [];

  for (const customer of customers) {
    const { addresses, contacts, ...customerData } = customer;
    const created = await prisma.customer.create({
      data: {
        ...customerData,
        tenantId,
        addresses: {
          create: addresses,
        },
        contacts: {
          create: contacts,
        },
      },
    });

    createdCustomers.push(created);
  }

  return createdCustomers;
}

async function createVendors(vendors, tenantId: string) {
  const createdVendors: Vendor[] = [];

  for (const vendor of vendors) {
    const { addresses, contacts, ...vendorData } = vendor;
    const created = await prisma.vendor.create({
      data: {
        ...vendorData,
        tenantId,
        addresses: {
          create: addresses,
        },
        contacts: {
          create: contacts,
        },
      },
    });

    createdVendors.push(created);
  }

  return createdVendors;
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    // @ts-ignore-next-line
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
