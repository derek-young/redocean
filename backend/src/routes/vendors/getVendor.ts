import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db, vendors } from "@/db";

async function getVendor(req: Request, res: Response) {
  try {
    const { id, tenantId } = req.params;

    const vendor = await db.query.vendors.findFirst({
      where: and(eq(vendors.id, id), eq(vendors.tenantId, tenantId)),
      with: {
        addresses: true,
        contacts: true,
      },
    });

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    res.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
}

export default getVendor;
