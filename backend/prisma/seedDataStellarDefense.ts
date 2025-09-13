import { ContactType, BankAccountType } from "@prisma/client";

export const bankAccounts = [
  {
    name: "Stellar Defense Fleet Checking",
    accountNumberMasked: "XXXX1234",
    routingNumberMasked: "XXXX0000",
    type: BankAccountType.CHECKING,
  },
];

export const customerData = [
  {
    name: "Andromeda Defense",
    addresses: [
      {
        street1: "1000 Fleet Headquarters Plaza",
        city: "Andromeda Station",
        state: "Military District",
        zip: "AD-3000",
      },
    ],
    contacts: [
      {
        email: "commander.andromeda@defensecommand.mil",
        firstName: "Commander",
        lastName: "Andromeda",
        phone: "+1-555-0101",
        type: ContactType.PRIMARY,
      },
      {
        email: "admiral.nebula@defensecommand.mil",
        firstName: "Admiral",
        lastName: "Nebula",
        phone: "+1-555-0102",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Sirius Battle Group",
    addresses: [
      {
        street1: "777 Stellar Fleet Drive",
        city: "Sirius Prime",
        state: "Battle Zone Alpha",
        zip: "SB-8.6",
      },
    ],
    contacts: [
      {
        email: "captain.sirius@battlegroup.mil",
        firstName: "Captain",
        lastName: "Sirius",
        phone: "+1-555-0201",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Vega Weapons Research",
    addresses: [
      {
        street1: "42 Armament Boulevard",
        city: "Vega Station",
        state: "Research Sector",
        zip: "VR-25.04",
      },
    ],
    contacts: [
      {
        email: "director.vega@weaponsresearch.mil",
        firstName: "Director",
        lastName: "Vega",
        phone: "+1-555-0301",
        type: ContactType.PRIMARY,
      },
      {
        email: "chief.scientist@weaponsresearch.mil",
        firstName: "Chief",
        lastName: "Scientist",
        phone: "+1-555-0302",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Pleiades Shield Corporation",
    addresses: [
      {
        street1: "444 Protective Barrier Lane",
        city: "Pleiades Cluster",
        state: "Defense Grid",
        zip: "PS-440",
      },
    ],
    contacts: [
      {
        email: "shield.master@pleiadesshield.com",
        firstName: "Shield",
        lastName: "Master",
        phone: "+1-555-0401",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Cygnus Intelligence Division",
    addresses: [
      {
        street1: "99 Classified Information Way",
        city: "Cygnus Base",
        state: "Top Secret Sector",
        zip: "CI-61",
      },
    ],
    contacts: [
      {
        email: "agent.cygnus@intel.mil",
        firstName: "Agent",
        lastName: "Cygnus",
        phone: "+1-555-0501",
        type: ContactType.PRIMARY,
      },
      {
        email: "operative.swan@intel.mil",
        firstName: "Operative",
        lastName: "Swan",
        phone: "+1-555-0502",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Ursa Major Fleet Operations",
    addresses: [
      {
        street1: "88 Bear Constellation Drive",
        city: "Ursa Station",
        state: "Fleet Command",
        zip: "UM-80",
      },
    ],
    contacts: [
      {
        email: "commodore.ursa@fleetops.mil",
        firstName: "Commodore",
        lastName: "Ursa",
        phone: "+1-555-0601",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Cassiopeia Defense Systems",
    addresses: [
      {
        street1: "157 Queen's Throne Plaza",
        city: "Cassiopeia Station",
        state: "Royal Defense",
        zip: "CD-157",
      },
    ],
    contacts: [
      {
        email: "royal.defender@cassiopedia.mil",
        firstName: "Royal",
        lastName: "Defender",
        phone: "+1-555-0701",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Orion Security Forces",
    addresses: [
      {
        street1: "914 Hunter's Bow Street",
        city: "Orion Base",
        state: "Security Zone",
        zip: "OS-914",
      },
    ],
    contacts: [
      {
        email: "security.chief@orion.mil",
        firstName: "Security",
        lastName: "Chief",
        phone: "+1-555-0801",
        type: ContactType.PRIMARY,
      },
      {
        email: "guard.captain@orion.mil",
        firstName: "Guard",
        lastName: "Captain",
        phone: "+1-555-0802",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Polaris Navigation Command",
    addresses: [
      {
        street1: "1 North Star Avenue",
        city: "Polaris Station",
        state: "Navigation Sector",
        zip: "PN-1",
      },
    ],
    contacts: [
      {
        email: "navigator.polaris@navcom.mil",
        firstName: "Navigator",
        lastName: "Polaris",
        phone: "+1-555-0901",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Draco Tactical Unit",
    addresses: [
      {
        street1: "1083 Dragon's Head Plaza",
        city: "Draco Station",
        state: "Tactical Operations",
        zip: "DT-1083",
      },
    ],
    contacts: [
      {
        email: "tactical.dragon@draco.mil",
        firstName: "Tactical",
        lastName: "Dragon",
        phone: "+1-555-1001",
        type: ContactType.PRIMARY,
      },
    ],
  },
];

export const vendorData = [
  {
    name: "Photon Cannon Industries",
    addresses: [
      {
        street1: "300 Light Speed Boulevard",
        city: "Photon City",
        state: "Weapons District",
        zip: "PC-300000",
      },
    ],
    contacts: [
      {
        email: "ceo.photon@cannonindustries.com",
        firstName: "CEO",
        lastName: "Photon",
        phone: "+1-555-2001",
        type: ContactType.PRIMARY,
      },
      {
        email: "engineer.laser@cannonindustries.com",
        firstName: "Engineer",
        lastName: "Laser",
        phone: "+1-555-2002",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Quantum Shield Technologies",
    addresses: [
      {
        street1: "666 Barrier Matrix Drive",
        city: "Quantum Station",
        state: "Protection Zone",
        zip: "QS-666",
      },
    ],
    contacts: [
      {
        email: "quantum.master@shieldtech.com",
        firstName: "Quantum",
        lastName: "Master",
        phone: "+1-555-3001",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Hyperdrive Propulsion Systems",
    addresses: [
      {
        street1: "42 Warp Speed Lane",
        city: "Hyperdrive Bay",
        state: "Propulsion Sector",
        zip: "HP-42",
      },
    ],
    contacts: [
      {
        email: "propulsion.expert@hyperdrive.com",
        firstName: "Propulsion",
        lastName: "Expert",
        phone: "+1-555-4001",
        type: ContactType.PRIMARY,
      },
      {
        email: "warp.specialist@hyperdrive.com",
        firstName: "Warp",
        lastName: "Specialist",
        phone: "+1-555-4002",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Stealth Cloak Manufacturing",
    addresses: [
      {
        street1: "999 Invisible Street",
        city: "Stealth City",
        state: "Hidden District",
        zip: "SC-999",
      },
    ],
    contacts: [
      {
        email: "cloak.master@stealth.com",
        firstName: "Cloak",
        lastName: "Master",
        phone: "+1-555-5001",
        type: ContactType.PRIMARY,
      },
    ],
  },
  {
    name: "Plasma Corp",
    addresses: [
      {
        street1: "777 Energy Weapon Plaza",
        city: "Plasma Station",
        state: "Munitions Zone",
        zip: "PT-777",
      },
    ],
    contacts: [
      {
        email: "torpedo.chief@plasmacorp.com",
        firstName: "Torpedo",
        lastName: "Chief",
        phone: "+1-555-6001",
        type: ContactType.PRIMARY,
      },
      {
        email: "plasma.engineer@plasmacorp.com",
        firstName: "Plasma",
        lastName: "Engineer",
        phone: "+1-555-6002",
        type: ContactType.SECONDARY,
      },
    ],
  },
  {
    name: "Stellar Communications Network",
    addresses: [
      {
        street1: "88 Signal Relay Boulevard",
        city: "Communication Hub",
        state: "Network District",
        zip: "SCN-88",
      },
    ],
    contacts: [
      {
        email: "network.admin@stellarcom.com",
        firstName: "Network",
        lastName: "Admin",
        phone: "+1-555-7001",
        type: ContactType.PRIMARY,
      },
    ],
  },
];
