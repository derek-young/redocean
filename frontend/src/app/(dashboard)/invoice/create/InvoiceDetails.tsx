import { useEffect, useState } from "react";

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
        <div>
          <label
            htmlFor="invoiceNumber"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Invoice Number
          </label>
          <input
            aria-label="Invoice Number"
            name="invoice-number"
            type="text"
            value={invoiceData.invoiceNumber}
            onBlur={onInputBlur}
            onChange={(e) => {
              setInvoiceData({
                ...invoiceData,
                invoiceNumber: e.target.value,
              });
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="INV-001"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Invoice Date
          </label>
          <input
            aria-label="Invoice Date"
            name="invoice-date"
            type="date"
            value={invoiceData.invoiceDate}
            onBlur={onInputBlur}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                invoiceDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            required
          />
        </div>
        <InvoiceTerms value={terms} onValueChange={setTerms} />
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Due Date
          </label>
          <input
            aria-label="Due Date"
            name="due-date"
            type="date"
            value={invoiceData.dueDate}
            onBlur={onInputBlur}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                dueDate: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
