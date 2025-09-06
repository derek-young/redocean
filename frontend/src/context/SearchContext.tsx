"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from "react";

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
  handleSearch: (e: React.FormEvent) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTermRef = useRef(searchTerm);

  searchTermRef.current = searchTerm;

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTermRef.current.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: searchTermRef.current.trim() }),
      });

      const result: SearchResponse = await response.json();

      console.log("result", result);
    } catch (error) {
      console.error("Search error:", error);
      alert(
        "Sorry, there was an error processing your search. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      isSearching,
      handleSearch,
    }),
    [searchTerm, setSearchTerm, isSearching, handleSearch]
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
