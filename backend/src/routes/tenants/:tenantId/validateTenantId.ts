import { Request, Response, NextFunction } from "express";

import { prisma } from "@/db";
import { UserTenantMembership } from "@prisma/client";

async function validateTenantId(
  req: Request & { tenantMembership?: UserTenantMembership },
  res: Response,
  next: NextFunction
) {
  try {
    const { user } = req;
    const { tenantId } = req.params;

    const membership = await prisma.userTenantMembership.findFirst({
      where: { tenantId, userId: user.id },
    });

    if (!membership) {
      res.status(404).json({ error: "Tenant not found or access denied" });
      return;
    }

    req.tenantMembership = membership;

    next();
  } catch (error) {
    console.error("Error validating tenant ID:", error);
    res.status(500).json({ error: "Failed to validate tenant ID" });
  }
}

export default validateTenantId;
