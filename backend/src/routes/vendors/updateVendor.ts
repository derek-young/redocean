import { Request, Response } from "express";
import { prisma } from "@/db";

async function updateVendor(req: Request, res: Response) {
  try {
    const { user } = req;
    const { id, tenantId } = req.params;
    const vendorData = req.body;

    // First verify the vendor belongs to the tenant
    const existingVendor = await prisma.vendor.findFirst({
      where: { id, tenantId },
    });

    if (!existingVendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        ...vendorData,
        updatedById: user.id,
      },
    });

    res.json(vendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Failed to update vendor" });
  }
}

export default updateVendor;
