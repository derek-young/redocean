"use client";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";

import { InvoiceLineModel } from "@/types";

import { LineItemType } from "../types";

type InvoiceLine = {
  description: InvoiceLineModel["description"];
  itemId: InvoiceLineModel["itemId"];
  lineAmount: InvoiceLineModel["lineAmount"];
  quantity: InvoiceLineModel["quantity"];
  unitAmount: InvoiceLineModel["unitAmount"];
  type: LineItemType;
};

interface InvoiceLinesContextType {
  lines: InvoiceLine[];
  setLines: (lines: InvoiceLine[]) => void;
}

const InvoiceLinesContext = createContext<InvoiceLinesContextType | undefined>(
  undefined
);

export function InvoiceLinesProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<InvoiceLine[]>([
    {
      type: "item",
      itemId: "",
      description: "",
      quantity: 1,
      unitAmount: 0,
      lineAmount: 0,
    },
  ]);

  const value = useMemo(() => ({ lines, setLines }), [lines]);

  return (
    <InvoiceLinesContext.Provider value={value}>
      {children}
    </InvoiceLinesContext.Provider>
  );
}

export function useInvoiceLinesContext() {
  const context = useContext(InvoiceLinesContext);
  if (!context) {
    throw new Error(
      "useInvoiceLinesContext must be used within InvoiceLinesProvider"
    );
  }
  return context;
}
