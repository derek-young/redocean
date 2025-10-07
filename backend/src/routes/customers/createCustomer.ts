import { Request, Response } from "express";
import { db, customers } from "@/db";

async function createCustomer(req: Request, res: Response) {
  try {
    const { userId } = req;
    const { tenantId } = req.params;
    const customerData = req.body;

    const [customer] = await db
      .insert(customers)
      .values({
        ...customerData,
        tenantId,
      })
      .returning();

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
}

export default createCustomer;
