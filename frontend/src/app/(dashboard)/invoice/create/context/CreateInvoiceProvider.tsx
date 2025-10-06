"use client";
import { ReactNode, Suspense } from "react";

import Loading from "@/components/Loading";

import { InvoiceDetailsProvider } from "./InvoiceDetailsContext";
import { InvoiceLinesProvider } from "./InvoiceLinesContext";
import { InvoiceParamsProvider } from "./InvoiceParamsContext";
import { InvoiceTotalsProvider } from "./InvoiceTotalsContext";

function CreateInvoiceProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      <InvoiceParamsProvider>
        <InvoiceDetailsProvider>
          <InvoiceLinesProvider>
            <InvoiceTotalsProvider>{children}</InvoiceTotalsProvider>
          </InvoiceLinesProvider>
        </InvoiceDetailsProvider>
      </InvoiceParamsProvider>
    </Suspense>
  );
}

export default CreateInvoiceProvider;
