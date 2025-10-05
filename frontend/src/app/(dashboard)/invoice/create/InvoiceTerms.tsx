import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export enum Terms {
  DUE_ON_RECEIPT = "due-on-receipt",
  NET_15 = "net-15",
  NET_30 = "net-30",
  NET_60 = "net-60",
}

export const calculateDueDate = (invoiceDate: string, terms: Terms): string => {
  if (!invoiceDate) return "";

  const date = new Date(invoiceDate);

  switch (terms) {
    case Terms.DUE_ON_RECEIPT:
      return invoiceDate;
    case Terms.NET_15:
      date.setDate(date.getDate() + 15);
      break;
    case Terms.NET_30:
      date.setDate(date.getDate() + 30);
      break;
    case Terms.NET_60:
      date.setDate(date.getDate() + 60);
      break;
    default:
      return "";
  }

  return date.toISOString().split("T")[0];
};

function InvoiceTerms({
  onValueChange,
  value = Terms.DUE_ON_RECEIPT,
}: {
  onValueChange: (value: Terms) => void;
  value?: Terms;
}) {
  return (
    <>
      <label
        htmlFor="terms"
        className="block text-sm font-medium text-foreground mb-2"
      >
        Terms
      </label>
      <Select name="invoice-terms" value={value} onValueChange={onValueChange}>
        <SelectTrigger id="terms" className="w-43">
          <SelectValue placeholder="Select payment terms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Terms.DUE_ON_RECEIPT}>Due on Receipt</SelectItem>
          <SelectItem value={Terms.NET_15}>Net 15</SelectItem>
          <SelectItem value={Terms.NET_30}>Net 30</SelectItem>
          <SelectItem value={Terms.NET_60}>Net 60</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

export default InvoiceTerms;
