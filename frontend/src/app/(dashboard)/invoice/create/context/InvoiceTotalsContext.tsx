"use client";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";

import { DiscountType } from "../types";

import { useInvoiceLinesContext } from "./InvoiceLinesContext";

interface InvoiceTotalsContextType {
  discount: number;
  setDiscount: (v: number) => void;
  discountAmount: number;
  discountType: DiscountType;
  setDiscountType: (v: DiscountType) => void;
  salesTax: number;
  salesTaxRate: number;
  subtotal: number;
  taxableSubtotal: number;
  totalAmount: number;
}

const InvoiceTotalsContext = createContext<
  InvoiceTotalsContextType | undefined
>(undefined);

export function InvoiceTotalsProvider({ children }: { children: ReactNode }) {
  const { lines } = useInvoiceLinesContext();
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  // TODO: Automatically calculate the sales tax rate
  const [salesTaxRate, setSalesTaxRate] = useState(0);

  const subtotal = lines.reduce(
    (sum, line) =>
      line.type === "item" ? sum + line.quantity * line.unitAmount : sum,
    0
  );

  const discountAmount =
    discountType === "percentage" ? subtotal * (discount / 100) : discount;
  const taxableSubtotal = subtotal - discountAmount;
  const salesTax = taxableSubtotal * (salesTaxRate / 100);
  const totalAmount = taxableSubtotal + salesTax;

  console.log("subtotal", subtotal);

  const value = useMemo(
    () => ({
      discount,
      setDiscount,
      discountAmount,
      discountType,
      setDiscountType,
      salesTax,
      salesTaxRate,
      subtotal,
      taxableSubtotal,
      totalAmount,
    }),
    [
      discount,
      discountAmount,
      discountType,
      salesTax,
      salesTaxRate,
      subtotal,
      taxableSubtotal,
      totalAmount,
    ]
  );

  return (
    <InvoiceTotalsContext.Provider value={value}>
      {children}
    </InvoiceTotalsContext.Provider>
  );
}

export function useInvoiceTotalsContext() {
  const context = useContext(InvoiceTotalsContext);
  if (!context) {
    throw new Error(
      "useInvoiceTotalsContext must be used within InvoiceTotalsProvider"
    );
  }
  return context;
}
