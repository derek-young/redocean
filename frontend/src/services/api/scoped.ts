import fetchClient from "@/fetch";

export function getCustomers(tenantId: string) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }
  return fetchClient(`/api/v1/tenants/${tenantId}/customers`);
}

export function getCustomer({
  tenantId,
  customerId,
}: {
  tenantId: string;
  customerId: string;
}) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }
  if (!customerId) {
    throw new Error("Customer ID is required");
  }

  return fetchClient(`/api/v1/tenants/${tenantId}/customers/${customerId}`);
}

export function getInvoiceSequenceNumber(tenantId: string) {
  return fetchClient(`/api/v1/tenants/${tenantId}/invoices/sequence-number`);
}

export function getVendors(tenantId: string) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }

  return fetchClient(`/api/v1/tenants/${tenantId}/vendors`);
}

export function getVendor({
  tenantId,
  vendorId,
}: {
  tenantId: string;
  vendorId: string;
}) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }
  if (!vendorId) {
    throw new Error("Vendor ID is required");
  }

  return fetchClient(`/api/v1/tenants/${tenantId}/vendors/${vendorId}`);
}

export function getTaxRates(tenantId: string) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }

  return fetchClient(`/api/v1/tenants/${tenantId}/tax-rates`);
}
