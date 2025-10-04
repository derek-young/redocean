"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
  useMemo,
} from "react";

import Loading from "@/components/Loading";

interface CreateInvoiceContextType {
  onValueChange: (paramName: string, value: string) => void;
  params: URLSearchParams;
}

const CreateInvoiceContext = createContext<
  CreateInvoiceContextType | undefined
>(undefined);

function CreateInvoiceContextInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

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

  const value = useMemo(
    () => ({
      onValueChange,
      params,
    }),
    [onValueChange, params]
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
