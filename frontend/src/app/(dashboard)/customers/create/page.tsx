"use client";

import { People } from "@mui/icons-material";
import Link from "next/link";

export default function CreateCustomer() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Customer
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new customer to the system
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/customers"
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Customers
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <People className="text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Customer Creation
          </h3>
          <p className="text-muted-foreground mb-6">
            This page would contain a form to create new customers.
          </p>
          <p className="text-sm text-muted-foreground">
            Features to be implemented:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Basic customer information (name, email, phone)</li>
            <li>• Company details and job title</li>
            <li>• Address information</li>
            <li>• Credit limit and payment terms</li>
            <li>• Tags and categorization</li>
            <li>• Notes and additional information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
