import { NextRequest, NextResponse } from "next/server";
import { SearchResponse, SearchRequest, SearchError } from "@/types/search";

import { clarifyUserIntent, getTextEmbedding } from "@/app/api/openai";

import { findRouteByEmbedding, findRouteByQuickAction } from "./findRoute";

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

    const intent = await clarifyUserIntent(searchTerm);

    console.log("intent", intent);

    return NextResponse.json({
      route: intent.route,
      params: intent.params,
      message: intent.message,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
