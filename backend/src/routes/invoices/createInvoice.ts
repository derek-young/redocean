import { Request, Response } from "express";

import { generateNextSequenceValue } from "@/utils/sequences";
import { db, invoices, invoiceLines } from "@/db";

interface InvoiceLineInput {
  description?: string;
  quantity: string | number;
  unitAmount: string | number;
  lineAmount: string | number;
  taxRateId?: string;
}

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { total, lines, ...invoiceData } = req.body;
    const { userId } = req;
    const { tenantId } = req.params;

    const sequenceResult = await generateNextSequenceValue(
      "invoice_number",
      tenantId
    );
    const invoiceNumber = sequenceResult.value;

    // Insert invoice and lines in a transaction
    const result = await db.transaction(async (tx) => {
      const [invoice] = await tx
        .insert(invoices)
        .values({
          ...invoiceData,
          invoiceNumber,
          total: total.toString(),
          createdById: userId,
          tenantId: tenantId,
        })
        .returning();

      if (lines && lines.length > 0) {
        await tx.insert(invoiceLines).values(
          lines.map((line: InvoiceLineInput) => ({
            ...line,
            invoiceId: invoice.id,
            quantity: line.quantity.toString(),
            unitAmount: line.unitAmount.toString(),
            lineAmount: line.lineAmount.toString(),
          }))
        );
      }

      return invoice;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};
