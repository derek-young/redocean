import { Router, Request, Response, NextFunction } from "express";

import { prisma } from "@/db";

import { findRoutesByQuickAction } from "./findRoute";

const router = Router();

const validator = (req: Request, res: Response, next: NextFunction): void => {
  const { searchTerm }: { searchTerm: string } = req.body;

  if (!searchTerm || typeof searchTerm !== "string") {
    res.status(400).json({
      error: "Search term is required and must be a string",
    });
    return;
  }

  next();
};

const handler = async (req: Request, res: Response): Promise<void> => {
  const { searchTerm }: { searchTerm: string } = req.body;
  const term = searchTerm.toLowerCase().trim();

  // Step one: fuzzy match on customers and vendors (case-insensitive)
  const customers = await prisma.customer.findMany({
    where: {
      name: {
        contains: term,
        mode: "insensitive",
      },
    },
  });

  const vendors = await prisma.vendor.findMany({
    where: {
      name: {
        contains: term,
        mode: "insensitive",
      },
    },
  });

  console.log("searchTerm", term);
  console.log("customers found:", customers.length);
  console.log("vendors found:", vendors.length);
  const routes = findRoutesByQuickAction(term);

  // NOTE: The text embedding comparison may not be useful after evaluating the quick action
  // If the query doesn't match a quick action, it will likely need to be evaluated by an LLM
  // const data = await getTextEmbedding(term);
  // const route = await findRouteByEmbedding(data[0].embedding);
  // const intent = await clarifyUserIntent(searchTerm);

  res.json({
    type: "entity_match",
    customers,
    vendors,
    routes,
    searchTerm: term,
  });
};

router.post("/", validator, handler);

export default router;
