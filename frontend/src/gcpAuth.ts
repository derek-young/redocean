import { GoogleAuth } from "google-auth-library";

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
  const client = await auth.getIdTokenClient(targetAudience);

  return await client.getRequestHeaders();
}
