import { PlusIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTenantApi } from "@/context/TenantApiContext";
import { Customer, Contact, ContactType, Address } from "@/types";

interface CustomerOption {
  id: string;
  name: string;
  primaryContact?: Contact;
  primaryAddress?: Address;
}

function FormattedAddress({ address }: { address?: Address }) {
  if (!address) return "";
  const streets = [address.street1, address.street2, address.street3].filter(
    Boolean
  );

  const rest = [
    address.city,
    address.state,
    address.zip,
    address.country !== "US" ? address.country : undefined,
  ].filter(Boolean);
  return (
    <>
      {streets.join(", ")}
      <br />
      {rest.join(", ")}
    </>
  );
}

interface CustomerDropdownProps {
  customers: CustomerOption[];
  setSelectedCustomer: (customer: CustomerOption) => void;
  ref: React.RefObject<HTMLInputElement | null>;
}

const CustomerDropdown = ({
  customers,
  setSelectedCustomer,
  ref,
}: CustomerDropdownProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBlur = () => {
    // Small delay to allow onSelect to fire first
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Command>
        <CommandInput
          aria-label="Select a customer"
          name="customer-select"
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          placeholder="Select a customer"
          ref={ref}
          required
        />
        {isFocused && (
          <CommandList>
            <CommandGroup heading="Customers">
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  onSelect={() => setSelectedCustomer(customer)}
                >
                  {customer.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandItem forceMount>
              <PlusIcon className="shrink-0 text-muted-foreground" />
              <span>Create new customer</span>
            </CommandItem>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

function CustomerInformation({
  customer,
  onChangeCustomer,
}: {
  customer: CustomerOption;
  onChangeCustomer: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <h3 className="font-semibold text-foreground">{customer.name}</h3>
          {customer.primaryContact && (
            <div className="text-sm text-muted-foreground">
              <div>{customer.primaryContact.email}</div>
              {customer.primaryContact.phone && (
                <div>{customer.primaryContact.phone}</div>
              )}
            </div>
          )}
          {customer.primaryAddress && (
            <div className="text-sm text-muted-foreground mt-1">
              <FormattedAddress address={customer.primaryAddress} />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onChangeCustomer}
        >
          Change Customer
        </Button>
      </div>
    </div>
  );
}

function CustomerSelection() {
  const { getCustomers } = useTenantApi();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await getCustomers();
        if (customersResponse.ok) {
          const customersData: Customer[] = await customersResponse.json();
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

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      {selectedCustomer ? (
        <CustomerInformation
          customer={selectedCustomer}
          onChangeCustomer={() => {
            setSelectedCustomer(null);

            // Small delay to allow the customer dropdown to render
            focusTimeoutRef.current = setTimeout(() => {
              customerInputRef.current?.focus();
            }, 150);
          }}
        />
      ) : (
        <CustomerDropdown
          customers={customers}
          setSelectedCustomer={setSelectedCustomer}
          ref={customerInputRef}
        />
      )}
    </div>
  );
}

export default CustomerSelection;
