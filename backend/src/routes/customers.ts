import { Router, Request, Response, RequestHandler } from "express";
import { Address, Contact } from "@prisma/client";

import { prisma } from "@/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const customers = await prisma.customer.findMany({
      where: { tenantId },
      include: {
        addresses: true,
        contacts: true,
      },
    });

    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id, tenantId } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        addresses: true,
        contacts: true,
      },
    });

    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { tenantId } = req.params;
    const customerData = req.body;

    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        tenantId,
        createdById: userId,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { id, tenantId } = req.params;
    const customerData = req.body;

    // First verify the customer belongs to the tenant
    const existingCustomer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!existingCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...customerData,
        updatedById: userId,
      },
    });

    res.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

export default router;
