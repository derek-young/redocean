import { Input } from "@/components/ui/input";

import { useCreateInvoiceContext } from "./CreateInvoiceContext";
import InvoiceTerms from "./InvoiceTerms";

function InvoiceDetails() {
  const {
    dueDate,
    invoiceDate,
    invoiceNumber,
    isLoadingSequenceNumber,
    onValueChange,
    setDueDate,
    setInvoiceDate,
    setInvoiceNumber,
    setTerms,
    terms,
  } = useCreateInvoiceContext();

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onValueChange(name, value);
  };

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Details
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
            className="w-fit no-spinner"
            id="invoice-number"
            name="invoice-number"
            onBlur={(e) => {
              const { name, value } = e.target;
              const rawValue = value.replace(/^0+/, "") || "0";

              onValueChange(name, rawValue);
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/^0+/, "") || "0";

              if (rawValue === "0") {
                setInvoiceNumber("");
              } else {
                setInvoiceNumber(rawValue);
              }
            }}
            placeholder={isLoadingSequenceNumber ? "Loading..." : "1001"}
            type="number"
            value={invoiceNumber ? invoiceNumber.padStart(4, "0") : ""}
          />
        </div>
        <div className="w-fit">
          <label
            htmlFor="invoice-date"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Issue Date
          </label>
          <Input
            aria-label="Issue Date"
            className="w-fit"
            id="invoice-date"
            name="invoice-date"
            onBlur={onInputBlur}
            onChange={(e) => setInvoiceDate(e.target.value)}
            required
            type="date"
            value={invoiceDate}
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
            onChange={(e) => setDueDate(e.target.value)}
            type="date"
            value={dueDate}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
