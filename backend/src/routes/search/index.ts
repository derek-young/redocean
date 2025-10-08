import { NextFunction, Request, Response, Router } from "express";

import { prisma } from "@/db";

import naturalLanguageSearch from "./naturalLanguageSearch";
import quickSearch from "./quickSearch";

const router = Router();

async function validateTentants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { tenantIds } = req.body;

  if (!Array.isArray(tenantIds) || tenantIds.length === 0) {
    res.status(404).json({ error: "Tenant IDs must be specified" });
    return;
  }

  const tenantMemberships = await prisma.userTenantMembership.findMany({
    where: {
      userId: req.user.id,
      tenantId: { in: tenantIds },
    },
  });

  if (tenantMemberships.length !== tenantIds.length) {
    res
      .status(404)
      .json({ error: "User does not have membership to requested tenants" });
    return;
  }

  next();
}

router.use(validateTentants);
router.use("/quick", quickSearch);
router.use("/natural", naturalLanguageSearch);

export default router;
