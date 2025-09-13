import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  lineAmount: number;
  taxRateId?: string;
}

interface TaxRate {
  id: string;
  name: string;
  rate: number;
}

function InvoiceLineItems({
  lines,
  setLines,
}: {
  lines: InvoiceLine[];
  setLines: (lines: InvoiceLine[]) => void;
}) {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taxRatesResponse = await fetch("/api/v1/tax-rates");
        if (taxRatesResponse.ok) {
          const taxRatesData: TaxRate[] = await taxRatesResponse.json();
          setTaxRates(taxRatesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addLine = () => {
    const newLine: InvoiceLine = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitAmount: 0,
      lineAmount: 0,
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter((line) => line.id !== id));
    }
  };

  const updateLine = (
    id: string,
    field: keyof InvoiceLine,
    value: string | number
  ) => {
    setLines(
      lines.map((line) => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };
          if (field === "quantity" || field === "unitAmount") {
            updatedLine.lineAmount =
              updatedLine.quantity * updatedLine.unitAmount;
          }
          return updatedLine;
        }
        return line;
      })
    );
  };

  return (
    <div className="bg-card rounded-lg shadow p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Invoice Line Items
        </h2>
        <Button
          type="button"
          onClick={addLine}
          variant="default"
          size="default"
        >
          + Add Line Item
        </Button>
      </div>

      <div className="space-y-4">
        {lines.map((line) => (
          <div
            key={line.id}
            className="grid grid-cols-12 gap-4 items-center p-4 border border-border rounded-lg bg-muted/30"
          >
            <div className="col-span-4">
              <label
                htmlFor={`description-${line.id}`}
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Description
              </label>
              <input
                id={`description-${line.id}`}
                aria-label="Invoice line description"
                type="text"
                value={line.description}
                onChange={(e) =>
                  updateLine(line.id, "description", e.target.value)
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Item or service description"
                required
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor={`quantity-${line.id}`}
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Qty
              </label>
              <input
                id={`quantity-${line.id}`}
                aria-label="Invoice line quantity"
                type="number"
                value={line.quantity}
                onChange={(e) =>
                  updateLine(
                    line.id,
                    "quantity",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor={`unit-amount-${line.id}`}
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Unit Amount
              </label>
              <input
                id={`unit-amount-${line.id}`}
                aria-label="Invoice line unit amount"
                type="number"
                value={line.unitAmount}
                onChange={(e) =>
                  updateLine(
                    line.id,
                    "unitAmount",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor={`tax-rate-${line.id}`}
                className="block text-xs font-medium text-muted-foreground mb-1"
              >
                Tax Rate
              </label>
              <select
                id={`tax-rate-${line.id}`}
                aria-label="Invoice line tax rate"
                value={line.taxRateId || ""}
                onChange={(e) =>
                  updateLine(line.id, "taxRateId", e.target.value || "")
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">No Tax</option>
                {taxRates.map((taxRate) => (
                  <option key={taxRate.id} value={taxRate.id}>
                    {taxRate.name} ({(taxRate.rate * 100).toFixed(1)}%)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <div className="block text-xs font-medium text-muted-foreground mb-1">
                Line Total
              </div>
              <div className="px-3 py-2 bg-muted rounded-md text-right font-medium text-foreground">
                ${line.lineAmount.toFixed(2)}
              </div>
            </div>
            <div className="col-span-1">
              <div className="block text-xs font-medium text-muted-foreground mb-1">
                Actions
              </div>
              {lines.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/80"
                  aria-label={`Remove line item ${line.id}`}
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoiceLineItems;
