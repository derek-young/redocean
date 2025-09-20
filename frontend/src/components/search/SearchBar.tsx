"use client";

import { SearchIcon } from "lucide-react";

import Loading from "@/components/Loading";
import ShipWheelIcon from "@/components/ShipWheelIcon";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { HelpItem } from "@/context/SearchContext";
import { SearchProvider, useSearchContext } from "@/context/SearchContext";

import { CustomerResults, RouteResults, VendorResults } from "./SearchResults";

function SearchBar() {
  const { results, searchTerm, setSearchTerm, isSearching, onSubmitNLSearch } =
    useSearchContext();

  const {
    customers = [],
    vendors = [],
    routes = [],
    help = [],
  } = results ?? {};

  return (
    <div className="relative">
      <Command shouldFilter={false}>
        <CommandInput
          icon={<SearchIcon className="size-4 shrink-0 text-red-500" />}
          name="global-search"
          onValueChange={setSearchTerm}
          placeholder="Search in RedOcean"
          value={searchTerm}
        >
          {isSearching && <Loading width={16} height={16} />}
        </CommandInput>
        <CommandList>
          {customers.length > 0 && (
            <CustomerResults
              customers={customers}
              onSelect={() => setSearchTerm("")}
            />
          )}
          {vendors.length > 0 && (
            <VendorResults
              vendors={vendors}
              onSelect={() => setSearchTerm("")}
            />
          )}
          {routes.length > 0 && (
            <RouteResults routes={routes} onSelect={() => setSearchTerm("")} />
          )}
          {help.length > 0 && (
            <CommandGroup className="border-t border-border">
              {help.map((h: HelpItem) => (
                <CommandItem key={h.name} onSelect={onSubmitNLSearch}>
                  <ShipWheelIcon />
                  <span>
                    <i>{h.name}</i>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

export default function SearchBarWithProvider() {
  return (
    <SearchProvider>
      <SearchBar />
    </SearchProvider>
  );
}
