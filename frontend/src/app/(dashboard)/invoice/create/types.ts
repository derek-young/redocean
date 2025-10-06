export type DiscountType = "percentage" | "amount";

export type LineItemType = "item" | "text" | "subtotal";

export interface InvoiceLine {
  id: string;
  type: LineItemType;
  item: string;
  description: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  taxRateId?: string;
}
