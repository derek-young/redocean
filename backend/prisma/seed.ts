import { db } from "../src/db";
import {
  users,
  tenants,
  userTenantMemberships,
  accounts as accountsTable,
  customers as customersTable,
  vendors as vendorsTable,
  addresses as addressesTable,
  contacts as contactsTable,
  sequences as sequencesTable,
} from "../src/schema";

import { accounts } from "./seedData";
import * as GTC from "./seedDataGalacticTradingCo";
import * as SDF from "./seedDataStellarDefense";

type Account = typeof accountsTable.$inferInsert;
type Customer = typeof customersTable.$inferInsert;
type Vendor = typeof vendorsTable.$inferInsert;

async function main() {
  console.log("🌱 Starting database seed...");

  const [user] = await db
    .insert(users)
    .values({
      email: "az@galactictradingco.com",
      firstName: "Admiral Zelara",
      lastName: "Vey",
      role: "ADMIN",
    })
    .returning();

  const tenantData = [
    {
      name: "Galactic Trading Company",
      subdomain: "galacticetradingco",
      vendorData: GTC.vendorData,
      customerData: GTC.customerData,
    },
    {
      name: "Stellar Defense Fleet",
      subdomain: "stellardefense",
      vendorData: SDF.vendorData,
      customerData: SDF.customerData,
    },
  ];

  for (const data of tenantData) {
    const { name, subdomain, vendorData, customerData } = data;
    const [tenant] = await db
      .insert(tenants)
      .values({ name, subdomain })
      .returning();
    console.log("✅ Created tenant:", tenant.name);

    await db.insert(userTenantMemberships).values({
      userId: user.id,
      tenantId: tenant.id,
    });

    const accountsCreated = await createStandardAccounts(tenant.id);
    console.log(
      `✅ Created ${accountsCreated.length} standard accounts for ${tenant.name}`
    );

    const customersCreated = await createCustomers(customerData, tenant.id);
    console.log(
      `✅ Created ${customersCreated.length} customers for ${tenant.name}`
    );

    const vendorsCreated = await createVendors(vendorData, tenant.id);
    console.log(
      `✅ Created ${vendorsCreated.length} vendors for ${tenant.name}`
    );

    await createSequences(tenant.id);
  }

  console.log("🎉 Database seeding completed!");
}

async function createStandardAccounts(tenantId: string) {
  const accountsToCreate = accounts.map((account) => ({
    ...account,
    tenantId,
  }));

  const createdAccounts = await db
    .insert(accountsTable)
    .values(accountsToCreate)
    .returning();

  return createdAccounts;
}

async function createCustomers(customers: any[], tenantId: string) {
  const createdCustomers: any[] = [];

  for (const customer of customers) {
    const { addresses, contacts, ...customerData } = customer;

    // Insert customer first
    const [createdCustomer] = await db
      .insert(customersTable)
      .values({
        ...customerData,
        tenantId,
      })
      .returning();

    // Insert addresses
    if (addresses && addresses.length > 0) {
      await db.insert(addressesTable).values(
        addresses.map((addr: any) => ({
          ...addr,
          customerId: createdCustomer.id,
        }))
      );
    }

    // Insert contacts
    if (contacts && contacts.length > 0) {
      await db.insert(contactsTable).values(
        contacts.map((contact: any) => ({
          ...contact,
          customerId: createdCustomer.id,
        }))
      );
    }

    createdCustomers.push(createdCustomer);
  }

  return createdCustomers;
}

async function createVendors(vendors: any[], tenantId: string) {
  const createdVendors: any[] = [];

  for (const vendor of vendors) {
    const { addresses, contacts, ...vendorData } = vendor;

    // Insert vendor first
    const [createdVendor] = await db
      .insert(vendorsTable)
      .values({
        ...vendorData,
        tenantId,
      })
      .returning();

    // Insert addresses
    if (addresses && addresses.length > 0) {
      await db.insert(addressesTable).values(
        addresses.map((addr: any) => ({
          ...addr,
          vendorId: createdVendor.id,
        }))
      );
    }

    // Insert contacts
    if (contacts && contacts.length > 0) {
      await db.insert(contactsTable).values(
        contacts.map((contact: any) => ({
          ...contact,
          vendorId: createdVendor.id,
        }))
      );
    }

    createdVendors.push(createdVendor);
  }

  return createdVendors;
}

async function createSequences(tenantId: string) {
  const sequences = [
    { name: "invoice_number", tenantId, nextValue: 1 },
    { name: "journal_entry_number", tenantId, nextValue: 10000 },
  ];

  await db.insert(sequencesTable).values(sequences);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seed completed");
    process.exit(0);
  });
