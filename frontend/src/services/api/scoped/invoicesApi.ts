import fetchClient from "@/fetch";
import { Invoice, InvoiceLine } from "@/types";

type InvoiceLineRequired = {
  quantity: InvoiceLine["quantity"];
  unitAmount: InvoiceLine["unitAmount"];
  lineAmount: InvoiceLine["lineAmount"];
};

type InvoiceRequired = {
  customerId: Invoice["customerId"];
  date: Invoice["date"];
  invoiceNumber: Invoice["invoiceNumber"];
  total: Invoice["total"];
  lines: (Partial<InvoiceLine> & InvoiceLineRequired)[];
};

export function createInvoice({
  tenantId,
  invoice,
}: {
  tenantId: string;
  invoice: Partial<Invoice> & InvoiceRequired;
}) {
  return fetchClient(`/api/v1/tenants/${tenantId}/invoices`, {
    method: "POST",
    body: JSON.stringify(invoice),
  });
}

export function getInvoiceSequenceNumber({ tenantId }: { tenantId: string }) {
  return fetchClient(`/api/v1/tenants/${tenantId}/invoices/sequence-number`);
}
