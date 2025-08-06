# Repositorio Digital EMAT

## Overview

This project is a Next.js application for both client and server functions. It uses several modern tools and libraries:

- **better-auth**: Authentication management
- **shadcn/ui**: UI components
- **sonner (toast)**: Toast notifications
- **tailwindcss**: Utility-first CSS framework
- **prettier**: Code formatter
- **eslint**: Linting
- **husky**: Git hooks
- **commitlint**: Enforces Conventional Commits
- **pnpm**: Package manager (instead of npm)
- **Prisma**: ORM for database access

## NPM Scripts

| Script         | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| dev           | Start Next.js in development mode with Turbopack                            |
| build         | Build the Next.js app                                                       |
| start         | Start the production server                                                  |
| lint          | Run ESLint on the project                                                    |
| lint:fix      | Run ESLint and automatically fix issues                                      |
| format        | Format code with Prettier                                                    |
| format:check  | Check code formatting with Prettier                                          |
| prepare       | Prepare Husky git hooks                                                      |
| lint-staged   | Run lint-staged (configured in package.json)                                 |
| db:push       | Push Prisma schema changes to the database                                   |
| db:studio     | Open Prisma Studio                                                           |
| db:generate   | Generate Prisma client from schema                                           |
| db:migrate    | Run Prisma migrations                                                        |
| db:start      | Start database with Docker Compose                                           |
| db:watch      | Start database in watch mode with Docker Compose                             |
| db:stop       | Stop Docker Compose database                                                 |
| db:down       | Remove Docker Compose database containers                                    |

## Husky & Commitlint

- **Husky** runs pre-commit hooks to ensure code quality.
- It checks commit messages against Conventional Commits using the rules in `commitlint.config.js`.
- It also runs lint-staged before committing.

## Environment Variables

To run the project, you must create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=<your_database_url>
BETTER_AUTH_SECRET=<your_better_auth_secret>
BETTER_AUTH_URL=<your_better_auth_url>
```

## Setup & Usage

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma client:

```bash
pnpm db:generate
```

3. Start development server:

```bash
pnpm dev
   ```

## Database

- **Development:** Uses Supabase cloud for remote development (see your `.env` for credentials).
- **Production:** You must use a Docker database with correct credentials (not the same as the current Docker file). Update your `.env` and Docker configuration accordingly.
- **Note:** The Docker database is not used for development right now.

## Additional Notes

- Make sure to use `pnpm` for all commands, not `npm`.
- The project uses modern libraries for authentication, UI, notifications, formatting, linting, and commit management.

---
For any questions, check the documentation of each tool or ask the project maintainers.
