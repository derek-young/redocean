import { useState } from "react";

function InvoiceDetails() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    memo: "",
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
            type="text"
            value={invoiceData.invoiceNumber}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                invoiceNumber: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="INV-001"
            required
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
            type="date"
            value={invoiceData.date}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                date: e.target.value,
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
            type="date"
            value={invoiceData.dueDate}
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
