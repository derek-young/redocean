import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db, customers } from "@/db";

async function updateCustomer(req: Request, res: Response) {
  try {
    const { userId } = req;
    const { id, tenantId } = req.params;
    const customerData = req.body;

    // First verify the customer belongs to the tenant
    const existingCustomer = await db.query.customers.findFirst({
      where: and(eq(customers.id, id), eq(customers.tenantId, tenantId)),
    });

    if (!existingCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const [customer] = await db
      .update(customers)
      .set({
        ...customerData,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    res.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
}

export default updateCustomer;
