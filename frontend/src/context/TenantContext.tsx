"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getTenants } from "@/services/api";
import { TenantModel } from "@/types";

interface TenantContextType {
  isLoading: boolean;
  selectedTenant: TenantModel | null;
  selectedTenantId?: string;
  onSelectedTenantIdChange: (tenantId: string) => void;
  tenants: TenantModel[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const SELECTED_TENANT_KEY = "redocean_selected_tenant_id";

export function TenantContextProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<TenantModel[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await getTenants();

        if (!response.ok) {
          throw new Error("Failed to fetch tenants");
        }

        const data: TenantModel[] = await response.json();

        setTenants(data);

        if (data.length > 0) {
          const savedTenantId = localStorage.getItem(SELECTED_TENANT_KEY);
          const savedTenant = data.find((t) => t.id === savedTenantId) ?? null;

          setSelectedTenantId(savedTenant?.id ?? data[0].id);
        }
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const onSelectedTenantIdChange = useCallback((tenantId: string) => {
    setSelectedTenantId(tenantId);
    localStorage.setItem(SELECTED_TENANT_KEY, tenantId);
  }, []);

  const selectedTenant = useMemo(
    () => tenants.find((t) => t.id === selectedTenantId) ?? null,
    [tenants, selectedTenantId]
  );

  const value = useMemo(
    () => ({
      isLoading,
      selectedTenant,
      selectedTenantId,
      onSelectedTenantIdChange,
      tenants,
    }),
    [
      isLoading,
      selectedTenantId,
      selectedTenant,
      onSelectedTenantIdChange,
      tenants,
    ]
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenantContext(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error(
      "useTenantContext must be used within a TenantContextProvider"
    );
  }
  return context;
}
