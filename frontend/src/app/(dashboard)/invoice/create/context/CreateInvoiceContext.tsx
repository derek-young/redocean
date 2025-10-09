"use client";

import { createContext, ReactNode, useContext, useState } from "react";

import { useTenantApi } from "@/context/TenantApiContext";

import { useInvoiceDetailsContext } from "./InvoiceDetailsContext";
import { useInvoiceLinesContext } from "./InvoiceLinesContext";
import { useInvoiceParams } from "./InvoiceParamsContext";
import { useInvoiceTotalsContext } from "./InvoiceTotalsContext";

interface CreateInvoiceContextType {
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const CreateInvoiceContext = createContext<
  CreateInvoiceContextType | undefined
>(undefined);

export function CreateInvoiceProvider({ children }: { children: ReactNode }) {
  const { createInvoice } = useTenantApi();
  const { params } = useInvoiceParams();
  const { lines } = useInvoiceLinesContext();
  const { discountAmount, salesTax, totalAmount } = useInvoiceTotalsContext();
  const { dueDate, invoiceDate, invoiceNumber } = useInvoiceDetailsContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("lines", lines);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createInvoice({
        invoice: {
          customerId: params.get("customer-id") ?? "",
          date: new Date(invoiceDate),
          discount: discountAmount,
          dueDate: new Date(dueDate),
          invoiceNumber,
          lines,
          total: totalAmount,
          salesTax: salesTax,
        },
      });

      console.log("response", response);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error creating invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateInvoiceContext.Provider value={{ handleSubmit, isSubmitting }}>
      {children}
    </CreateInvoiceContext.Provider>
  );
}

export function useCreateInvoiceContext() {
  const context = useContext(CreateInvoiceContext);
  if (context === undefined) {
    throw new Error(
      "useCreateInvoiceContext must be used within a CreateInvoiceProvider"
    );
  }
  return context;
}
