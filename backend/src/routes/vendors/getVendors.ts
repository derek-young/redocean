import { Request, Response } from "express";
import { prisma } from "@/db";

async function getVendors(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;

    const vendors = await prisma.vendor.findMany({
      where: { tenantId },
      include: {
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
