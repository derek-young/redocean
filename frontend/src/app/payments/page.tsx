"use client";

import { Payment } from "@mui/icons-material";

export default function Payments() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">
          View and manage payments to suppliers
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Payment className="text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payments Dashboard
          </h3>
          <p className="text-gray-600 mb-6">
            This page would display payment management and tracking features.
          </p>
          <p className="text-sm text-gray-500">Features to be implemented:</p>
          <ul className="text-sm text-gray-500 mt-2 space-y-1">
            <li>• Track outgoing payments to vendors</li>
            <li>• Payment scheduling and automation</li>
            <li>• Payment history and reconciliation</li>
            <li>• Bank account integration</li>
            <li>• Payment approval workflows</li>
            <li>• Expense categorization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
