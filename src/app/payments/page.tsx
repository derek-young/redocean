import { useRouter } from "next/navigation";
import { Payment } from "@mui/icons-material";

export default function Payments() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">
              Track incoming and outgoing payments
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors">
              + Record Payment
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Payment className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Tracking
            </h3>
            <p className="text-gray-600 mb-6">
              This page would display all payment transactions and payment
              history.
            </p>
            <p className="text-sm text-gray-500">Features to be implemented:</p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Record incoming payments from customers</li>
              <li>• Track outgoing payments to vendors</li>
              <li>• Payment method tracking (check, card, bank transfer)</li>
              <li>• Payment reconciliation</li>
              <li>• Payment reminders and follow-ups</li>
              <li>• Payment history and reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
