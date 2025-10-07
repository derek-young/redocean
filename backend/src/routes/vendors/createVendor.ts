import { Request, Response } from "express";
import { prisma } from "@/db";

async function createVendor(req: Request, res: Response) {
  try {
    const { user } = req;
    const { tenantId } = req.params;
    const vendorData = req.body;

    const vendor = await prisma.vendor.create({
      data: {
        ...vendorData,
        tenantId,
        createdById: user.id,
      },
    });

    res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ error: "Failed to create vendor" });
  }
}

export default createVendor;
