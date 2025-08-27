"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchResponse } from "@/types/search";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

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

      if (!response.ok) {
        throw new Error("Search request failed");
      }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AltBooks</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What would you like to do?
              </label>
              <div className="relative">
                <input
                  aria-label="Search"
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., create invoice, find customer, view reports..."
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                  disabled={isSearching}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSearching ? "Thinking..." : "Let's Go"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/invoice/create")}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="font-medium text-gray-900">Create Invoice</div>
                <div className="text-sm text-gray-500">
                  Generate a new invoice
                </div>
              </button>
              <button
                onClick={() => router.push("/invoice/list")}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="font-medium text-gray-900">View Invoices</div>
                <div className="text-sm text-gray-500">See all invoices</div>
              </button>
              <button
                onClick={() => router.push("/customers")}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="font-medium text-gray-900">Customers</div>
                <div className="text-sm text-gray-500">Manage contacts</div>
              </button>
              <button
                onClick={() => router.push("/reports")}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <div className="font-medium text-gray-900">Reports</div>
                <div className="text-sm text-gray-500">View analytics</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
