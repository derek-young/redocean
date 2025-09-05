import { Address, Contact, ContactType, Customer, Status } from "@/types";

type CustomerWithRelations = Customer & {
  contacts: Contact[];
  addresses: Address[];
};

function getStatusBadge(status: Status) {
  const badgeColor =
    status === Status.ACTIVE
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

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
          {props.customers.map((customer) => {
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
                        {primaryContact.firstName} {primaryContact.lastName}
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
  );
}

export default Table;
