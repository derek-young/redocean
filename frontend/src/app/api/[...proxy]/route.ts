import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { auth } from "@/firebaseAdmin";
import { getAuthHeaders } from "@/gcpAuth";

const backendUrl = process.env.BACKEND_URL;

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Missing session" }, { status: 401 });
    }

    console.log("Backend URL:", backendUrl);
    if (!backendUrl) {
      throw new Error("BACKEND_URL environment variable is not set");
    }

    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const authHeaders = await getAuthHeaders(backendUrl);
    const apiReqHeaders = new Headers(authHeaders);

    apiReqHeaders.set("X-User-Id", decoded.uid);
    apiReqHeaders.set("X-User-Email", decoded.email || "");

    console.log("Auth headers:", authHeaders);

    const contentType = request.headers.get("content-type");

    if (contentType) {
      apiReqHeaders.set("content-type", contentType);
    }
    // if (authHeaders?.Authorization) {
    //   headers.set("Authorization", authHeaders.Authorization);
    // }

    const body =
      request.method === "GET" || request.method === "DELETE"
        ? undefined
        : request.body;

    console.log("apiReqHeaders:", apiReqHeaders);

    const pathSegments = (await params).path;
    const apiPath = pathSegments.join("/");
    const backendApiUrl = `${backendUrl}/api/${apiPath}`;

    console.log("Processing proxy request for path:", apiPath);
    console.log("Fetching backend API URL:", backendApiUrl);

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

    // const contentType = apiResp.headers.get("content-type");

    // if (contentType?.includes("application/json")) {
    //   const jsonBody = await apiResp.json();

    //   return res.status(apiResp.status).json(jsonBody);
    // } else {
    //   const textBody = await apiResp.text();

    //   return res.status(apiResp.status).send(textBody);
    // }
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
