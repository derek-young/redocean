#!/bin/bash

# Restore Read-Only User Access Script for RedOcean
# This script restores the ai_reader user's access to tables after db:push:reset

set -e  # Exit on any error

echo "🔐 Restoring read-only user access..."

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="derekyoung"
DB_NAME="redocean"

# Read-only user details
AI_READER_USER="ai_reader"

echo "Granting read-only permissions to $AI_READER_USER..."

# Grant read-only privileges to existing and future tables
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
GRANT USAGE ON SCHEMA public TO $AI_READER_USER;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO $AI_READER_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO $AI_READER_USER;
"

echo "Testing read-only user connection..."

# Test AI reader connection
if psql "postgresql://$AI_READER_USER:ai_reader_password@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable" -c "SELECT current_user, current_database();" > /dev/null 2>&1; then
    echo "✅ AI reader connection successful"
else
    echo "❌ AI reader connection failed"
    exit 1
fi

echo ""
echo "🎉 Read-only user access restored!"
echo ""
echo "The ai_reader user now has SELECT access to all tables."
