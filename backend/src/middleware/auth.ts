import { Request, Response, NextFunction } from "express";
import { and, eq } from "drizzle-orm";

import {
  db,
  identities,
  users,
  tenants,
  userTenantMemberships,
  identityProviderEnum,
} from "@/db";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

type IdentityProvider = (typeof identityProviderEnum.enumValues)[number];

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

  const validProviders = identityProviderEnum.enumValues;

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
  const galacticTradingCompany = await db.query.tenants.findFirst({
    where: eq(tenants.subdomain, "galacticetradingco"),
  });

  if (galacticTradingCompany) {
    const existingMembership = await db.query.userTenantMemberships.findFirst({
      where: and(
        eq(userTenantMemberships.userId, userId),
        eq(userTenantMemberships.tenantId, galacticTradingCompany.id)
      ),
    });

    if (!existingMembership) {
      await db.insert(userTenantMemberships).values({
        userId,
        tenantId: galacticTradingCompany.id,
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

    // Check if this identity already exists
    let identity = await db.query.identities.findFirst({
      where: and(
        eq(identities.provider, provider),
        eq(identities.externalUid, externalUid)
      ),
      with: {
        user: true,
      },
    });

    if (identity) {
      // Identity exists - update email if provided
      if (externalEmail && identity.user.email !== externalEmail) {
        await db
          .update(users)
          .set({ email: externalEmail as string })
          .where(eq(users.id, identity.user.id));
      }
    } else {
      // Identity doesn't exist - check if a user with this email already exists
      let user = externalEmail
        ? await db.query.users.findFirst({
            where: eq(users.email, externalEmail as string),
          })
        : null;

      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            email: externalEmail as string | undefined,
          })
          .returning();
        user = newUser;
      }

      // Create new identity linked to the newly created or existing user
      const [newIdentity] = await db
        .insert(identities)
        .values({
          provider,
          externalUid,
          userId: user.id,
        })
        .returning();

      identity = {
        ...newIdentity,
        user,
      };
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
