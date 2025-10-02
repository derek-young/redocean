"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useTenantApi } from "@/context/TenantApiContext";
import { Vendor, Contact, Address, Status, ContactType } from "@/types";

type VendorWithRelations = Vendor & {
  contacts: Contact[];
  addresses: Address[];
};

function getStatusBadge(status: Status) {
  const badgeColor =
    status === Status.ACTIVE
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
    >
      {status}
    </span>
  );
}

function getContactTypeBadge(type: ContactType) {
  const badgeColor =
    type === ContactType.PRIMARY
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
    >
      {type}
    </span>
  );
}

function formatAddress(address: Address) {
  const parts = [
    address.street1,
    address.street2,
    address.street3,
    `${address.city}, ${address.state} ${address.zip}`,
    address.country !== "US" ? address.country : undefined,
  ].filter(Boolean);

  return parts.join(", ");
}

export default function VendorDetail() {
  const { getVendor } = useTenantApi();
  const params = useParams();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<VendorWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await getVendor({ vendorId });
        if (response.ok) {
          const data: VendorWithRelations = await response.json();
          setVendor(data);
        } else if (response.status === 404) {
          setError("Vendor not found");
        } else {
          setError("Failed to fetch vendor");
        }
      } catch (error) {
        console.error("Error fetching vendor:", error);
        setError("Error loading vendor");
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId, getVendor]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Vendor not found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            The vendor you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button>
            <Link href="/vendors">← Back to Vendors</Link>
          </Button>
        </div>
      </div>
    );
  }

  const primaryContact =
    vendor.contacts.find((contact) => contact.type === ContactType.PRIMARY) ||
    vendor.contacts[0];

  const primaryAddress =
    vendor.addresses.find((address) => address.isPrimary) ||
    vendor.addresses[0];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              {vendor.name}
            </h1>
            {getStatusBadge(vendor.status)}
          </div>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Link href="/vendors">← Back to Vendors</Link>
          </Button>
          <Button>Edit Vendor</Button>
        </div>
      </div>

      {/* Vendor Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Basic Information */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Basic Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Name
              </dt>
              <dd className="text-sm text-card-foreground">{vendor.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </dt>
              <dd className="text-sm">{getStatusBadge(vendor.status)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Created
              </dt>
              <dd className="text-sm text-card-foreground">
                {new Date(vendor.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Last Updated
              </dt>
              <dd className="text-sm text-card-foreground">
                {new Date(vendor.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Primary Contact */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Primary Contact
          </h2>
          {primaryContact ? (
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Name
                </dt>
                <dd className="text-sm text-card-foreground">
                  {primaryContact.firstName} {primaryContact.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd className="text-sm text-card-foreground">
                  <a
                    href={`mailto:${primaryContact.email}`}
                    className="text-primary hover:underline"
                  >
                    {primaryContact.email}
                  </a>
                </dd>
              </div>
              {primaryContact.phone && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Phone
                  </dt>
                  <dd className="text-sm text-card-foreground">
                    <a
                      href={`tel:${primaryContact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {primaryContact.phone}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Type
                </dt>
                <dd className="text-sm">
                  {getContactTypeBadge(primaryContact.type)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No contacts available
            </p>
          )}
        </div>

        {/* Primary Address */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            Primary Address
          </h2>
          {primaryAddress ? (
            <div>
              <p className="text-sm text-card-foreground">
                {formatAddress(primaryAddress)}
              </p>
              {primaryAddress.isPrimary && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground mt-2">
                  Primary
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No addresses available
            </p>
          )}
        </div>
      </div>

      {/* All Contacts */}
      {vendor.contacts.length > 0 && (
        <div className="bg-card rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">
              All Contacts ({vendor.contacts.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendor.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    {getContactTypeBadge(contact.type)}
                  </div>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Email
                      </dt>
                      <dd className="text-sm text-card-foreground">
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:underline"
                        >
                          {contact.email}
                        </a>
                      </dd>
                    </div>
                    {contact.phone && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          Phone
                        </dt>
                        <dd className="text-sm text-card-foreground">
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-primary hover:underline"
                          >
                            {contact.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        Status
                      </dt>
                      <dd className="text-sm">
                        {getStatusBadge(contact.status)}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Addresses */}
      {vendor.addresses.length > 0 && (
        <div className="bg-card rounded-lg shadow">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">
              All Addresses ({vendor.addresses.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendor.addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground">
                      Address
                    </h3>
                    {address.isPrimary && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-card-foreground">
                    <p>{formatAddress(address)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
