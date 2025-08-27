import { NextRequest, NextResponse } from "next/server";
import { SearchResponse, SearchRequest, SearchError } from "@/types/search";

import { getTextEmbedding } from "@/app/scripts/openai";
import {
  findRouteByEmbedding,
  findRouteByQuickAction,
} from "@/app/scripts/findRoute";

export async function POST(
  request: NextRequest
): Promise<NextResponse<SearchResponse | SearchError>> {
  try {
    const { searchTerm }: SearchRequest = await request.json();

    if (!searchTerm || typeof searchTerm !== "string") {
      return NextResponse.json(
        { error: "Search term is required and must be a string" },
        { status: 400 }
      );
    }

    const term = searchTerm.toLowerCase().trim();
    console.log(`User query: "${term}"`);

    const routeByQuickAction = await findRouteByQuickAction(term);

    if (routeByQuickAction) {
      return NextResponse.json({ route: routeByQuickAction.path });
    }

    // NOTE: The text embedding comparison may not be useful after evaluating the quick action
    // If the query doesn't match a quick action, it will likely need to be evaluated by an LLM
    const data = await getTextEmbedding(term);
    const route = await findRouteByEmbedding(data[0].embedding);

    if (route.confidence > 0.7) {
      return NextResponse.json({ route: route.path });
    }

    return NextResponse.json({
      route: null,
      message: `I'm not sure what you're looking for. You searched for: "${searchTerm}".`,
      suggestions: [
        "create invoice",
        "view invoices",
        "manage customers",
        "view reports",
        "manage payments",
      ],
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
