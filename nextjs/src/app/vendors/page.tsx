"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Business } from "@mui/icons-material";
import Loading from "@/components/Loading";

import { Vendor, Contact, Address } from "@prisma";

type VendorWithRelations = Vendor & {
  contacts: Contact[];
  addresses: Address[];
};

export default function Vendors() {
  const [vendors, setVendors] = useState<VendorWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "ACTIVE" | "ARCHIVED"
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("/api/v1/vendors");
        if (response.ok) {
          const data: VendorWithRelations[] = await response.json();
          setVendors(data);
        } else {
          console.error("Failed to fetch vendors");
          // For now, use empty array if API is not available
          setVendors([]);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
        // For now, use empty array if API is not available
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Filter vendors based on search and status
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contacts.some(
        (contact) =>
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || vendor.status === statusFilter;

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Vendors
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your vendor relationships and supplier contacts
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/vendors/create"
            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
          >
            + New Vendor
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
              Search Vendors
            </label>
            <input
              aria-label="Search vendors by name, email, or contact information"
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vendor name, email, or contact info..."
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
              aria-label="Filter vendors by status"
              id="status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "ACTIVE" | "ARCHIVED")
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Vendors</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendor List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Vendor List&nbsp;
            {isLoading && <Loading />}
          </h2>
        </div>

        {isLoading ? null : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Business className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first vendor."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link
                href="/vendors/create"
                className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
              >
                + Add First Vendor
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendor
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
                {filteredVendors.map((vendor) => {
                  const primaryContact = getPrimaryContact(vendor.contacts);
                  const primaryAddress = getPrimaryAddress(vendor.addresses);

                  return (
                    <tr
                      key={vendor.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span
                            className="sr-only"
                            id={`vendor-name-${vendor.id}`}
                          >
                            Vendor name:
                          </span>
                          <div
                            className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            aria-labelledby={`vendor-name-${vendor.id}`}
                          >
                            {vendor.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {vendor.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {primaryContact ? (
                          <div>
                            <span
                              className="sr-only"
                              id={`vendor-contact-${vendor.id}`}
                            >
                              Primary contact:
                            </span>
                            <div
                              className="text-sm text-gray-900 dark:text-gray-100"
                              aria-labelledby={`vendor-contact-${vendor.id}`}
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
                              id={`vendor-address-${vendor.id}`}
                            >
                              Primary address:
                            </span>
                            <div
                              className="text-sm text-gray-900 dark:text-gray-100"
                              aria-labelledby={`vendor-address-${vendor.id}`}
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
                        {getStatusBadge(vendor.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {vendor.contacts.length} contact
                        {vendor.contacts.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            aria-label="Edit vendor"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            aria-label="View vendor"
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
