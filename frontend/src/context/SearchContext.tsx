"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import useDebounce from "@/hooks/useDebounce";
import { Customer, Vendor } from "@/types";

import { useAssistantContext } from "./AssistantContext";

export interface Route {
  description: string;
  matchedAction: string;
  path: string;
}

export type HelpItem = {
  name: string;
};

export type SearchResults = {
  type: string;
  customers?: Customer[];
  vendors?: Vendor[];
  routes?: Route[];
  help: HelpItem[];
  searchTerm: string;
};

interface SearchContextType {
  hasResults: boolean;
  isSearching: boolean;
  onSubmitNLSearch: () => void;
  results: SearchResults | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

function doResultsExist(results: SearchResults | null) {
  return Boolean(
    results?.customers?.length ||
      results?.vendors?.length ||
      results?.routes?.length
  );
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const { openAndSubmit } = useAssistantContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const hasResults = doResultsExist(results);

  const onSubmitNLSearch = useCallback(() => {
    if (!searchTerm.trim()) return;
    openAndSubmit(searchTerm);
    setSearchTerm("");
  }, [openAndSubmit, searchTerm]);

  const onUserInput = async (debouncedSearchTerm: string) => {
    const searchTerm = debouncedSearchTerm.trim();
    if (!searchTerm) {
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch("/api/v1/search/quick", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      const data: SearchResults = await response.json();

      console.log("data", data);

      setResults({
        ...data,
        help: [
          {
            name: "Use deep search to cast a wider net",
          },
        ],
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    onUserInput(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults(null);
    }
  }, [searchTerm]);

  const value = useMemo(
    () => ({
      hasResults,
      isSearching,
      onSubmitNLSearch,
      searchTerm,
      setSearchTerm,
      results,
    }),
    [hasResults, isSearching, onSubmitNLSearch, searchTerm, results]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
