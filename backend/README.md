## Getting Started

### Environment Setup

This project requires defining two environment variabls: an OpenAI API key and PostgreSQL database URL. Create a `.env` file in the root directory with your configuration:

```bash
# OpenAI API Key for generating embeddings
OPENAI_API_KEY=your_openai_api_key_here

# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/redocean"
```

### Generating Route Embeddings

To generate embeddings for route descriptions, first run:

```bash
npm run generate:routes
```

This will create a sitemap under `src/data/` that includes all routes and their input field names. Manually update the descriptions and quick actions of each route. The description should be LLM-friendly. The quick actions are what a human would expect to be able to type to get to that route.

After descriptions and quick actions have been entered, run:

```bash
npm run generate:embeddings
```

This will create embeddings for all routes defined in `src/data/route-embeddings.json`.

### Database Setup

**Set up the database schema and seed data**:

```bash
# Generate Prisma client
npm run db:generate

# Start dev DB server
npm run db:dev

# Push schema to database
npm run db:push

# OR push and wipe all existing data
npm run db:push:reset

# Seed the database with initial data
npm run db:seed
```

### Database Management

- **View database in Prisma Studio**: `npm run db:studio`
- **Generate Prisma client**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **Create and run migrations**: `npm run db:migrate`

## Deploy on Google Cloud Run

This project is configured for deployment on Google Cloud Run with PostgreSQL support.

### Prerequisites

1. **Google Cloud Project**: Create a project in Google Cloud Console
2. **Cloud SQL**: Set up a PostgreSQL instance in Cloud SQL
3. **Cloud Build**: Enable Cloud Build API
4. **Container Registry**: Enable Container Registry API

### Deployment Steps

1. **Set up Cloud SQL PostgreSQL**:

   ```bash
   gcloud sql instances create redocean-db \
     --database-version=POSTGRES_14 \
     --tier=db-f1-micro \
     --region=us-central1

   gcloud sql databases create redocean --instance=redocean-db
   gcloud sql users create redocean-user --instance=redocean-db --password=your-password
   ```

2. **Get the database connection string**:

   ```bash
   gcloud sql instances describe redocean-db --format="value(connectionName)"
   ```

3. **Update `cloudbuild.yaml`** with your actual database URL and OpenAI API key

4. **Deploy using Cloud Build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

### Environment Variables

Set these environment variables in Cloud Run:

- `DATABASE_URL`: Your Cloud SQL PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key

### Local Development with Cloud SQL

To connect to Cloud SQL from your local machine:

```bash
gcloud sql connect redocean-db --user=redocean-user
```
