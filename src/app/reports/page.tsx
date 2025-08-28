import Link from "next/link";
import { Analytics } from "@mui/icons-material";

export default function Reports() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              View your business insights and financial reports
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Analytics className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Reports Dashboard
            </h3>
            <p className="text-gray-600 mb-6">
              This page would display comprehensive business analytics and
              financial reports.
            </p>
            <p className="text-sm text-gray-500">Features to be implemented:</p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Revenue and profit analytics</li>
              <li>• Invoice aging reports</li>
              <li>• Customer payment history</li>
              <li>• Expense tracking and categorization</li>
              <li>• Cash flow projections</li>
              <li>• Tax reports and summaries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
