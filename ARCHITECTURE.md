# Architecture

## Entities

### todos
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, defaultRandom() |
| title | text | not null |
| completed | boolean | not null, default false |
| created_at | timestamptz | not null, defaultNow() |
| updated_at | timestamptz | not null, defaultNow() |

## Routes

| Path | Type | Purpose |
|------|------|---------|
| `/` | Page | Main todo list (ssr: false, preloads todoCollection) |
| `/api/todos` | API | Electric shape proxy — forwards sync requests to Electric |
| `/api/mutations/todos` | API | CRUD mutations — POST, PATCH, DELETE |

## Key Files

| File | Purpose |
|------|---------|
| `src/db/schema.ts` | Drizzle table definitions |
| `src/db/zod-schemas.ts` | Zod schemas derived from Drizzle tables |
| `src/db/collections/todos.ts` | Electric-backed TanStack DB collection |
| `src/routes/index.tsx` | Main UI with live query and mutations |
| `src/routes/api/todos.ts` | Electric shape proxy route |
| `src/routes/api/mutations/todos.ts` | Server-side mutation handlers |

## Data Flow

```
User action
  → todoCollection.insert/update/delete (optimistic update)
  → onInsert/onUpdate/onDelete handler
    → POST/PATCH/DELETE /api/mutations/todos
      → Drizzle tx with generateTxId()
      → returns { txid }
  → Electric streams txid back via shape
  → TanStack DB resolves optimistic state
```
