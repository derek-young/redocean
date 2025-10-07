"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useCreateInvoiceContext } from "./context/CreateInvoiceContext";
import CustomerSelection from "./CustomerSelection";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceLineItems from "./InvoiceLineItems";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceTotals from "./InvoiceTotals";

function CreateInvoice() {
  const { handleSubmit, isSubmitting } = useCreateInvoiceContext();

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
          <CustomerSelection />
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
