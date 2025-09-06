"use client";

import { Receipt } from "@mui/icons-material";
import Link from "next/link";

export default function InvoiceList() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">View and manage all invoices</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/invoice/create"
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            + New Invoice
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Receipt className="text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Invoice Management
          </h3>
          <p className="text-gray-600 mb-6">
            This page would display all invoices with filtering and search
            capabilities.
          </p>
          <p className="text-sm text-gray-500">Features to be implemented:</p>
          <ul className="text-sm text-gray-500 mt-2 space-y-1">
            <li>• View all invoices in a table format</li>
            <li>• Filter by status (draft, sent, paid, overdue)</li>
            <li>• Search invoices by customer or invoice number</li>
            <li>• Sort by date, amount, or status</li>
            <li>• Bulk actions (send, mark as paid, etc.)</li>
            <li>• Export invoices to PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
