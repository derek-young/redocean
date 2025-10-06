import { Input } from "@/components/ui/input";

import { useInvoiceTotalsContext } from "./context/InvoiceTotalsContext";

function InvoiceTotals() {
  const {
    discount,
    discountAmount,
    discountType,
    salesTax,
    setDiscount,
    setDiscountType,
    subtotal,
    taxableSubtotal,
    totalAmount,
  } = useInvoiceTotalsContext();

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <div className="flex justify-end">
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Discount:</span>
              <div className="flex rounded-md border border-input overflow-hidden">
                <button
                  type="button"
                  name="discount-type-percentage"
                  onClick={() => setDiscountType("percentage")}
                  className={`px-2 py-1 text-sm transition-colors ${
                    discountType === "percentage"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  name="discount-type-amount"
                  onClick={() => setDiscountType("amount")}
                  className={`px-2 py-1 text-sm transition-colors ${
                    discountType === "amount"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  $
                </button>
              </div>
              <Input
                type="number"
                name="discount"
                min="0"
                step="0.01"
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-24 h-8 text-right"
                placeholder="0.00"
              />
            </div>
            {discount > 0 && (
              <span className="font-medium text-foreground">
                -${discountAmount.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxable Subtotal:</span>
            <span className="font-medium text-foreground">
              ${taxableSubtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Sales Tax:</span>
            <span className="font-medium text-foreground">
              ${salesTax.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-border pt-2 flex justify-between text-lg font-semibold">
            <span className="text-foreground">Total Amount:</span>
            <span className="text-foreground">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTotals;
