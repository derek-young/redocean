import { AccountType } from "@prisma/client";

export const accounts = [
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
