export enum Status {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum ContactType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

export interface Customer {
  id: string;
  name: string;
  tenantId: string;
  status: Status;
  createdAt: string;
  deletedAt?: string;
  updatedAt: string;
  contacts: Contact[];
  addresses: Address[];
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: Status;
  type: ContactType;
  createdAt: string;
  deletedAt?: string;
  updatedAt: string;
  customerId?: string;
  vendorId?: string;
}

export interface Address {
  id: string;
  street1: string;
  street2?: string;
  street3?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  customerId?: string;
  vendorId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  tenantId: string;
  status: Status;
  createdAt: string;
  deletedAt?: string;
  updatedAt: string;
  contacts: Contact[];
  addresses: Address[];
}
