import { IdentityProvider } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

import { prisma } from "@/db";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function validateAuthHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const externalUid = req.headers["auth-user-id"];
  const externalEmail = req.headers["auth-user-email"];
  const provider = req.headers["auth-provider"];

  if (!externalUid || typeof externalUid !== "string") {
    res.status(401).json({ error: "Auth-User-Id header must be a string" });
    return;
  }

  if (externalEmail && typeof externalEmail !== "string") {
    res.status(401).json({ error: "Auth-User-Email header must be a string" });
    return;
  }

  if (!provider || typeof provider !== "string") {
    res.status(401).json({ error: "Auth-Provider header must be a string" });
    return;
  }

  const validProviders = Object.values(IdentityProvider);

  if (!validProviders.includes(provider as IdentityProvider)) {
    res.status(401).json({
      error: `Auth-Provider must be one of: ${validProviders.join(", ")}`,
    });
    return;
  }

  next();
}

// For the demo@redoceanapp.com user
// Create user tenant membership for Galactic Trading Company
// if Galactic Trading Company exists and the user is not a member
async function addDemoUserToGalacticTradingCompany(userId: string) {
  const galacticTradingCompany = await prisma.tenant.findUnique({
    where: { subdomain: "galacticetradingco" },
  });
  if (galacticTradingCompany) {
    const existingMembership = await prisma.userTenantMembership.findUnique({
      where: {
        userId_tenantId: {
          userId,
          tenantId: galacticTradingCompany.id,
        },
      },
    });
    if (!existingMembership) {
      await prisma.userTenantMembership.create({
        data: {
          userId,
          tenantId: galacticTradingCompany.id,
        },
      });
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Values are type-cast since their existence is checked in validateAuthHeaders
    const externalUid = req.headers["auth-user-id"] as string;
    const externalEmail = req.headers["auth-user-email"];
    const provider = req.headers["auth-provider"] as IdentityProvider;

    console.log("authenticateUser");
    console.log(req.headers);

    // Check if this identity already exists
    let identity = await prisma.identity.findUnique({
      where: {
        provider_externalUid: { provider, externalUid },
      },
      include: {
        user: true,
      },
    });

    if (identity) {
      // Identity exists - update email if provided
      if (externalEmail && identity.user.email !== externalEmail) {
        await prisma.user.update({
          where: { id: identity.user.id },
          data: { email: externalEmail as string },
        });
      }
    } else {
      // Identity doesn't exist - check if a user with this email already exists
      let user = externalEmail
        ? await prisma.user.findUnique({
            where: { email: externalEmail as string },
          })
        : null;

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: externalEmail as string | undefined,
          },
        });
      }

      // Create new identity linked to the newly created or existing user
      identity = await prisma.identity.create({
        data: {
          provider,
          externalUid,
          userId: user.id,
        },
        include: {
          user: true,
        },
      });
    }

    if (!identity) {
      res.status(401).json({ error: "Identity not found" });
      return;
    }

    if (externalUid === "YumX8xisePNUjt53B8fK0VMAIXf2") {
      await addDemoUserToGalacticTradingCompany(identity.user.id);
    }

    req.userId = identity.user.id;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
