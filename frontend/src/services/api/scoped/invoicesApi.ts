import fetchClient from "@/fetch";
import { InvoiceModel, InvoiceLineModel } from "@/types";

type InvoiceLineRequired = {
  quantity: InvoiceLineModel["quantity"];
  unitAmount: InvoiceLineModel["unitAmount"];
  lineAmount: InvoiceLineModel["lineAmount"];
};

type InvoiceRequired = {
  customerId: InvoiceModel["customerId"];
  date: InvoiceModel["date"];
  invoiceNumber: InvoiceModel["invoiceNumber"];
  total: InvoiceModel["total"];
  lines: (Partial<InvoiceLineModel> & InvoiceLineRequired)[];
};

export function createInvoice({
  tenantId,
  invoice,
}: {
  tenantId: string;
  invoice: Partial<InvoiceModel> & InvoiceRequired;
}) {
  return fetchClient(`/api/v1/tenants/${tenantId}/invoices`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(invoice),
  });
}

export function getInvoiceSequenceNumber({ tenantId }: { tenantId: string }) {
  return fetchClient(`/api/v1/tenants/${tenantId}/invoices/sequence-number`);
}
