# Envyron

Manage environment variable templates across projects and generate ready-to-use code snippets.

👉 [Try it live](https://envyron.vercel.app/)

⚠️ **Not a secrets manager.** Don’t put production secrets here. Use Infisical, Doppler, or Vault for managing sensitive values. Envyron is for speed and convenience when starting projects.

---

## Why?

Every time you start a new project, you end up digging through old repos or `.env.example` files just to remember what variables you need for a service.

Envyron solves that by letting you define reusable service templates (e.g. Postgres, Stripe, Auth0) and quickly generate `.env` files plus code snippets in your language of choice.

Create once. Reuse everywhere.

---

## Features

- Define services with their environment variables
- Reuse those services across multiple projects
- Generate `.env` files instantly
- Generate code snippets for TypeScript, Go, and Python
- Mark variables as required or optional (validation helpers)

---

## Quick Start

1. Open [envyron.vercel.app](https://envyron.vercel.app/)
2. Create a service template (e.g. Postgres, Stripe)
3. Add it to a project
4. Copy your `.env` file and generated code snippet

---

## Demo

[Watch the Loom video](https://www.loom.com/share/5a07ffaa8939474d95e0ec1a120905fe?sid=cbc095ae-7421-4569-8513-5e65f4af499d)

---

## Use Cases

- **New projects** – stop guessing variable names
- **Sharing with others** – pass along consistent `.env` templates
- **Remembering service vars** – know what Postgres, Stripe, etc. actually need
- **Code generation** – get boilerplate config for your language

---

## Tech Stack

- **Frontend**: Next.js, React, Tailwind
- **Backend**: Next.js API Routes
- **Database**: Drizzle ORM + PostgreSQL
- **Deployment**: Vercel
- **UI**: Shadcn/ui

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/blackmamoth/envyron.git
cd envyron

# Install dependencies
bun install

# Copy example env
cp .env.example .env.local

# Spin local docker server
bun db:dev:up

# Run migrations
bun db:migrate

# Start dev server
bun run dev
```
