"use client";

import Link from "next/link";
import { Business } from "@mui/icons-material";

export default function CreateVendor() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Vendor</h1>
          <p className="text-gray-600 mt-1">Add a new vendor to the system</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/vendors"
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Vendors
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Business className="text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Vendor Creation
          </h3>
          <p className="text-gray-600 mb-6">
            This page would contain a form to create new vendors.
          </p>
          <p className="text-sm text-gray-500">Features to be implemented:</p>
          <ul className="text-sm text-gray-500 mt-2 space-y-1">
            <li>• Basic vendor information (name, email, phone)</li>
            <li>• Company details and tax ID</li>
            <li>• Address information</li>
            <li>• Payment terms and credit limit</li>
            <li>• Contact person details</li>
            <li>• Notes and additional information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
