import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { useCreateInvoiceContext } from "./CreateInvoiceContext";
import InvoiceTerms, { Terms, calculateDueDate } from "./InvoiceTerms";

const today = () => {
  return new Date().toISOString().split("T")[0];
};

function InvoiceDetails() {
  const { onValueChange, params } = useCreateInvoiceContext();
  const [terms, setTerms] = useState<Terms>(Terms.DUE_ON_RECEIPT);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: params.get("invoice-number") ?? "",
    invoiceDate: params.get("invoice-date") ?? today(),
    dueDate: params.get("due-date") ?? "",
    memo: params.get("invoice-memo") ?? "",
  });

  useEffect(() => {
    if (invoiceData.invoiceDate && terms) {
      const newDueDate = calculateDueDate(invoiceData.invoiceDate, terms);
      if (newDueDate !== invoiceData.dueDate) {
        setInvoiceData((prev) => ({ ...prev, dueDate: newDueDate }));
        onValueChange("due-date", newDueDate);
      }
    }
    // Do not update the due date when the user sets the due date manually
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData.invoiceDate, terms, onValueChange]);

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onValueChange(name, value);
  };

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Invoice Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-fit">
          <label
            htmlFor="invoice-number"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Invoice Number
          </label>
          <Input
            aria-label="Invoice Number"
            className="w-fit"
            id="invoice-number"
            name="invoice-number"
            onBlur={onInputBlur}
            onChange={(e) => {
              setInvoiceData({
                ...invoiceData,
                invoiceNumber: e.target.value,
              });
            }}
            placeholder="INV-001"
            type="text"
            value={invoiceData.invoiceNumber}
          />
        </div>
        <div className="w-fit">
          <label
            htmlFor="invoice-date"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Invoice Date
          </label>
          <Input
            aria-label="Invoice Date"
            className="w-fit"
            id="invoice-date"
            name="invoice-date"
            onBlur={onInputBlur}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                invoiceDate: e.target.value,
              })
            }
            required
            type="date"
            value={invoiceData.invoiceDate}
          />
        </div>
        <div className="w-fit">
          <InvoiceTerms value={terms} onValueChange={setTerms} />
        </div>
        <div className="w-fit">
          <label
            htmlFor="due-date"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Due Date
          </label>
          <Input
            aria-label="Due Date"
            className="w-fit"
            id="due-date"
            name="due-date"
            onBlur={onInputBlur}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                dueDate: e.target.value,
              })
            }
            type="date"
            value={invoiceData.dueDate}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
