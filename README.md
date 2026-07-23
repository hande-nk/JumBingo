# Jumbo'ngo

JumBINGO is an online Bingo app where each box contains a Tufts or programming-related trivia question or task. Each member logs in with their Tufts credentials, and their account is automatically created by reading their names from the mail handle. When they log in, they see the team options and select one to join. Admins can view, update, and delete players, teams, and questions. Everyone can see the leaderboard, where teams and individuals are ranked by their dynamic points. 

## Tech Stack

- Frontend: Next.js (app router) + TypeScript + Tailwind
- Backend: Next.js  API routes (+ Zod)
- Database: Supabase Postgres, schema via Prisma
- Auth: Supabase Auth
- Deployment: Vercel
- Testing: Playwright + GitHub Actions

## Getting Started

### Prerequisites

- Node.js (version)
- Database will be conencted shortly, info will be updated
- Any API keys needed will be shared shortly (probably none, but still)

### Installation

```bash
git clone <repo-url>
cd <repo-name>
npm install
```

### Environment Variables

Create a `.env.local` file in the root with:

```
DATABASE_URL=
NEXTAUTH_SECRET=
# the keys will be added shortly
```

Never commit `.env` files. They're already in `.gitignore`.

### Running Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Project Structure

```
/app or /pages   -> routes / pages
/components      -> reusable UI components
/lib             -> helper functions, API clients, db utilities
/prisma          -> database schema (if using Prisma)
/public          -> static assets
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming, commit conventions, and the PR process.

## Team

- Dev: Hande Naz Kavas

## License
TBD
