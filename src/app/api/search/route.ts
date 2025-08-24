import { NextRequest, NextResponse } from "next/server";
import { SearchResponse, SearchRequest, SearchError } from "@/types/search";

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

    // Same routing logic as frontend
    const term = searchTerm.toLowerCase().trim();

    // Route to invoice creation
    if (
      term.includes("invoice") ||
      term.includes("bill") ||
      term.includes("create invoice")
    ) {
      return NextResponse.json({
        route: "/invoice/create",
        action: "create_invoice",
        confidence: "high",
        message: "Creating a new invoice",
      });
    }

    // Route to invoice list/search
    if (
      term.includes("invoices") ||
      term.includes("bills") ||
      term.includes("find invoice")
    ) {
      return NextResponse.json({
        route: "/invoice/list",
        action: "list_invoices",
        confidence: "high",
        message: "Showing invoice list",
      });
    }

    // Route to customer management
    if (
      term.includes("customer") ||
      term.includes("client") ||
      term.includes("contact")
    ) {
      return NextResponse.json({
        route: "/customers",
        action: "manage_customers",
        confidence: "high",
        message: "Managing customers",
      });
    }

    // Route to reports
    if (
      term.includes("report") ||
      term.includes("analytics") ||
      term.includes("dashboard")
    ) {
      return NextResponse.json({
        route: "/reports",
        action: "view_reports",
        confidence: "high",
        message: "Showing reports and analytics",
      });
    }

    // Route to payments
    if (
      term.includes("payment") ||
      term.includes("pay") ||
      term.includes("receive")
    ) {
      return NextResponse.json({
        route: "/payments",
        action: "manage_payments",
        confidence: "high",
        message: "Managing payments",
      });
    }

    // If no direct match, return clarification needed
    return NextResponse.json({
      route: null,
      action: "clarify_intent",
      confidence: "low",
      message: `I'm not sure what you're looking for. You searched for: "${searchTerm}". This is where an LLM would help clarify your intent.`,
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
