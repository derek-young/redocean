import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";

async function getVendors(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;

    const vendors = await db.query.vendors.findMany({
      where: (vendors, { eq }) => eq(vendors.tenantId, tenantId),
      with: {
        addresses: true,
        contacts: true,
      },
    });

    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
}

export default getVendors;
