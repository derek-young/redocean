import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Search API is working",
    endpoints: {
      search: "/api/search",
      method: "POST",
      body: { searchTerm: "string" },
    },
    examples: [
      { searchTerm: "create invoice", expectedRoute: "/invoice/create" },
      { searchTerm: "customers", expectedRoute: "/customers" },
      { searchTerm: "reports", expectedRoute: "/reports" },
      { searchTerm: "payments", expectedRoute: "/payments" },
    ],
  });
}
