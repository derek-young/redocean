#!/bin/bash

# Database Setup Script for RedOcean
# This script recreates the database and users from scratch

set -e  # Exit on any error

echo "🗄️  Setting up RedOcean database..."

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="derekyoung"
DB_NAME="redocean"

# User credentials
API_USER="api_user"
API_PASSWORD="api_user_password"
AI_READER_USER="ai_reader"
AI_READER_PASSWORD="ai_reader_password"

echo "Dropping existing database if it exists..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" || true

echo "Creating database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "Creating users..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP USER IF EXISTS $API_USER; CREATE USER $API_USER WITH PASSWORD '$API_PASSWORD';" || true
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP USER IF EXISTS $AI_READER_USER; CREATE USER $AI_READER_USER WITH PASSWORD '$AI_READER_PASSWORD';" || true

echo "Granting permissions..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "GRANT CONNECT ON DATABASE $DB_NAME TO $API_USER, $AI_READER_USER;"

# Grant API user full privileges
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $API_USER;
GRANT USAGE ON SCHEMA public TO $API_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $API_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $API_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $API_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $API_USER;
"

# Grant AI reader readonly privileges
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
GRANT USAGE ON SCHEMA public TO $AI_READER_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO $AI_READER_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO $AI_READER_USER;
"

echo "Testing connections..."

# Test API user connection
if psql "postgresql://$API_USER:$API_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable" -c "SELECT current_user, current_database();" > /dev/null 2>&1; then
    echo "✅ API user connection successful"
else
    echo "❌ API user connection failed"
    exit 1
fi

# Test AI reader connection
if psql "postgresql://$AI_READER_USER:$AI_READER_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable" -c "SELECT current_user, current_database();" > /dev/null 2>&1; then
    echo "✅ AI reader connection successful"
else
    echo "❌ AI reader connection failed"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Connection strings:"
echo "DATABASE_URL=\"postgresql://$API_USER:$API_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable\""
echo "DATABASE_URL_READONLY=\"postgresql://$AI_READER_USER:$AI_READER_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable\""
echo ""
echo "Next steps:"
echo "1. Update your .env file with the connection strings above"
echo "2. Run 'npx prisma migrate dev' to create tables"
