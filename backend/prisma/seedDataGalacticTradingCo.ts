import { ContactType, Customer, Vendor } from "@prisma/client";

export const customerData = [
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
    contacts: [
      {
        email: "spice.lord@orionspice.com",
        firstName: "Spice",
        lastName: "Lord",
        phone: "+1-970-555-1516",
        type: ContactType.PRIMARY,
      },
      {
        email: "cinnamon.queen@orionspice.com",
        firstName: "Cinnamon",
        lastName: "Queen",
        phone: "+1-970-555-1718",
        type: ContactType.SECONDARY,
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
    contacts: [
      {
        email: "terra.former@tauceti.com",
        firstName: "Terra",
        lastName: "Former",
        phone: "+1-970-555-1920",
        type: ContactType.PRIMARY,
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
    contacts: [
      {
        email: "royal.majesty@betelgeuse.com",
        firstName: "Royal",
        lastName: "Majesty",
        phone: "+1-970-555-2122",
        type: ContactType.PRIMARY,
      },
      {
        email: "princess.stellar@betelgeuse.com",
        firstName: "Princess",
        lastName: "Stellar",
        type: ContactType.SECONDARY,
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

export const vendorData = [
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
    contacts: [
      {
        email: "zara.quantum@darkmatterrefinery.com",
        firstName: "Zara",
        lastName: "Quantum",
        phone: "+1-970-555-1234",
        type: ContactType.PRIMARY,
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
    contacts: [
      {
        email: "frost.iceberg@cryovault.com",
        firstName: "Frost",
        lastName: "Iceberg",
        phone: "+1-970-555-5678",
        type: ContactType.PRIMARY,
      },
      {
        email: "chill.penguin@cryovault.com",
        firstName: "Chill",
        lastName: "Penguin",
        phone: "+1-970-555-9101",
        type: ContactType.SECONDARY,
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
    contacts: [
      {
        email: "nova.starburst@novafuel.com",
        firstName: "Nova",
        lastName: "Starburst",
        phone: "+1-970-555-1314",
        type: ContactType.PRIMARY,
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
