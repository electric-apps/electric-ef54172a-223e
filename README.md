# Todo App

A local-first, real-time todo application built with Electric SQL + TanStack DB. Create, complete, and delete todos — changes sync instantly across all open tabs and devices.

## Screenshot

![Todo App](screenshot.png)

## Features

- **Real-time sync** — todos update instantly across all open tabs via Electric SQL
- **Optimistic mutations** — UI responds immediately, confirmed in the background
- **Create todos** — add new tasks with a keyboard-friendly dialog
- **Complete todos** — toggle completion with a checkbox; completed items get a strikethrough
- **Delete todos** — remove tasks with a confirmation dialog
- **Progress badge** — see completed/total count at a glance

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Sync | [Electric SQL](https://electric-sql.com) — Postgres-to-client real-time sync |
| Reactive DB | [TanStack DB](https://tanstack.com/db) — live queries and optimistic mutations |
| Schema/ORM | [Drizzle ORM](https://orm.drizzle.team) + drizzle-zod |
| Framework | [TanStack Start](https://tanstack.com/start) — React SSR meta-framework |
| UI | [Radix UI Themes](https://www.radix-ui.com/themes) + [Lucide React](https://lucide.dev) |

## Getting Started

```bash
pnpm install
pnpm drizzle-kit generate && pnpm drizzle-kit migrate
pnpm dev:start
```

Open [http://localhost:8080](http://localhost:8080).
