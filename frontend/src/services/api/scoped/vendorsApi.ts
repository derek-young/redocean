import fetchClient from "@/fetch";

export function getVendors({ tenantId }: { tenantId: string }) {
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
