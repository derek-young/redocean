import { GoogleAuth } from "google-auth-library";

export async function getAuthHeaders(targetAudience: string) {
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(targetAudience);
  return await client.getRequestHeaders();
}
