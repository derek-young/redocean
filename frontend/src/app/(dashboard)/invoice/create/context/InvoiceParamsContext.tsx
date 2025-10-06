"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface InvoiceParamsContextType {
  params: URLSearchParams;
  setParam: (key: string, value: string) => void;
  deleteParam: (key: string) => void;
}

const InvoiceParamsContext = createContext<
  InvoiceParamsContextType | undefined
>(undefined);

export function InvoiceParamsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      if (value.trim() === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`?${params.toString()}`);
    },
    [router, params]
  );

  const deleteParam = useCallback(
    (key: string) => {
      params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [router, params]
  );

  const value = useMemo(
    () => ({ params, setParam, deleteParam }),
    [params, setParam, deleteParam]
  );

  return (
    <InvoiceParamsContext.Provider value={value}>
      {children}
    </InvoiceParamsContext.Provider>
  );
}

export function useInvoiceParams() {
  const context = useContext(InvoiceParamsContext);
  if (!context) {
    throw new Error(
      "useInvoiceParams must be used within InvoiceParamsProvider"
    );
  }
  return context;
}
