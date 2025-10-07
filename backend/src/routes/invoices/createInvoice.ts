import { Request, Response } from "express";
import { InvoiceLine, Prisma, UserTenantMembership } from "@prisma/client";

import { prisma } from "@/db";

async function createInvoice(
  req: Request & { tenantMembership?: UserTenantMembership },
  res: Response
) {
  try {
    const { total, lines, ...invoiceData } = req.body;
    const { tenantMembership, user } = req;

    if (!tenantMembership) {
      res.status(404).json({ error: "Tenant not found or access denied" });
      return;
    }

    const { tenantId } = tenantMembership;

    const customer = await prisma.customer.findUnique({
      where: {
        id: invoiceData.customerId,
        tenantId: tenantId,
      },
    });

    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        createdById: user.id,
        tenantId: tenantId,
        total: new Prisma.Decimal(total),
        lines: {
          create: lines.map((line: InvoiceLine) => ({
            description: line.description ?? null,
            lineAmount: new Prisma.Decimal(line.lineAmount),
            unitAmount: new Prisma.Decimal(line.unitAmount),
            quantity: new Prisma.Decimal(line.quantity),
            taxRateId: line.taxRateId ?? null,
          })),
        },
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  }
}

export default createInvoice;
