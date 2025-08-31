import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getAuthHeaders } from "./gcpAuth";

const backendUrl = process.env.BACKEND_URL!;

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const authHeaders = await getAuthHeaders(backendUrl);
    const newRequestHeaders = new Headers(request.headers);

    if (authHeaders?.Authorization) {
      newRequestHeaders.set("Authorization", authHeaders.Authorization);
    }

    const url = request.nextUrl.clone();
    url.hostname = backendUrl.split("//")[1];
    url.protocol = "https";

    return NextResponse.rewrite(url, {
      request: {
        headers: newRequestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
