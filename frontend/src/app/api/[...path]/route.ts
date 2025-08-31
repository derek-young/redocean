import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { Base64 } from "js-base64";

const backendUrl = process.env.BACKEND_URL!;

let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

// In production, the GCP_WIF_CREDENTIALS_BASE64 env var is set
// which containsn the Base64-encoded WIF JSON config, see: gcr_credentials_example.json
async function getAuthClient(targetAudience: string) {
  if (process.env.NODE_ENV === "production") {
    try {
      const credentialsString = Base64.decode(
        process.env.GCP_WIF_CREDENTIALS_BASE64!
      );
      const credentials = JSON.parse(credentialsString);

      const auth = new GoogleAuth({ credentials });

      return auth.getIdTokenClient(targetAudience);
    } catch (error) {
      console.error("Failed to decode or parse WIF credentials:", error);
      throw new Error("Invalid WIF credentials configuration.");
    }
  }

  const auth = new GoogleAuth();
  return auth.getIdTokenClient(targetAudience);
}

async function getAuthHeaders(
  targetAudience: string
): Promise<{ Authorization?: string }> {
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: skipping authentication");
    return {};
  }

  const buffer = 300000; // 5 minutes
  if (cachedToken && tokenExpiryTime && Date.now() + buffer < tokenExpiryTime) {
    return { Authorization: cachedToken };
  }

  const client = await getAuthClient(targetAudience);
  const authHeaders = await client.getRequestHeaders();

  if (authHeaders?.Authorization) {
    cachedToken = authHeaders.Authorization;

    try {
      const tokenParts = cachedToken.split(".");
      if (tokenParts.length === 3) {
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        tokenExpiryTime = decodedPayload.exp * 1000;
      }
    } catch (error) {
      console.warn("Failed to decode JWT token for caching:", error);
      // Continue without caching if decoding fails
      cachedToken = null;
      tokenExpiryTime = null;
    }
  }

  return authHeaders;
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const pathSegments = (await params).path;
    const apiPath = pathSegments.join("/");
    const backendApiUrl = `${backendUrl}/api/v1/${apiPath}`;
    const authHeaders = await getAuthHeaders(backendUrl);
    const headers = new Headers();
    const contentType = request.headers.get("content-type");

    if (contentType) {
      headers.set("content-type", contentType);
    }
    if (authHeaders?.Authorization) {
      headers.set("Authorization", authHeaders.Authorization);
    }

    const body =
      request.method === "GET" || request.method === "DELETE"
        ? undefined
        : request.body;

    const response = await fetch(backendApiUrl, {
      method: request.method,
      headers,
      body,
    });

    const newResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    response.headers.forEach((value, key) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
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
