import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db, customers } from "@/db";

async function getCustomer(req: Request, res: Response) {
  try {
    const { id, tenantId } = req.params;

    const customer = await db.query.customers.findFirst({
      where: and(eq(customers.id, id), eq(customers.tenantId, tenantId)),
      with: {
        addresses: true,
        contacts: true,
      },
    });

    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
}

export default getCustomer;
