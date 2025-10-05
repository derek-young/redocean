import { Request, Response } from "express";
import { prisma } from "@/db";

async function getVendor(req: Request, res: Response) {
  try {
    const { id, tenantId } = req.params;

    const vendor = await prisma.vendor.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
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
