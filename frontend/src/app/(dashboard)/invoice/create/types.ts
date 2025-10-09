import { InvoiceLineModel } from "@/types";

export type DiscountType = "percentage" | "amount";

export type LineItemType = "item" | "text" | "subtotal";

export type InvoiceLine = Pick<
  InvoiceLineModel,
  "description" | "lineAmount" | "quantity" | "unitAmount"
> & {
  id: string;
  itemId: string;
  type: LineItemType;
};

export enum Terms {
  DUE_ON_RECEIPT = "due-on-receipt",
  NET_15 = "net-15",
  NET_30 = "net-30",
  NET_60 = "net-60",
}
