"use client";

import Link from "next/link";
import { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: "ACTIVE" | "INACTIVE";
  paymentTerms: string;
  taxId: string;
  notes: string;
}

export default function CreateVendor() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [vendorData, setVendorData] = useState<VendorFormData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
    contactPerson: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    status: "ACTIVE",
    paymentTerms: "Net 30",
    taxId: "",
    notes: "",
  });

  const handleAddressChange = (
    field: keyof VendorFormData["address"],
    value: string
  ) => {
    setVendorData({
      ...vendorData,
      address: {
        ...vendorData.address,
        [field]: value,
      },
    });
  };

  const handleContactChange = (
    field: keyof VendorFormData["contactPerson"],
    value: string
  ) => {
    setVendorData({
      ...vendorData,
      contactPerson: {
        ...vendorData.contactPerson,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically save to your backend
    console.log("Vendor Data:", vendorData);

    alert("Vendor created successfully!");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create Vendor
                </h1>
                <p className="text-gray-600 mt-1">
                  Add a new vendor to your supplier list
                </p>
              </div>
              <Link
                href="/vendors"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Vendors
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Company Name *
                    </label>
                    <input
                      id="name"
                      aria-label="Company Name"
                      type="text"
                      value={vendorData.name}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Acme Supplies Co."
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      aria-label="Email"
                      type="email"
                      value={vendorData.email}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="orders@acmesupplies.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      aria-label="Phone"
                      type="tel"
                      value={vendorData.phone}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Website
                    </label>
                    <input
                      id="website"
                      aria-label="Website"
                      type="url"
                      value={vendorData.website}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          website: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="https://acmesupplies.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="taxId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tax ID
                    </label>
                    <input
                      id="taxId"
                      aria-label="Tax ID"
                      type="text"
                      value={vendorData.taxId}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          taxId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="12-3456789"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      value={vendorData.status}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          status: e.target.value as "ACTIVE" | "INACTIVE",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Person</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contactFirstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="contactFirstName"
                      aria-label="Contact First Name"
                      type="text"
                      value={vendorData.contactPerson.firstName}
                      onChange={(e) =>
                        handleContactChange("firstName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactLastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="contactLastName"
                      aria-label="Contact Last Name"
                      type="text"
                      value={vendorData.contactPerson.lastName}
                      onChange={(e) =>
                        handleContactChange("lastName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Smith"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="contactEmail"
                      aria-label="Contact Email"
                      type="email"
                      value={vendorData.contactPerson.email}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="john.smith@acmesupplies.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contactPhone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      id="contactPhone"
                      aria-label="Contact Phone"
                      type="tel"
                      value={vendorData.contactPerson.phone}
                      onChange={(e) =>
                        handleContactChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4568"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Street Address
                    </label>
                    <input
                      id="street"
                      aria-label="Street Address"
                      type="text"
                      value={vendorData.address.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="123 Business Ave"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      aria-label="City"
                      type="text"
                      value={vendorData.address.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      aria-label="State"
                      type="text"
                      value={vendorData.address.state}
                      onChange={(e) =>
                        handleAddressChange("state", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      ZIP Code
                    </label>
                    <input
                      id="zip"
                      aria-label="ZIP Code"
                      type="text"
                      value={vendorData.address.zip}
                      onChange={(e) =>
                        handleAddressChange("zip", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      aria-label="Country"
                      type="text"
                      value={vendorData.address.country}
                      onChange={(e) =>
                        handleAddressChange("country", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Business Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Business Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="paymentTerms"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Payment Terms
                    </label>
                    <select
                      id="paymentTerms"
                      value={vendorData.paymentTerms}
                      onChange={(e) =>
                        setVendorData({
                          ...vendorData,
                          paymentTerms: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="Net 30">Net 30</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Net 90">Net 90</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                <textarea
                  aria-label="Notes"
                  value={vendorData.notes}
                  onChange={(e) =>
                    setVendorData({
                      ...vendorData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add any additional notes about this vendor..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/vendors"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Creating..." : "Create Vendor"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
