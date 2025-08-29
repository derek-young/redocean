"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@mui/icons-material";

import Loading from "@/components/Loading";
import { SearchResponse } from "@/types/search";

const placeholderSamples = [
  "Create an invoice",
  "View P&L for last quarter",
  "See a snapshot of current cashflow",
  "View customers with outstanding invoices",
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [placeholderSampleIndex, setPlaceholderSampleIndex] = useState(
    Math.floor(Math.random() * placeholderSamples.length)
  );
  const router = useRouter();

  const placeholder = placeholderSamples[placeholderSampleIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderSampleIndex(
        (curr) => (curr + 1) % placeholderSamples.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Smart routing logic based on search terms
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: searchTerm.trim() }),
      });

      const result: SearchResponse = await response.json();

      if (result.route) {
        // Navigate to the suggested route
        router.push(result.route);
      } else {
        // Show clarification message with suggestions
        const suggestions = result.suggestions?.join(", ") || "";
        alert(`${result.message}\n\nTry searching for: ${suggestions}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert(
        "Sorry, there was an error processing your search. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="flex justify-start mb-8">
        <div className="w-full ">
          <form onSubmit={handleSearch} className="relative">
            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
            <input
              aria-label="Search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`What would you like to do? (e.g.: "${placeholder}")`}
              className="w-full pl-14 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loading />
              </div>
            )}
          </form>
        </div>
      </div>
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome, Captain Ahab!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Use the search bar above for natural language queries or the quick
            actions in the sidebar to get started.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Insights & Recommendations
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Review Outstanding Invoices
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You have 3 invoices over 30 days past due totaling $12,450.
                    Consider following up with clients.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Cash Flow Alert
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Projected cash flow for next month shows a potential
                    shortfall. Review upcoming expenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Tax Preparation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Quarterly tax payments are due in 2 weeks. Ensure sufficient
                    funds are set aside.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
