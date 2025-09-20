"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface CreateInvoiceContextType {
  onInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  params: URLSearchParams;
}

const CreateInvoiceContext = createContext<
  CreateInvoiceContextType | undefined
>(undefined);

export function CreateInvoiceContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const onInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (value !== params.get(name)) {
        params.set(name, value);
        router.push(`?${params.toString()}`);
      }
    },
    [router, params]
  );

  const value = useMemo(
    () => ({
      onInputBlur,
      params,
    }),
    [onInputBlur, params]
  );

  return (
    <CreateInvoiceContext.Provider value={value}>
      {children}
    </CreateInvoiceContext.Provider>
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
