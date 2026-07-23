# [Project Name]

One or two sentences: what this project is and who it's for (nonprofit client name + what problem it solves).

## Tech Stack

- Frontend:
- Backend:
- Database:
- Auth:
- Deployment:

## Getting Started

### Prerequisites

- Node.js (version)
- [Database] running locally or a connection string
- Any API keys needed (see Environment Variables below)

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
# add other keys as needed
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

- Tech Lead: Hande Naz Kavas
- Developers:

## License

[MIT / TBD]
