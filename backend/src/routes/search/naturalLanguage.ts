import { Router, Request, Response, NextFunction } from "express";

import { searchAgent } from "@/services/agents";

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

  try {
    const agentResponse = await searchAgent(searchTerm);

    const { route, params, message } = JSON.parse(agentResponse.output_text);

    res.json({
      route,
      params,
      message,
    });
  } catch (error) {
    console.error("Natural language search error:", error);
    res.status(500).json({
      message: "Natural language search error",
    });
  }
};

router.post("/", validator, handler);

export default router;
