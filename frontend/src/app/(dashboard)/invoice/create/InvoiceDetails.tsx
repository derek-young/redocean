import { useState } from "react";

import { useCreateInvoiceContext } from "./CreateInvoiceContext";

function InvoiceDetails() {
  const { onInputBlur, params } = useCreateInvoiceContext();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: params.get("invoice-number") ?? undefined,
    invoiceDate: params.get("invoice-date") ?? undefined,
    dueDate: params.get("due-date") ?? undefined,
    memo: params.get("invoice-memo") ?? undefined,
  });

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
            disabled
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
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Currency
          </label>
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="memo"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Memo/Notes
        </label>
        <textarea
          aria-label="Memo"
          name="invoice-memo"
          value={invoiceData.memo}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              memo: e.target.value,
            })
          }
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          rows={3}
          placeholder="Additional notes or terms for this invoice..."
        />
      </div>
    </div>
  );
}

export default InvoiceDetails;
