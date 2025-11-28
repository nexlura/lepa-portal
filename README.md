# Lepa

A modern school management portal built with Next.js 15, React 19, Tailwind CSS 4, and NextAuth. It provides admissions management, student records, detail views with breadcrumbs, CSV import, search/sort/filter/pagination, and document previews.

## Prerequisites

- Node.js 18+ (recommend 20+)
- yarn

## Clone the repository

```bash
git clone https://github.com/nexlura/lepa-portal.git
cd lepa-portal
```

## Install dependencies

Choose one package manager and stick to it for the project.

```bash
# with yarn (yarn.lock present)
yarn install
```

## Environment variables

Create a `.env.local` at the project root with the following variables:

```bash
# NextAuth (required)
NEXTAUTH_URL=http://localhost:3000
# You can generate this using the command below
NEXTAUTH_SECRET=replace-with-generated-secret
# Needed for running the app in production
AUTH_TRUST_HOST=http://localhost:3000
# Needed for sending tenant domain to the backend in dev mode
NEXT_PUBLIC_LEPA_HOST_HEADER=schoola.lepa.cc
# Backend api url
NEXT_PUBLIC_API_URL=https://api.dev.lepa.cc
```

## Generate a NextAuth secret

Use one of the following to generate a secure `NEXTAUTH_SECRET`:

```bash
# OpenSSL (recommended)
openssl rand -base64 32

# or Node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and set `NEXTAUTH_SECRET` in `.env.local`.

## Development

```bash
# run dev server with Turbopack (configured in package.json)
yarn dev
```

Then open `http://localhost:3000`.

## Production build

```bash
# build
yarn build
# start production server
yarn start
```

## Linting

```bash
yarn lint
```

## Project structure (high-level)

- `src/app/dashboard/students/page.tsx`: Students list with CSV import, search, filters, sort, pagination, and row navigation.
- `src/app/dashboard/students/[id]/page.tsx`: Student details page with breadcrumbs and document list.
- `src/components/Students/StudentDetails/TopCards.tsx`: Header cards for a student (profile + academic details).
- `src/components/Students/StudentDetails/DocumentsList.tsx`: Documents list with preview and download.

## Deployment notes

- Ensure `.env` values for production (e.g., `NEXTAUTH_URL` to your domain and a strong `NEXTAUTH_SECRET`).
- If using a DB or OAuth providers, configure corresponding env vars in your hosting platform (Vercel, etc.).
