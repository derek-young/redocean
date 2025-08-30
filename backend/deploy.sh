#!/bin/bash

# RedOcean Deployment Script
# This script deploys both backend and frontend to Google Cloud Run

if [ -f ".env" ]; then
    echo -e "Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "DATABASE_URL environment variable is required"
    echo "Please set it in your .env file or with: export DATABASE_URL='your-postgresql-connection-string'"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "OPENAI_API_KEY environment variable is required"
    echo "Please set it in your .env file or with: export OPENAI_API_KEY='your-openai-api-key'"
    exit 1
fi

# Enable required APIs
echo -e "Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Deploy using Cloud Build
echo -e "Building and deploying with Cloud Build..."
gcloud builds submit \
    --config cloudbuild.yaml \
    --substitutions=DATABASE_URL="$DATABASE_URL",OPENAI_API_KEY="$OPENAI_API_KEY" \
    .

# Get the deployed URLs
echo -e "Getting deployment URLs..."
BACKEND_URL=$(gcloud run services describe redocean-backend --region=$REGION --format="value(status.url)")

echo -e "Deployment completed successfully!"
echo -e "Backend URL: ${BACKEND_URL}"
echo -e "Health check: ${BACKEND_URL}/health"
