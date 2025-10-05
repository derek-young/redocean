import { Request, Response } from "express";
import { prisma } from "@/db";

async function getCustomers(req: Request, res: Response) {
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
}

export default getCustomers;
