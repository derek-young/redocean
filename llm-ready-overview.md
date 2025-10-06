This app uses Next.js (App Router) as the frontend and edge gateway, with Firebase Authentication for user login, and a Google Cloud Run (GCR) backend API. The backend connects to a Neon Postgres database.

### Auth Flow:

1. The user signs in with Firebase on the client.
2. The client sends the Firebase ID token to /session (a Next.js route).
3. The Next.js server (using a Firebase Admin service account) calls createSessionCookie() and sets a secure, HTTP-only session cookie.

4. For every subsequent /api/\* request, the Next.js “proxy” route:

- Reads and verifies the Firebase session cookie via auth.verifySessionCookie().
- (Optimized: results are cached in memory to avoid redundant Firebase lookups.)
- Injects custom headers (Auth-User-Id, Auth-User-Email, Auth-Provider) and forwards the request to the backend API hosted on Cloud Run.

### Backend Flow:

- Cloud Run services are protected using Identity-Aware Proxy (IAP) or Google service authentication.
- The Next.js server authenticates its requests using a service account obtained via google-auth-library’s getIdTokenClient() (also cached).
- The backend validates the Google-signed identity token and processes the request, hitting Neon Postgres for data persistence.

### Performance Context:

- Current latency bottlenecks come from Firebase token verification and multiple cross-service network hops (Next → Firebase → GCR → Neon).

- Optimizations include:
  - Persistent Firebase Admin SDK instance
  - In-memory session token caching
  - Cached Google auth client (getIdTokenClient())

### Summary:

- Next.js acts as an auth-aware edge proxy (Firebase sessions + API gateway).
- Cloud Run hosts business logic and database access.
- Neon provides persistent storage.
- The system favors modular security and clarity over raw latency, but caching and connection pooling are being added to reduce end-to-end request time.
