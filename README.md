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
