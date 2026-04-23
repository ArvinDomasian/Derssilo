# Dressilo

Dressilo is a Next.js + Neon + Prisma clothing store MVP with Clerk auth, mock card checkout, Cash on Delivery, and messaging.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in Neon and Clerk credentials.
3. Install dependencies: `npm install`
4. Generate Prisma client: `npm run prisma:generate`
5. Run migrations: `npm run prisma:migrate`
6. Seed sample data: `npm run prisma:seed`
7. Start app: `npm run dev`

## Required Accounts

- GitHub
- Neon
- Clerk
- Vercel (optional for deploy)

## Core Routes

- `/` shop catalog + category filter
- `/checkout` cart summary + COD / mock card actions
- `/messages` user-to-user messaging
- `/sign-in` and `/sign-up` Clerk auth screens
