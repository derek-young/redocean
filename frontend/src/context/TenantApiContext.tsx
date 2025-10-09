"use client";

import { createContext, useContext, useMemo } from "react";

import Initializing from "@/components/Initializing";
import * as scopedApi from "@/services/api/scoped";

import { useTenantContext } from "./TenantContext";

type ArgsWithoutTenantId<T> = T extends (args: infer A) => unknown
  ? A extends { tenantId: string }
    ? Omit<A, "tenantId">
    : never
  : never;

type CreateInvoiceArgs = ArgsWithoutTenantId<typeof scopedApi.createInvoice>;
type GetCustomerArgs = ArgsWithoutTenantId<typeof scopedApi.getCustomer>;
type GetVendorArgs = ArgsWithoutTenantId<typeof scopedApi.getVendor>;

function createTenantApi(tenantId: string) {
  return {
    createInvoice: ({ invoice }: CreateInvoiceArgs) =>
      scopedApi.createInvoice({ tenantId, invoice }),
    getCustomer: ({ customerId }: GetCustomerArgs) =>
      scopedApi.getCustomer({ tenantId, customerId }),
    getCustomers: () => scopedApi.getCustomers({ tenantId }),
    getInvoiceSequenceNumber: () =>
      scopedApi.getInvoiceSequenceNumber({ tenantId }),
    getVendor: ({ vendorId }: GetVendorArgs) =>
      scopedApi.getVendor({ tenantId, vendorId }),
    getVendors: () => scopedApi.getVendors({ tenantId }),
    getTaxRates: () => scopedApi.getTaxRates({ tenantId }),
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
    return <Initializing message="Loading Tenants..." />;
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
