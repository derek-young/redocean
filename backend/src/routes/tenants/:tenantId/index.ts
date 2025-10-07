import { Router, Request, Response, NextFunction } from "express";
import { and, eq } from "drizzle-orm";
import { db, tenants, userTenantMemberships } from "@/db";

import customerRoutes from "../../customers";
import vendorRoutes from "../../vendors";
import searchRoutes from "../../search";
import invoiceRoutes from "../../invoices";

const tenantScopedRouter = Router({ mergeParams: true });

async function validateTenantId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req;
    const { tenantId } = req.params;

    // Check if tenant exists and user is a member
    const membership = await db
      .select({
        tenant: tenants,
      })
      .from(tenants)
      .innerJoin(
        userTenantMemberships,
        eq(userTenantMemberships.tenantId, tenants.id)
      )
      .where(
        and(eq(tenants.id, tenantId), eq(userTenantMemberships.userId, userId))
      )
      .limit(1);

    if (!membership.length) {
      res.status(404).json({ error: "Tenant not found" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error validating tenant ID:", error);
    res.status(500).json({ error: "Failed to validate tenant ID" });
  }
}

tenantScopedRouter.use(validateTenantId);
tenantScopedRouter.use("/customers", customerRoutes);
tenantScopedRouter.use("/vendors", vendorRoutes);
tenantScopedRouter.use("/search", searchRoutes);
tenantScopedRouter.use("/invoices", invoiceRoutes);

export default tenantScopedRouter;
