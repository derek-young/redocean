import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db, vendors } from "@/db";

async function updateVendor(req: Request, res: Response) {
  try {
    const { userId } = req;
    const { id, tenantId } = req.params;
    const vendorData = req.body;

    // First verify the vendor belongs to the tenant
    const existingVendor = await db.query.vendors.findFirst({
      where: and(eq(vendors.id, id), eq(vendors.tenantId, tenantId)),
    });

    if (!existingVendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const [vendor] = await db
      .update(vendors)
      .set({
        ...vendorData,
        updatedAt: new Date(),
      })
      .where(eq(vendors.id, id))
      .returning();

    res.json(vendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Failed to update vendor" });
  }
}

export default updateVendor;
