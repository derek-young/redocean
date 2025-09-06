"use client";


import Link from "next/link";
import { useState, useEffect } from "react";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Customer, Contact, Address, Status } from "@/types";

import CustomerEmpty from "./CustomerEmpty";
import CustomerTable from "./CustomerTable";

type CustomerWithRelations = Customer & {
  contacts: Contact[];
  addresses: Address[];
};

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Status.ACTIVE | Status.ARCHIVED
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/v1/customers");
        if (response.ok) {
          const data: CustomerWithRelations[] = await response.json();
          setCustomers(data);
        } else {
          console.error("Failed to fetch customers");
          setCustomers([]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contacts.some(
        (contact) =>
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer contacts and relationships
          </p>
        </div>
        <div className="flex space-x-4">
          <Button>
            <Link href="/customers/create">+ New Customer</Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Search Customers
            </label>
            <input
              aria-label="Search customers by name, email, or contact information"
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or contact info..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="md:w-48">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Status
            </label>
            <select
              aria-label="Filter customers by status"
              id="status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | Status.ACTIVE | Status.ARCHIVED
                )
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Customers</option>
              <option value={Status.ACTIVE}>Active</option>
              <option value={Status.ARCHIVED}>Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Customer List&nbsp;
            {isLoading && <Loading />}
          </h2>
        </div>

        {isLoading ? null : filteredCustomers.length === 0 ? (
          <CustomerEmpty searchTerm={searchTerm} statusFilter={statusFilter} />
        ) : (
          <CustomerTable customers={filteredCustomers} />
        )}
      </div>
    </div>
  );
}
