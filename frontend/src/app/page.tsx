"use client";

import SearchBar from "@/components/search/SearchBar";
import { SearchProvider } from "@/context/SearchContext";

function Home() {
  return (
    <>
      <div className="flex justify-start mb-8">
        <div className="w-full ">
          <SearchBar />
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

export default function HomeWithSearchProvider() {
  return (
    <SearchProvider>
      <Home />
    </SearchProvider>
  );
}
