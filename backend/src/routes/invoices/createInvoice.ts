import { Request, Response } from "express";
import { InvoiceLine, Prisma } from "@prisma/client";

import { generateNextSequenceValue } from "@/utils/sequences";
import { prisma } from "@/db";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { total, lines, ...invoiceData } = req.body;
    const { tenant, user } = req;

    const sequenceResult = await generateNextSequenceValue(
      "invoice_number",
      tenant.id
    );
    const invoiceNumber = sequenceResult.value;

    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        invoiceNumber,
        total: new Prisma.Decimal(total),
        createdById: user.id,
        tenantId: tenant.id,
        lines: {
          create: lines.map((line: InvoiceLine) => ({
            ...line,
            quantity: new Prisma.Decimal(line.quantity),
            unitAmount: new Prisma.Decimal(line.unitAmount),
            lineAmount: new Prisma.Decimal(line.lineAmount),
          })),
        },
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};
