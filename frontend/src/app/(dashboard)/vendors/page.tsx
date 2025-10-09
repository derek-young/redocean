"use client";

import { Business } from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";

import Loading from "@/components/Loading";
import { useTenantApi } from "@/context/TenantApiContext";
import { VendorModel, ContactModel, AddressModel } from "@/types";

type VendorWithRelations = VendorModel & {
  contacts: ContactModel[];
  addresses: AddressModel[];
};

export default function Vendors() {
  const { getVendors } = useTenantApi();
  const [vendors, setVendors] = useState<VendorWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "ACTIVE" | "ARCHIVED"
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await getVendors();
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
  }, [getVendors]);

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
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        Archived
      </span>
    );
  };

  const getPrimaryContact = (contacts: ContactModel[]) => {
    const primaryContact = contacts.find(
      (contact) => contact.type === "PRIMARY"
    );
    return primaryContact || contacts[0];
  };

  const getPrimaryAddress = (addresses: AddressModel[]) => {
    const primaryAddress = addresses.find((address) => address.isPrimary);
    return primaryAddress || addresses[0];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vendor relationships and supplier contacts
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/vendors/create"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            + New Vendor
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Search Vendors
            </label>
            <input
              aria-label="Search vendors by name, email, or contact information"
              name="search-vendor-by-text"
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vendor name, email, or contact info..."
              className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="md:w-48">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Status
            </label>
            <select
              aria-label="Filter vendors by status"
              name="filter-vendor-by-status"
              id="status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "ACTIVE" | "ARCHIVED")
              }
              className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            >
              <option value="all">All Vendors</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendor List */}
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            Vendor List&nbsp;
            {isLoading && <Loading />}
          </h2>
        </div>

        {isLoading ? null : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Business className="text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No vendors found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first vendor."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link
                href="/vendors/create"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                + Add First Vendor
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Primary Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Primary Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y border-border">
                {filteredVendors.map((vendor) => {
                  const primaryContact = getPrimaryContact(vendor.contacts);
                  const primaryAddress = getPrimaryAddress(vendor.addresses);

                  return (
                    <tr key={vendor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span
                            className="sr-only"
                            id={`vendor-name-${vendor.id}`}
                          >
                            Vendor name:
                          </span>
                          <div
                            className="text-sm font-medium text-foreground"
                            aria-labelledby={`vendor-name-${vendor.id}`}
                          >
                            {vendor.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
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
                              className="text-sm text-foreground"
                              aria-labelledby={`vendor-contact-${vendor.id}`}
                            >
                              {primaryContact.firstName}{" "}
                              {primaryContact.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {primaryContact.email}
                            </div>
                            {primaryContact.phone && (
                              <div className="text-sm text-muted-foreground">
                                {primaryContact.phone}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
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
                              className="text-sm text-foreground"
                              aria-labelledby={`vendor-address-${vendor.id}`}
                            >
                              {primaryAddress.street1}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {primaryAddress.city}, {primaryAddress.state}{" "}
                              {primaryAddress.zip}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No addresses
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(vendor.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            aria-label="Edit vendor"
                            name="edit-vendor"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Edit
                          </button>
                          <Link
                            href={`/vendors/${vendor.id}`}
                            aria-label="View vendor"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            View
                          </Link>
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
