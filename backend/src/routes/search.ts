import { Router, Request, Response } from "express";
import { SearchResponse, SearchRequest, SearchError } from "@/types/search";
import { clarifyUserIntent, getTextEmbedding } from "../services/openai";
import {
  findRouteByEmbedding,
  findRouteByQuickAction,
} from "../utils/findRoute";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { searchTerm }: SearchRequest = req.body;

    if (!searchTerm || typeof searchTerm !== "string") {
      res.status(400).json({
        error: "Search term is required and must be a string",
      } as SearchError);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    console.log(`User query: "${term}"`);

    const routeByQuickAction = await findRouteByQuickAction(term);

    if (routeByQuickAction) {
      res.json({ route: routeByQuickAction.path } as SearchResponse);
      return;
    }

    // NOTE: The text embedding comparison may not be useful after evaluating the quick action
    // If the query doesn't match a quick action, it will likely need to be evaluated by an LLM
    const data = await getTextEmbedding(term);
    const route = await findRouteByEmbedding(data[0].embedding);

    if (route.confidence > 0.7) {
      res.json({ route: route.path } as SearchResponse);
      return;
    }

    const intent = await clarifyUserIntent(searchTerm);

    console.log("intent", intent);

    res.json({
      route: intent.route,
      params: intent.params,
      message: intent.message,
    } as SearchResponse);
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({
      error: "Internal server error",
    } as SearchError);
  }
});

export default router;
