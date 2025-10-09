import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Route } from "@/context/SearchContext";
import { CustomerModel, VendorModel } from "@/types";

interface SearchResultsProps {
  onSelect: () => void;
}

export function CustomerResults({
  customers,
  onSelect,
}: SearchResultsProps & {
  customers: CustomerModel[];
}) {
  const router = useRouter();
  const handleSelect = (customer: CustomerModel) => {
    onSelect();
    router.push(`/customers/${customer.id}`);
  };

  return (
    <CommandGroup heading="Customers">
      {customers.map((customer) => (
        <CommandItem key={customer.id} onSelect={() => handleSelect(customer)}>
          {customer.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export function VendorResults({
  vendors,
  onSelect,
}: SearchResultsProps & {
  vendors: VendorModel[];
}) {
  const router = useRouter();
  const handleSelect = (vendor: VendorModel) => {
    onSelect();
    router.push(`/vendors/${vendor.id}`);
  };

  return (
    <CommandGroup heading="Vendors">
      {vendors.map((vendor) => (
        <CommandItem key={vendor.id} onSelect={() => handleSelect(vendor)}>
          {vendor.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export function RouteResults({
  routes,
  onSelect,
}: SearchResultsProps & {
  routes: Route[];
}) {
  const router = useRouter();
  const handleSelect = (route: Route) => {
    onSelect();
    router.push(route.path);
  };

  return (
    <CommandGroup heading="Routes">
      {routes.map((route) => (
        <CommandItem key={route.path} onSelect={() => handleSelect(route)}>
          <MoveRight className="h-4 w-4" />
          {route.matchedAction[0].toUpperCase()}
          {route.matchedAction.slice(1)}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
