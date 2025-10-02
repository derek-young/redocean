"use client";

import { createContext, useContext, useMemo } from "react";

import Initializing from "@/components/Initializing";
import {
  getCustomers,
  getCustomer,
  getTaxRates,
  getVendor,
  getVendors,
} from "@/services/api/scoped";

import { useTenantContext } from "./TenantContext";

function createTenantApi(tenantId: string) {
  return {
    getCustomer: ({ customerId }: { customerId: string }) =>
      getCustomer({ tenantId, customerId }),
    getCustomers: () => getCustomers(tenantId),
    getVendor: ({ vendorId }: { vendorId: string }) =>
      getVendor({ tenantId, vendorId }),
    getVendors: () => getVendors(tenantId),
    getTaxRates: () => getTaxRates(tenantId),
  };
}

const TenantApiContext = createContext<
  ReturnType<typeof createTenantApi> | undefined
>(undefined);

export function TenantApiProvider({ children }: { children: React.ReactNode }) {
  const { selectedTenantId, isLoading } = useTenantContext();

  const api = useMemo(
    () => createTenantApi(selectedTenantId ?? ""),
    [selectedTenantId]
  );

  if (isLoading) {
    return <Initializing />;
  }

  return (
    <TenantApiContext.Provider value={api}>
      {children}
    </TenantApiContext.Provider>
  );
}

export const useTenantApi = () => {
  const context = useContext(TenantApiContext);
  if (!context) {
    throw new Error("useTenantApi must be used within TenantApiProvider");
  }
  return context;
};
