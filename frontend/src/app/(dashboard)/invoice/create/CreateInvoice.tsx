"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import CustomerSelection from "./CustomerSelection";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceLineItems, { InvoiceLine } from "./InvoiceLineItems";

function CreateInvoice() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const subtotal = lines.reduce(
    (sum, line) => (line.type === "item" ? sum + line.lineAmount : sum),
    0
  );
  const totalAmount = subtotal;

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
        <CustomerSelection />
        <InvoiceDetails />
        <InvoiceLineItems lines={lines} setLines={setLines} />

        <div className="bg-card rounded-lg shadow p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Invoice Totals
          </h2>
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-lg font-semibold">
                <span className="text-foreground">Total Amount:</span>
                <span className="text-foreground">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Note: Tax calculations are applied per line item based on
                  selected tax rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button asChild variant="outline" size="lg">
            <Link href="/">Cancel</Link>
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
