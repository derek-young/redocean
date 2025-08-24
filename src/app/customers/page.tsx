import Link from "next/link";

export default function Customers() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customer contacts</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              + New Customer
            </button>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Customer Management
            </h3>
            <p className="text-gray-600 mb-6">
              This page would display all your customers with contact
              information and history.
            </p>
            <p className="text-sm text-gray-500">Features to be implemented:</p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Add, edit, and delete customers</li>
              <li>• Search customers by name, email, or company</li>
              <li>• View customer invoice history</li>
              <li>• Customer contact details and addresses</li>
              <li>• Customer notes and tags</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
