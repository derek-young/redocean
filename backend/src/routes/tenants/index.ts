import { Router, Request, Response } from "express";
import { prisma } from "@/db";

const tenantsRouter = Router();

tenantsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const tenants = await prisma.tenant.findMany({
      where: {
        userTenantMemberships: {
          some: { userId: user.id },
        },
      },
    });
    res.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
});

export default tenantsRouter;
