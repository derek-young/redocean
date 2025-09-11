"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

import useDebounce from "@/hooks/useDebounce";
import { Customer, Vendor } from "@/types";

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
  isSubmitting: boolean;
  onSubmitSearch: () => void;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);

  const searchTermRef = useRef(searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const hasResults = doResultsExist(results);

  searchTermRef.current = searchTerm;

  const onSubmitSearch = useCallback(async () => {
    if (!searchTermRef.current.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/search/natural", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      const data: SearchResults = await response.json();

      console.log("data", data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [searchTerm]);

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

      setResults({ ...data, help: [{ name: "Natural Language Search" }] });
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
      isSubmitting,
      onSubmitSearch,
      searchTerm,
      setSearchTerm,
      results,
    }),
    [onSubmitSearch, isSearching, isSubmitting, searchTerm, results, hasResults]
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
