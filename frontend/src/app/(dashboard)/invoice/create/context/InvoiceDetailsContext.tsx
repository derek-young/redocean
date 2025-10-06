import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  ReactNode,
} from "react";

import { useTenantApi } from "@/context/TenantApiContext";

import { calculateDueDate } from "../InvoiceTerms";
import { Terms } from "../types";

import { useInvoiceParams } from "./InvoiceParamsContext";

function today() {
  return new Date().toISOString().split("T")[0];
}

interface InvoiceDetailsContextType {
  dueDate: string;
  invoiceDate: string;
  invoiceNumber: string;
  setDueDate: (value: string) => void;
  setInvoiceDate: (value: string) => void;
  setInvoiceNumber: (value: string) => void;
  setTerms: (value: Terms) => void;
  terms: Terms;
}

const InvoiceDetailsContext = createContext<
  InvoiceDetailsContextType | undefined
>(undefined);

export function InvoiceDetailsProvider({ children }: { children: ReactNode }) {
  const { params, setParam } = useInvoiceParams();
  const { getInvoiceSequenceNumber } = useTenantApi();

  const [invoiceNumber, setInvoiceNumber] = useState(
    params.get("invoice-number") ?? ""
  );
  const [invoiceDate, setInvoiceDate] = useState(
    params.get("invoice-date") ?? today()
  );
  const [terms, setTerms] = useState<Terms>(Terms.DUE_ON_RECEIPT);
  const [dueDate, setDueDate] = useState(params.get("due-date") ?? "");

  useEffect(() => {
    if (invoiceDate && terms) {
      const newDueDate = calculateDueDate(invoiceDate, terms);
      if (newDueDate !== dueDate) {
        setDueDate(newDueDate);
        setParam("due-date", newDueDate);
      }
    }
    // Do not update the due date when the user sets the due date manually
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceDate, terms]);

  useEffect(() => {
    const fetchInvoiceSequenceNumber = async () => {
      try {
        const response = await getInvoiceSequenceNumber();
        const data = await response.json();
        setInvoiceNumber(data.nextNumber.toString());
        setParam("invoice-number", data.nextNumber);
      } catch (error) {
        console.error("Error fetching invoice sequence number:", error);
      }
    };

    if (invoiceNumber === "") {
      fetchInvoiceSequenceNumber();
    }
  }, [getInvoiceSequenceNumber, invoiceNumber, setParam]);

  const value = useMemo(
    () => ({
      dueDate,
      invoiceDate,
      invoiceNumber,
      setDueDate,
      setInvoiceDate,
      setInvoiceNumber,
      setTerms,
      terms,
    }),
    [invoiceNumber, invoiceDate, terms, dueDate]
  );

  return (
    <InvoiceDetailsContext.Provider value={value}>
      {children}
    </InvoiceDetailsContext.Provider>
  );
}

export function useInvoiceDetailsContext() {
  const context = useContext(InvoiceDetailsContext);
  if (!context) {
    throw new Error(
      "useInvoiceDetailsContext must be used within InvoiceDetailsProvider"
    );
  }
  return context;
}
