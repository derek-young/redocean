"use client";

import Link from "next/link";
import { useCallback } from "react";

import CustomerSelection from "@/components/CustomerSelection";
import { Button } from "@/components/ui/button";

import { useCreateInvoiceContext } from "./context/CreateInvoiceContext";
import { useInvoiceParams } from "./context/InvoiceParamsContext";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceLineItems from "./InvoiceLineItems";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceTotals from "./InvoiceTotals";

function CreateInvoice() {
  const { deleteParam, setParam } = useInvoiceParams();
  const { handleSubmit, isSubmitting } = useCreateInvoiceContext();

  const onSelectedCustomerChange = useCallback(
    (customer: { id: string } | null) => {
      if (customer) {
        setParam("customer-id", customer.id);
      } else {
        deleteParam("customer-id");
      }
    },
    [deleteParam, setParam]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
        <Link
          href="/invoice/list"
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Invoices
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CustomerSelection
            onSelectedCustomerChange={onSelectedCustomerChange}
          />
          <InvoiceDetails />
        </div>
        <InvoiceLineItems />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InvoiceNotes />
          <InvoiceTotals />
        </div>
        <div className="flex justify-end space-x-4">
          <Button asChild variant="outline" size="lg">
            <Link href="/invoice/list">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="default"
            size="lg"
          >
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;
