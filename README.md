# RedOcean

Kickass accounting software.

## Quick Start

### Backend Setup

```bash
cd backend
```

Add your DATABASE_URL and OPENAI_API_KEY to .env

```bash
npm i
npm run db:generate
npm run db:dev
npm run db:push:wipe
npm run db:seed
```

### Frontend Setup

```bash
cd nextjs
npm i
npm run dev
```

## Development

- **Backend**: http://localhost:2550 (API server)
- **Frontend**: http://localhost:3000 (Next.js app)
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful endpoints

## Deployment to Google Cloud Run

This project is configured for deployment to Google Cloud Run with separate services for the backend and frontend.

### Prerequisites

1. **Google Cloud SDK**: Install and configure the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. **Docker**: Ensure Docker is installed and running
3. **Google Cloud Project**: Create or select a Google Cloud project
4. **PostgreSQL Database**: Set up a PostgreSQL database (Cloud SQL recommended)

### Environment Variables

Set the following environment variables:

```bash
export DATABASE_URL="postgresql://username:password@host:port/database"
export OPENAI_API_KEY="your-openai-api-key"
export PROJECT_ID="your-gcp-project-id"
```

### Quick Deployment

Use the provided deployment script:

```bash
# Make sure you're in the project root
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

#### 1. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 2. Deploy Backend

```bash
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/redocean-backend
gcloud run deploy redocean-backend \
  --image gcr.io/$PROJECT_ID/redocean-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars DATABASE_URL=$DATABASE_URL,OPENAI_API_KEY=$OPENAI_API_KEY
```

#### 3. Deploy Frontend

```bash
cd nextjs
gcloud builds submit --tag gcr.io/$PROJECT_ID/redocean-frontend
gcloud run deploy redocean-frontend \
  --image gcr.io/$PROJECT_ID/redocean-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars BACKEND_URL=https://redocean-backend-$PROJECT_ID.us-central1.run.app
```

### Production URLs

After deployment, your services will be available at:

- **Frontend**: `https://redocean-frontend-[PROJECT_ID].us-central1.run.app`
- **Backend**: `https://redocean-backend-[PROJECT_ID].us-central1.run.app`
- **Health Check**: `https://redocean-backend-[PROJECT_ID].us-central1.run.app/health`

### Database Setup

For production, we recommend using Google Cloud SQL:

1. Create a PostgreSQL instance in Cloud SQL
2. Create a database and user
3. Update the DATABASE_URL with the Cloud SQL connection string
4. Run database migrations:

```bash
cd backend
npm run db:push
npm run db:seed
```

### Monitoring and Logs

View logs for your services:

```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=redocean-backend"

# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=redocean-frontend"
```

### Scaling and Performance

The services are configured with:

- **Memory**: 512Mi per instance
- **CPU**: 1 vCPU per instance
- **Max Instances**: 10 (auto-scaling)
- **Min Instances**: 0 (scale to zero)

Adjust these settings in the `cloudbuild.yaml` files as needed.
