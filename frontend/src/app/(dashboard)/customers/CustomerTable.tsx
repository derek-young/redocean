import Link from "next/link";

import { Address, Contact, ContactType, Customer, ActiveStatus } from "@/types";

type CustomerWithRelations = Customer & {
  contacts: Contact[];
  addresses: Address[];
};

function getStatusBadge(status: ActiveStatus) {
  const badgeColor =
    status === ActiveStatus.ACTIVE
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
    >
      {status}
    </span>
  );
}

function getPrimaryContact(contacts: Contact[]) {
  const primaryContact = contacts.find(
    (contact) => contact.type === ContactType.PRIMARY
  );
  return primaryContact ?? contacts[0];
}

function getPrimaryAddress(addresses: Address[]) {
  const primaryAddress = addresses.find((address) => address.isPrimary);
  return primaryAddress ?? addresses[0];
}

function Table(props: { customers: CustomerWithRelations[] }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full py-2 align-middle">
        <table className="min-w-full divide-y border-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                Customer
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px] hidden sm:table-cell">
                Primary Contact
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[180px] hidden lg:table-cell">
                Primary Address
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                Status
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y border-border">
            {props.customers.map((customer) => {
              const primaryContact = getPrimaryContact(customer.contacts);
              const primaryAddress = getPrimaryAddress(customer.addresses);

              return (
                <tr key={customer.id}>
                  <td className="px-3 sm:px-6 py-4">
                    <div>
                      <span
                        className="sr-only"
                        id={`customer-name-${customer.id}`}
                      >
                        Customer name:
                      </span>
                      <div
                        className="text-sm font-medium text-foreground break-words"
                        aria-labelledby={`customer-name-${customer.id}`}
                      >
                        {customer.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {customer.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                    {primaryContact ? (
                      <div>
                        <span
                          className="sr-only"
                          id={`customer-contact-${customer.id}`}
                        >
                          Primary contact:
                        </span>
                        <div
                          className="text-sm text-foreground break-words"
                          aria-labelledby={`customer-contact-${customer.id}`}
                        >
                          {primaryContact.firstName} {primaryContact.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground break-all">
                          {primaryContact.email}
                        </div>
                        {primaryContact.phone && (
                          <div className="text-xs text-muted-foreground">
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
                  <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                    {primaryAddress ? (
                      <div>
                        <span
                          className="sr-only"
                          id={`customer-address-${customer.id}`}
                        >
                          Primary address:
                        </span>
                        <div
                          className="text-sm text-foreground break-words"
                          aria-labelledby={`customer-address-${customer.id}`}
                        >
                          {primaryAddress.street1}
                        </div>
                        <div className="text-xs text-muted-foreground">
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
                  <td className="px-3 sm:px-6 py-4">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      <button
                        aria-label="Edit customer"
                        name="edit-customer"
                        className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/customers/${customer.id}`}
                        aria-label="View customer"
                        className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
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
    </div>
  );
}

export default Table;
