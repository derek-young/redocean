"use client";

import { Anchor } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { HelpItem } from "@/context/SearchContext";
import { SearchProvider, useSearchContext } from "@/context/SearchContext";

import Loading from "../Loading";

import { CustomerResults, RouteResults, VendorResults } from "./SearchResults";

function SearchBar() {
  const {
    results,
    searchTerm,
    setSearchTerm,
    isSearching,
    isSubmitting,
    onSubmitSearch,
  } = useSearchContext();

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
          aria-label="Search"
          value={searchTerm}
          onValueChange={setSearchTerm}
          placeholder="Search in RedOcean"
        >
          {(isSearching || isSubmitting) && <Loading width={16} height={16} />}
        </CommandInput>
        <CommandList>
          {customers.length > 0 && <CustomerResults customers={customers} />}
          {vendors.length > 0 && <VendorResults vendors={vendors} />}
          {routes.length > 0 && <RouteResults routes={routes} />}
          {help.length > 0 && (
            <CommandGroup>
              {help.map((h: HelpItem) => (
                <CommandItem key={h.name} onSelect={onSubmitSearch}>
                  <Anchor />
                  <span>{h.name}</span>
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
