export function getTenants() {
  return fetch("/api/v1/tenants");
}

export function postSearchNatural({
  tenantIds,
  searchTerm,
}: {
  tenantIds: string[];
  searchTerm: string;
}) {
  return fetch("/api/v1/search/natural", {
    method: "POST",
    body: JSON.stringify({ searchTerm, tenantIds }),
  });
}

export function postSearchQuick({
  tenantIds,
  searchTerm,
}: {
  tenantIds: string[];
  searchTerm: string;
}) {
  return fetch("/api/v1/search/quick", {
    method: "POST",
    body: JSON.stringify({ searchTerm, tenantIds }),
  });
}
