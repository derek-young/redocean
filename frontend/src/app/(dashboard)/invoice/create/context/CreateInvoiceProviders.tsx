import { ReactNode, Suspense } from "react";

import Loading from "@/components/Loading";

import { CreateInvoiceProvider } from "./CreateInvoiceContext";
import { InvoiceDetailsProvider } from "./InvoiceDetailsContext";
import { InvoiceLinesProvider } from "./InvoiceLinesContext";
import { InvoiceParamsProvider } from "./InvoiceParamsContext";
import { InvoiceTotalsProvider } from "./InvoiceTotalsContext";

function CreateInvoiceProviders({ children }: { children: ReactNode }) {
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
            <InvoiceTotalsProvider>
              <CreateInvoiceProvider>{children}</CreateInvoiceProvider>
            </InvoiceTotalsProvider>
          </InvoiceLinesProvider>
        </InvoiceDetailsProvider>
      </InvoiceParamsProvider>
    </Suspense>
  );
}

export default CreateInvoiceProviders;
