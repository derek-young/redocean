import { Request, Response } from "express";
import { prisma } from "@/db";

async function getCustomer(req: Request, res: Response) {
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
}

export default getCustomer;
