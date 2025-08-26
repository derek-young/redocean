## Getting Started

### Environment Setup

This project requires defining two environment variabls: an OpenAI API key and PostgreSQL database URL. Create a `.env` file in the root directory with your configuration:

```bash
# OpenAI API Key for generating embeddings
OPENAI_API_KEY=your_openai_api_key_here

# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/altbooks"
```

### Generating Route Embeddings

To generate embeddings for route descriptions, first run:

```bash
npm run generate:routes
```

This will create a sitemap under `src/app/api/` that includes all routes and their input field names. Manually update the descriptions and quick actions of each route. The description should be LLM-friendly. The quick actions are what a human would expect to be able to type to get to that route.

After descriptions and quick actions have been entered, run:

```bash
npm run generate:embeddings
```

This will create embeddings for all routes defined in `src/app/api/routes.json`.

### Running the Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Database Setup

1. **Install PostgreSQL** (if not already installed):

   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create the database**:

   ```bash
   createdb altbooks
   ```

3. **Run database dev server**:

   ```bash
   npm run db:dev
   ```

4. **Set up the database schema**:
   ```bash
   npm run db:push
   ```

### Database Management

- **View database in Prisma Studio**: `npm run db:studio`
- **Generate Prisma client**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **Create and run migrations**: `npm run db:migrate`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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
   gcloud sql instances create altbooks-db \
     --database-version=POSTGRES_14 \
     --tier=db-f1-micro \
     --region=us-central1

   gcloud sql databases create altbooks --instance=altbooks-db
   gcloud sql users create altbooks-user --instance=altbooks-db --password=your-password
   ```

2. **Get the database connection string**:

   ```bash
   gcloud sql instances describe altbooks-db --format="value(connectionName)"
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
gcloud sql connect altbooks-db --user=altbooks-user
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
