import Link from "next/link";
import { Receipt } from "@mui/icons-material";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function InvoiceList() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                <p className="text-gray-600 mt-1">
                  View and manage all your invoices
                </p>
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
                  Invoice List
                </h3>
                <p className="text-gray-600 mb-6">
                  This page would display all your invoices with search and
                  filtering capabilities.
                </p>
                <p className="text-sm text-gray-500">
                  Features to be implemented:
                </p>
                <ul className="text-sm text-gray-500 mt-2 space-y-1">
                  <li>• Search invoices by customer, number, or date</li>
                  <li>• Filter by status (paid, pending, overdue)</li>
                  <li>• Sort by various criteria</li>
                  <li>• Bulk actions (delete, mark as paid, etc.)</li>
                  <li>• Export to PDF or CSV</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
