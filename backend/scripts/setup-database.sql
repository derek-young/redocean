-- Database and User Setup Script for RedOcean
-- Run this script to recreate the database and users

-- Create database
CREATE DATABASE redocean;

-- Create users
CREATE USER api_user WITH PASSWORD 'api_user_password';
CREATE USER ai_reader WITH PASSWORD 'ai_reader_password';

-- Grant database access
GRANT CONNECT ON DATABASE redocean TO api_user, ai_reader;

-- Grant API user full CRUD privileges
GRANT ALL PRIVILEGES ON DATABASE redocean TO api_user;
GRANT USAGE ON SCHEMA public TO api_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO api_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO api_user;

-- Grant AI reader readonly privileges
GRANT USAGE ON SCHEMA public TO ai_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_reader;

-- Grant permissions for future tables (important for Prisma migrations)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO api_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO api_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_reader;
