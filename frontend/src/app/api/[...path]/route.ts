import { getVercelOidcToken } from "@vercel/oidc";
import {
  GoogleAuth,
  ExternalAccountClient,
  Impersonated,
} from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL!;

let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
  process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

const credentials = {
  type: "external_account",
  audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
  projectId: GCP_PROJECT_ID,
  subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
  token_url: "https://sts.googleapis.com/v1/token",
  service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  credential_source: {
    url: "https://oidc.vercel.com",
  },
};

// async function getIdToken() {
//   const client = ExternalAccountClient.fromJSON(credentials);

//   const targetClient = client
//     ? new Impersonated({
//         sourceClient: client,
//         targetPrincipal: GCP_SERVICE_ACCOUNT_EMAIL,
//         lifetime: 30,
//         delegates: [],
//         targetScopes: ["https://www.googleapis.com/auth/cloud-platform"],
//       })
//     : null;

//   const idToken = await targetClient?.fetchIdToken(backendUrl);

//   return idToken;
// }

async function getAuthClient(targetAudience: string) {
  console.log("Getting auth client for target audience:", targetAudience);
  console.log("Node environment:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    const auth = new GoogleAuth({
      credentials,
      projectId: GCP_PROJECT_ID,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    return auth.getIdTokenClient(targetAudience);
  }

  const auth = new GoogleAuth();
  return auth.getIdTokenClient(targetAudience);
}

// async function getAuthHeaders(
//   targetAudience: string
// ): Promise<{ Authorization?: string }> {
//   if (process.env.NODE_ENV === "development") {
//     console.log("Development mode: skipping authentication");
//     return {};
//   }

//   const buffer = 300000; // 5 minutes
//   if (cachedToken && tokenExpiryTime && Date.now() + buffer < tokenExpiryTime) {
//     return { Authorization: cachedToken };
//   }

//   const client = await getAuthClient(targetAudience);
//   const authHeaders = await client?.getRequestHeaders();

//   console.log("Auth headers:", authHeaders);

//   if (authHeaders?.Authorization) {
//     cachedToken = authHeaders.Authorization;

//     try {
//       const tokenParts = cachedToken.split(".");
//       if (tokenParts.length === 3) {
//         const decodedPayload = JSON.parse(atob(tokenParts[1]));
//         tokenExpiryTime = decodedPayload.exp * 1000;
//       }
//     } catch (error) {
//       console.warn("Failed to decode JWT token for caching:", error);
//       // Continue without caching if decoding fails
//       cachedToken = null;
//       tokenExpiryTime = null;
//     }
//   }

//   return authHeaders || {};
// }

async function getAuthHeaders(): Promise<{ Authorization?: string }> {
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode: skipping authentication");
    return {};
  }

  const buffer = 300000; // 5 minutes
  if (cachedToken && tokenExpiryTime && Date.now() + buffer < tokenExpiryTime) {
    return { Authorization: `Bearer ${cachedToken}` };
  }

  // 1. Get the OIDC token from Vercel
  const subjectToken = await getVercelOidcToken();

  // 2. Exchange OIDC → federated access token with STS
  const stsResponse = await fetch("https://sts.googleapis.com/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
      requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
      subject_token: subjectToken,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    }),
  });

  if (!stsResponse.ok) {
    throw new Error(`STS exchange failed: ${await stsResponse.text()}`);
  }

  // const { access_token: stsToken } = await stsResponse.json();

  // // 3. (Optional) Impersonate service account for final GCP access token
  // const impersonateResponse = await fetch(
  //   `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  //   {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${stsToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       scope: ["https://www.googleapis.com/auth/cloud-platform"],
  //     }),
  //   }
  // );

  if (!stsResponse.ok) {
    throw new Error(`STS exchange failed: ${await stsResponse.text()}`);
  }

  const { access_token, expires_in } = await stsResponse.json();

  // 3. Cache token and expiry
  cachedToken = access_token;
  tokenExpiryTime = Date.now() + expires_in * 1000;

  return { Authorization: `Bearer ${access_token}` };

  // if (!impersonateResponse.ok) {
  //   throw new Error(
  //     `Service account impersonation failed: ${await impersonateResponse.text()}`
  //   );
  // }

  // const { accessToken, expireTime } = await impersonateResponse.json();

  // // 4. Cache until expiry
  // cachedToken = accessToken;
  // tokenExpiryTime = new Date(expireTime).getTime();

  // return { Authorization: `Bearer ${accessToken}` };
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const pathSegments = (await params).path;
    const apiPath = pathSegments.join("/");
    const backendApiUrl = `${backendUrl}/api/${apiPath}`;
    const authHeaders = await getAuthHeaders();
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
