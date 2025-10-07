import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, userTenantMemberships, tenants } from "@/db";

const tenantsRouter = Router();

tenantsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req;

    // Get all tenant memberships for this user
    const memberships = await db
      .select({
        tenant: tenants,
      })
      .from(userTenantMemberships)
      .innerJoin(tenants, eq(userTenantMemberships.tenantId, tenants.id))
      .where(eq(userTenantMemberships.userId, userId));

    res.json(memberships.map((m) => m.tenant));
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
});

export default tenantsRouter;
