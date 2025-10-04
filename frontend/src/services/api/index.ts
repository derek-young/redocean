import fetchClient from "@/fetch";

export function getTenants() {
  return fetchClient("/api/v1/tenants");
}

export function postSearchNatural({
  tenantIds,
  searchTerm,
}: {
  tenantIds: string[];
  searchTerm: string;
}) {
  return fetchClient("/api/v1/search/natural", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  return fetchClient("/api/v1/search/quick", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ searchTerm, tenantIds }),
  });
}

export function postSession(idToken: string) {
  return fetchClient("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
}
