import { GoogleAuth } from "google-auth-library";

let client: any = null;
let cachedTokenExpiry = 0;

export async function getAuthHeaders(targetAudience: string) {
  const options =
    process.env.NODE_ENV === "production"
      ? {
          credentials: {
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY,
            project_id: process.env.FIREBASE_PROJECT_ID,
          },
        }
      : undefined;
  const auth = new GoogleAuth(options);

  if (!client || Date.now() > cachedTokenExpiry) {
    client = await auth.getIdTokenClient(targetAudience);
    cachedTokenExpiry = Date.now() + 50 * 60 * 1000; // 50 min buffer
  }

  return client.getRequestHeaders();
}
