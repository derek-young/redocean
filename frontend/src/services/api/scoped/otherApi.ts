import fetchClient from "@/fetch";

export function getTaxRates({ tenantId }: { tenantId: string }) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }

  return fetchClient(`/api/v1/tenants/${tenantId}/tax-rates`);
}
