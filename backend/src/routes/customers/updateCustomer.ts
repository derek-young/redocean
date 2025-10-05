import { Request, Response } from "express";
import { prisma } from "@/db";

async function updateCustomer(req: Request, res: Response) {
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
}

export default updateCustomer;
