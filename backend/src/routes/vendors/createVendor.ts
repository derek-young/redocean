import { Request, Response } from "express";
import { db, vendors } from "@/db";

async function createVendor(req: Request, res: Response) {
  try {
    const { userId } = req;
    const { tenantId } = req.params;
    const vendorData = req.body;

    const [vendor] = await db
      .insert(vendors)
      .values({
        ...vendorData,
        tenantId,
      })
      .returning();

    res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ error: "Failed to create vendor" });
  }
}

export default createVendor;
