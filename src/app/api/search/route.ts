import { NextRequest, NextResponse } from "next/server";
import { SearchResponse, SearchRequest, SearchError } from "@/types/search";

import findRoute from "@/app/scripts/findRoute";

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

    // Similarity for term "create invoice" is 0.75 on desc: "create a new invoice for a customer"
    // Similarity for term "create invoice for bob's diner" is 0.5886

    const term = searchTerm.toLowerCase().trim();
    const route = await findRoute(term);

    console.log("Best match:", route);

    if (route.confidence > 0.5) {
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
