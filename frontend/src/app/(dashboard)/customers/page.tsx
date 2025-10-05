"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenantApi } from "@/context/TenantApiContext";
import { Customer, Contact, Address, Status } from "@/types";

import CustomerEmpty from "./CustomerEmpty";
import CustomerTable from "./CustomerTable";

type CustomerWithRelations = Customer & {
  contacts: Contact[];
  addresses: Address[];
};

export default function Customers() {
  const { getCustomers } = useTenantApi();
  const [customers, setCustomers] = useState<CustomerWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Status.ACTIVE | Status.ARCHIVED
  >("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
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
  }, [getCustomers]);

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
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
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
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Search Customers
            </label>
            <Input
              aria-label="Search customers by name, email, or contact information"
              name="search-customer-by-text"
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, or contact info..."
            />
          </div>
          <div className="md:w-48">
            <label
              htmlFor="filter-customer-by-status"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Status
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(
                  value as "all" | Status.ACTIVE | Status.ARCHIVED
                )
              }
            >
              <SelectTrigger id="filter-customer-by-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                <SelectItem value={Status.ARCHIVED}>Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
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
