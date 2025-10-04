import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/firebase/admin";
import { getAuthHeaders } from "@/gcpAuth";

const backendUrl = process.env.BACKEND_URL!;

async function handler(
  request: NextRequest,
  context: RouteContext<"/api/[...proxy]">
) {
  try {
    const { params } = context;
    const { proxy: pathSegments } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Missing session" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await auth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      console.error("Session cookie verification failed:", error);

      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const authHeaders = await getAuthHeaders(backendUrl);
    const apiReqHeaders = new Headers(authHeaders);

    console.log("decoded", decoded);

    apiReqHeaders.set("Auth-User-Id", decoded.uid);
    apiReqHeaders.set("Auth-User-Email", (decoded.email ?? "").toLowerCase());
    // TODO: Use Enum from backend
    apiReqHeaders.set("Auth-Provider", "FIREBASE");

    const contentType = request.headers.get("content-type");

    if (contentType) {
      apiReqHeaders.set("content-type", contentType);
    }

    const body =
      request.method === "GET" || request.method === "DELETE"
        ? undefined
        : request.body;

    const apiPath = pathSegments.join("/");
    const backendApiUrl = `${backendUrl}/api/${apiPath}`;

    const apiServiceResponse = await fetch(backendApiUrl, {
      method: request.method,
      headers: apiReqHeaders,
      body,
    });

    const response = new NextResponse(apiServiceResponse.body, {
      status: apiServiceResponse.status,
      statusText: apiServiceResponse.statusText,
    });

    apiServiceResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error proxying request to backend:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Failed to proxy request to backend",
        message: isDevelopment ? errorMessage : "Internal server error",
        ...(isDevelopment && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },

      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
