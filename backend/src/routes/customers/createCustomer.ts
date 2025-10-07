import { Request, Response } from "express";
import { prisma } from "@/db";

async function createCustomer(req: Request, res: Response) {
  try {
    const { user } = req;
    const { tenantId } = req.params;
    const customerData = req.body;

    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        tenantId,
        createdById: user.id,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
}

export default createCustomer;
