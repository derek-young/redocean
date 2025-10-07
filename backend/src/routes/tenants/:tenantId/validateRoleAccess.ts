import { Request, Response, NextFunction } from "express";
import { Role, UserTenantMembership } from "@prisma/client";

async function validateRoleAccess(
  req: Request & { tenantMembership?: UserTenantMembership },
  res: Response,
  next: NextFunction
) {
  try {
    const { tenantMembership } = req;

    if (!tenantMembership) {
      res.status(404).json({ error: "Tenant not found or access denied" });
      return;
    }

    if (req.method !== "GET" && tenantMembership.role !== Role.ADMIN) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error validating role access:", error);
    res.status(500).json({ error: "Failed to validate role access" });
  }
}

export default validateRoleAccess;
