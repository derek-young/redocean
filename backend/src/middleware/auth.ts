import { prisma } from "@/db";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: string;
      };
      tenant: {
        id: string;
        name: string;
        subdomain: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    // if (!token) {
    //   res.status(401).json({ error: "Access token required" });
    //   return;
    // }

    const user = await prisma.user.findUnique({
      where: {
        email: "az@galactictradingco.com",
      },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        name: "Galactic Trading Company",
      },
    });

    if (!tenant) {
      res.status(401).json({ error: "Tenant not found" });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    req.tenant = {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
