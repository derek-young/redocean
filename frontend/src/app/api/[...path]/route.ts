import { getVercelOidcToken } from "@vercel/oidc";
// import fs from "fs/promises";
// import { tmpdir } from "os";
// import { join } from "path";
// import { Base64 } from "js-base64";
import { GoogleAuth, ExternalAccountClient } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL!;

let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

// In production, the GCP_WIF_CREDENTIALS_BASE64 env var is set
// which containsn the Base64-encoded WIF JSON config, see: gcr_credentials_example.json
// async function getAuthClient(targetAudience: string) {
//   console.log("Getting auth client for target audience:", targetAudience);
//   console.log("Node environment:", process.env.NODE_ENV);
//   console.log(
//     "GCP WIF credentials base64:",
//     process.env.GCP_WIF_CREDENTIALS_BASE64
//   );
//   if (process.env.NODE_ENV === "production") {
//     try {
//       const credentialsString = Base64.decode(
//         process.env.GCP_WIF_CREDENTIALS_BASE64!
//       );
//       const credentials = JSON.parse(credentialsString);
//       const tempPath = join(tmpdir(), "gcp-wif-credentials.json");
//       await fs.writeFile(tempPath, credentialsString);

//       console.log("WIF credentials:", credentials);

//       const auth = new GoogleAuth({
//         keyFilename: tempPath,
//         scopes: "https://www.googleapis.com/auth/cloud-platform",
//       });

//       return auth.getIdTokenClient(targetAudience);
//     } catch (error) {
//       console.error("Failed to decode or parse WIF credentials:", error);
//       throw new Error("Invalid WIF credentials configuration.");
//     }
//   }

//   const auth = new GoogleAuth();
//   return auth.getIdTokenClient(targetAudience);
// }

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
  process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

const authClient = ExternalAccountClient.fromJSON({
  type: "external_account",
  audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
  projectId: GCP_PROJECT_ID,
  subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
  token_url: "https://sts.googleapis.com/v1/token",
  service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  subject_token_supplier: {
    // Use the Vercel OIDC token as the subject token
    getSubjectToken: getVercelOidcToken,
  },
});

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

  console.log("Using BaseExternalAccountClient:", authClient);

  const client = authClient;
  const authHeaders = await client?.getRequestHeaders();

  console.log("Auth headers:", authHeaders);

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

  return authHeaders || {};
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

    console.log("Fetching backend API URL:", backendApiUrl);
    console.log("Headers:", headers);

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
