import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "@/db";

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

    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId,
        userTenantMemberships: {
          some: {
            userId,
          },
        },
      },
    });

    if (!tenant) {
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
