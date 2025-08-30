import { Router, Request, Response } from "express";
import { Address, Contact, Vendor } from "@prisma/client";

import { prisma } from "../index";

type VendorWithRelations = Vendor & {
  addresses: Address[];
  contacts: Contact[];
};

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await prisma.vendor.findMany({
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
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { id },
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
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const vendorData = req.body;
    const vendor = await prisma.vendor.create({
      data: vendorData,
    });

    res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ error: "Failed to create vendor" });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vendorData = req.body;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: vendorData,
    });

    res.json(vendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Failed to update vendor" });
  }
});

export default router;
