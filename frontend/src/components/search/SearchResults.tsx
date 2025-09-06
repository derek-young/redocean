import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Customer, Vendor } from "@/types";

interface Route {
  path: string;
  fields: string[];
}

export function CustomerResults({ customers }: { customers: Customer[] }) {
  return (
    <CommandGroup heading="Customers">
      {customers.map((customer) => (
        <CommandItem
          key={customer.id}
          onSelect={() => console.log("customer", customer)}
        >
          {customer.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export function VendorResults({ vendors }: { vendors: Vendor[] }) {
  return (
    <CommandGroup heading="Vendors">
      {vendors.map((vendor) => (
        <CommandItem
          key={vendor.id}
          onSelect={() => console.log("vendor", vendor)}
        >
          {vendor.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export function RouteResults({ routes }: { routes: Route[] }) {
  return (
    <CommandGroup heading="Routes">
      {routes.map((route) => (
        <CommandItem
          key={route.path}
          onSelect={() => console.log("route", route)}
        >
          {route.path}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
