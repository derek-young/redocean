# RedOcean

Kickass accounting software.

## Quick Start

### Backend Setup

```bash
cd backend
```

```bash
npm i
npm run db:generate
npm run db:dev
npm run db:push:wipe
npm run db:seed
```

### Frontend Setup

```bash
cd frontend
npm i
npm run dev
```

## Development

- **Backend**: http://localhost:2550 (API server)
- **Frontend**: http://localhost:3000 (Next.js app)
- **Database**: PostgreSQL with Prisma ORM

### Routing Behavior

The NextJS routing is organized as follows:

**Authentication routes (managed by NextJS)**

- app/api/session/route.ts → Handles login/session creation
- app/api/logout/route.ts → Handles logout and clears the cookie

**Proxying to the backend API**

- app/api/[...proxy]/route.ts → Catch-all route handler that proxies requests from /api/\* to the API service.
- Cookies set during authentication are automatically forwarded to the backend, so the API receives authenticated requests.

### Deployment

#### Prerequisites

1. **Google Cloud SDK**: Install and configure the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

#### 1. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 2. Deploy Backend

```bash
cd backend
gcloud builds submit --config cloudbuild.yaml --substitutions=_DATABASE_URL=[connection string from Neon]
```

### Production URLs

Services are available at:

- **Frontend**: `https://redocean-git-main-derekyoungs-projects.vercel.app`
- **Backend**: `https://redocean-backend-989102844665.us-central1.run.app`
- **Database**: Managed by Neon: https://console.neon.tech/app/projects/silent-frog-45100450

### Monitoring and Logs

Logs for backend service:

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=redocean-backend"
```
