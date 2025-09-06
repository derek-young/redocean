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

interface Route {
  path: string;
  fields: string[];
}

interface SearchResponse {
  type: string;
  customers?: Customer[];
  vendors?: Vendor[];
  routes?: Route[];
  searchTerm: string;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  onSubmitSearch: (e: React.FormEvent) => void;
  results: SearchResponse | null;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

function doResultsExist(results: SearchResponse | null) {
  return (
    results?.customers?.length &&
    results?.vendors?.length &&
    results?.routes?.length
  );
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);

  const searchTermRef = useRef(searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const hasResults = doResultsExist(results);

  searchTermRef.current = searchTerm;

  const onSubmitSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTermRef.current.trim()) return;

    setIsSearching(true);

    try {
      console.log("searchTerm", searchTermRef.current.trim());
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const onUserInput = async (debouncedSearchTerm: string) => {
    const searchTerm = debouncedSearchTerm.trim();
    if (!searchTerm) {
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      const data: SearchResponse = await response.json();

      console.log("data", data);

      setResults(data);
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
    if (hasResults && !searchTermRef.current.trim()) {
      setResults(null);
    }
  }, [hasResults]);

  const value = useMemo(
    () => ({
      onSubmitSearch,
      isSearching,
      searchTerm,
      setSearchTerm,
      results,
    }),
    [searchTerm, setSearchTerm, isSearching, onSubmitSearch, results]
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
