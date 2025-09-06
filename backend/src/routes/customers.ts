import { Router, Request, Response } from "express";
import { Address, Contact, Customer } from "@prisma/client";

import { prisma } from "@/db";

type CustomerWithRelations = Customer & {
  addresses: Address[];
  contacts: Contact[];
};

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany({
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

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
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

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const customerData = req.body;
    const customer = await prisma.customer.create({
      data: customerData,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customerData = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: customerData,
    });

    res.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

export default router;
