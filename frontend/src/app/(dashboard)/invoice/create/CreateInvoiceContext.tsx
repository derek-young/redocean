"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Loading from "@/components/Loading";
import { useTenantApi } from "@/context/TenantApiContext";

import { Terms, calculateDueDate } from "./InvoiceTerms";
import { DiscountType, InvoiceLine } from "./types";

function today() {
  return new Date().toISOString().split("T")[0];
}

interface CreateInvoiceContextType {
  discount: number;
  discountType: DiscountType;
  dueDate: string;
  invoiceDate: string;
  invoiceNumber: string;
  isLoadingSequenceNumber: boolean;
  lines: InvoiceLine[];
  memo: string;
  onValueChange: (paramName: string, value: string) => void;
  salesTaxRate: number;
  setDiscount: (value: number) => void;
  setDiscountType: (value: DiscountType) => void;
  setDueDate: (value: string) => void;
  setInvoiceDate: (value: string) => void;
  setInvoiceNumber: (value: string) => void;
  setLines: (value: InvoiceLine[]) => void;
  setMemo: (value: string) => void;
  setTerms: (value: Terms) => void;
  terms: Terms;
}

const CreateInvoiceContext = createContext<
  CreateInvoiceContextType | undefined
>(undefined);

function CreateInvoiceContextInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getInvoiceSequenceNumber } = useTenantApi();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const [isLoadingSequenceNumber, setIsLoadingSequenceNumber] = useState(false);
  const [lines, setLines] = useState<InvoiceLine[]>([
    {
      id: "1",
      type: "item",
      item: "",
      description: "",
      quantity: 1,
      unitAmount: 0,
      lineAmount: 0,
    },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState(
    params.get("invoice-number") ?? ""
  );
  const [invoiceDate, setInvoiceDate] = useState(
    params.get("invoice-date") ?? today()
  );
  const [dueDate, setDueDate] = useState(params.get("due-date") ?? "");
  const [memo, setMemo] = useState(params.get("invoice-memo") ?? "");
  const [terms, setTerms] = useState<Terms>(Terms.DUE_ON_RECEIPT);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  // TODO: Automatically calculate the sales tax rate
  const [salesTaxRate, setSalesTaxRate] = useState(0);

  const onValueChange = useCallback(
    (paramName: string, value: string) => {
      if (value !== params.get(paramName)) {
        if (value.trim() === "") {
          params.delete(paramName);
        } else {
          params.set(paramName, value);
        }
        router.push(`?${params.toString()}`);
      }
    },
    [router, params]
  );

  useEffect(() => {
    if (invoiceDate && terms) {
      const newDueDate = calculateDueDate(invoiceDate, terms);
      if (newDueDate !== dueDate) {
        setDueDate(newDueDate);
        onValueChange("due-date", newDueDate);
      }
    }
    // Do not update the due date when the user sets the due date manually
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceDate, terms, onValueChange]);

  useEffect(() => {
    const fetchInvoiceSequenceNumber = async () => {
      try {
        setIsLoadingSequenceNumber(true);
        const response = await getInvoiceSequenceNumber();
        const data = await response.json();
        setInvoiceNumber(data.nextNumber.toString());
        onValueChange("invoice-number", data.nextNumber);
      } catch (error) {
        console.error("Error fetching invoice sequence number:", error);
      } finally {
        setIsLoadingSequenceNumber(false);
      }
    };

    if (invoiceNumber === "") {
      fetchInvoiceSequenceNumber();
    }
  }, [getInvoiceSequenceNumber, invoiceNumber, onValueChange]);

  const value = useMemo(
    () => ({
      discount,
      discountType,
      dueDate,
      invoiceDate,
      invoiceNumber,
      isLoadingSequenceNumber,
      lines,
      memo,
      onValueChange,
      salesTaxRate,
      setDiscount,
      setDiscountType,
      setDueDate,
      setInvoiceDate,
      setInvoiceNumber,
      setLines,
      setMemo,
      setTerms,
      terms,
    }),
    [
      discount,
      discountType,
      dueDate,
      invoiceDate,
      invoiceNumber,
      isLoadingSequenceNumber,
      lines,
      memo,
      onValueChange,
      salesTaxRate,
      terms,
    ]
  );

  return (
    <CreateInvoiceContext.Provider value={value}>
      {children}
    </CreateInvoiceContext.Provider>
  );
}

export function CreateInvoiceContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      <CreateInvoiceContextInner>{children}</CreateInvoiceContextInner>
    </Suspense>
  );
}

export function useCreateInvoiceContext() {
  const context = useContext(CreateInvoiceContext);
  if (context === undefined) {
    throw new Error(
      "useCreateInvoiceContext must be used within a CreateInvoiceContextProvider"
    );
  }
  return context;
}
