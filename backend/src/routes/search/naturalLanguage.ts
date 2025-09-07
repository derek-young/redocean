import { Router, Request, Response, NextFunction } from "express";

import { clarifyUserIntent, getTextEmbedding } from "@/services/openai";
import { prisma } from "@/db";

import { findRouteByEmbedding, findRoutesByQuickAction } from "./findRoute";

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

  console.log("searchTerm", term);

  res.status(200).json({
    message: "Natural language search not implemented yet",
  });
};

router.post("/", validator, handler);

export default router;
