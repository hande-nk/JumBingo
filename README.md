# Jumbingo

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

- Node.js (22 or newer)
- Database will be conencted shortly, info will be updated
- Any API keys needed will be shared shortly (probably none, but still)

### Installation

```bash
git clone https://github.com/hande-nk/JumBingo.git
cd jumbingo
npm install
```

### Testing
End-to-end tests live in e2e/ and use Playwright. They log in with TEST_EMAIL / TEST_PASSWORD (a pre-existing Supabase account) and run against a dev server that Playwright starts automatically.

```
bash
npx playwright test --project=chromium
```

The same tests run in CI on every push and pull request via .github/workflows/playwright.yml, using repository secrets for the environment variables.

### Deployment

Deployed on Vercel, which auto-deploys on merge to main and creates a preview deployment for every pull request. Set the same environment variables in the Vercel project settings (Production and Preview). For production scale, use the Supabase transaction pooler (port 6543) string as DATABASE_URL.

## Project Structure

```
app/            App Router routes and pages
  api/          route handlers (JSON endpoints)
  login/        auth pages and server actions
  main/         the bingo board
  question/     answer submission
  admin/        answer review and question management
  leaderboard/  rankings
  user/         profile with team join and leave
lib/            shared server code (prisma client, auth helpers, leaderboard, game logic)
  supabase/     Supabase browser and server clients, session proxy
prisma/         schema, migrations, seed script
e2e/            Playwright tests
```


## Team

- Dev: Hande Naz Kavas


