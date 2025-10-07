import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";

async function getCustomers(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;

    const customers = await db.query.customers.findMany({
      where: (customers, { eq }) => eq(customers.tenantId, tenantId),
      with: {
        addresses: true,
        contacts: true,
      },
    });

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
}

export default getCustomers;
