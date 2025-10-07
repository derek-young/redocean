"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface CreateInvoiceContextType {
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const CreateInvoiceContext = createContext<
  CreateInvoiceContextType | undefined
>(undefined);

export function CreateInvoiceProvider({ children }: { children: ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // customerId    String
  // date          DateTime
  // dueDate       DateTime?
  // invoiceNumber String // Sequence
  // memo          String?
  // status        InvoiceStatus @default(DRAFT)
  // tenantId      String
  // total         Decimal       @db.Decimal(12, 2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("TODO");
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
