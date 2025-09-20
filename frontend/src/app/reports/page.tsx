"use client";

import { Analytics } from "@mui/icons-material";

export default function Reports() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">
          View business analytics and financial reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profit & Loss */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Profit & Loss
            </h3>
            <Analytics className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            View your revenue, expenses, and net profit over time.
          </p>
          <button
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            name="view-profit-loss-report"
          >
            View Report
          </button>
        </div>

        {/* Cash Flow */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
            <Analytics className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Track money coming in and going out of your business.
          </p>
          <button
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            name="view-cash-flow-report"
          >
            View Report
          </button>
        </div>

        {/* Balance Sheet */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Balance Sheet
            </h3>
            <Analytics className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            See your assets, liabilities, and equity at a point in time.
          </p>
          <button
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            name="view-balance-sheet"
          >
            View Report
          </button>
        </div>

        {/* Sales Report */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Report
            </h3>
            <Analytics className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Analyze your sales performance and trends.
          </p>
          <button
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            name="view-sales-report"
          >
            View Report
          </button>
        </div>

        {/* Expense Report */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Report
            </h3>
            <Analytics className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Track and categorize your business expenses.
          </p>
          <button
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            name="view-expense-report"
          >
            View Report
          </button>
        </div>

        {/* Tax Report */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tax Report</h3>
            <Analytics className="text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Prepare for tax season with organized financial data.
          </p>
          <button
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            name="view-tax-report"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  );
}
