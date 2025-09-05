"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { Customer, Contact, Address } from "@/types";
import Loading from "@/components/Loading";

import EmptyState from "./Empty";

type CustomerWithRelations = Customer & {
  contacts: Contact[];
  addresses: Address[];
};

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "ACTIVE" | "ARCHIVED"
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

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Archived
      </span>
    );
  };

  const getPrimaryContact = (contacts: Contact[]) => {
    const primaryContact = contacts.find(
      (contact) => contact.type === "PRIMARY"
    );
    return primaryContact || contacts[0];
  };

  const getPrimaryAddress = (addresses: Address[]) => {
    const primaryAddress = addresses.find((address) => address.isPrimary);
    return primaryAddress || addresses[0];
  };

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
          <Link
            href="/customers/create"
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            + New Customer
          </Link>
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
                setStatusFilter(e.target.value as "all" | "ACTIVE" | "ARCHIVED")
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Customers</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
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
          <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Primary Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Primary Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contacts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer) => {
                  const primaryContact = getPrimaryContact(customer.contacts);
                  const primaryAddress = getPrimaryAddress(customer.addresses);

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span
                            className="sr-only"
                            id={`customer-name-${customer.id}`}
                          >
                            Customer name:
                          </span>
                          <div
                            className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            aria-labelledby={`customer-name-${customer.id}`}
                          >
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {customer.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {primaryContact ? (
                          <div>
                            <span
                              className="sr-only"
                              id={`customer-contact-${customer.id}`}
                            >
                              Primary contact:
                            </span>
                            <div
                              className="text-sm text-gray-900 dark:text-gray-100"
                              aria-labelledby={`customer-contact-${customer.id}`}
                            >
                              {primaryContact.firstName}{" "}
                              {primaryContact.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {primaryContact.email}
                            </div>
                            {primaryContact.phone && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {primaryContact.phone}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            No contacts
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {primaryAddress ? (
                          <div>
                            <span
                              className="sr-only"
                              id={`customer-address-${customer.id}`}
                            >
                              Primary address:
                            </span>
                            <div
                              className="text-sm text-gray-900 dark:text-gray-100"
                              aria-labelledby={`customer-address-${customer.id}`}
                            >
                              {primaryAddress.street1}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {primaryAddress.city}, {primaryAddress.state}{" "}
                              {primaryAddress.zip}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500">
                            No addresses
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(customer.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {customer.contacts.length} contact
                        {customer.contacts.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            aria-label="Edit customer"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            aria-label="View customer"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
