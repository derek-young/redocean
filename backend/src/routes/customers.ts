import { Router, Request, Response, RequestHandler } from "express";
import { Address, Contact } from "@prisma/client";

import { prisma } from "@/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { tenant } = req;

    const customers = await prisma.customer.findMany({
      where: { tenantId: tenant.id },
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
    const { id } = req.params;
    const { tenant } = req;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        tenantId: tenant.id, // Ensure customer belongs to the tenant
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
    const { tenant, user } = req;
    const customerData = req.body;

    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        tenantId: tenant.id,
        createdById: user.id,
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
    const { id } = req.params;
    const { tenant, user } = req;
    const customerData = req.body;

    // First verify the customer belongs to the tenant
    const existingCustomer = await prisma.customer.findFirst({
      where: { id, tenantId: tenant.id },
    });

    if (!existingCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...customerData,
        updatedById: user.id,
      },
    });

    res.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

export default router;
