import fetchClient from "@/fetch";

export function getCustomers({ tenantId }: { tenantId: string }) {
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
