"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  AddressModel,
  ContactModel,
  ContactType,
  CustomerModel,
} from "@/types";

import { useTenantApi } from "./TenantApiContext";

export interface CustomerOption {
  id: string;
  name: string;
  primaryContact?: ContactModel;
  primaryAddress?: AddressModel;
}

type CustomerWithRelations = CustomerModel & {
  addresses: AddressModel[];
  contacts: ContactModel[];
};

type SelectedCustomer = CustomerOption | null;

interface CustomerSelectionContextType {
  customers: CustomerOption[];
  isLoading: boolean;
  selectedCustomer: SelectedCustomer;
  setSelectedCustomer: (customer: SelectedCustomer) => void;
}

const CustomerSelectionContext = createContext<
  CustomerSelectionContextType | undefined
>(undefined);

export function CustomerSelectionProvider({
  children,
  onSelectedCustomerChange,
}: {
  children: React.ReactNode;
  onSelectedCustomerChange?: (customer: SelectedCustomer) => void;
}) {
  const { getCustomers } = useTenantApi();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await getCustomers();
        if (customersResponse.ok) {
          const customersData: CustomerWithRelations[] =
            await customersResponse.json();

          const customerOptions: CustomerOption[] = customersData.map(
            (customer) => ({
              id: customer.id,
              name: customer.name,
              primaryContact:
                customer.contacts.find((c) => c.type === ContactType.PRIMARY) ||
                customer.contacts[0],
              primaryAddress:
                customer.addresses.find((a) => a.isPrimary) ||
                customer.addresses[0],
            })
          );
          setCustomers(customerOptions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getCustomers]);

  useEffect(() => {
    if (onSelectedCustomerChange) {
      onSelectedCustomerChange(selectedCustomer);
    }
  }, [onSelectedCustomerChange, selectedCustomer]);

  const value: CustomerSelectionContextType = useMemo(
    () => ({
      customers,
      isLoading,
      selectedCustomer,
      setSelectedCustomer,
    }),
    [customers, isLoading, selectedCustomer]
  );

  return (
    <CustomerSelectionContext.Provider value={value}>
      {children}
    </CustomerSelectionContext.Provider>
  );
}

export function useCustomerSelectionContext() {
  const context = useContext(CustomerSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useCustomerSelectionContext must be used within a CustomerSelectionProvider"
    );
  }
  return context;
}
