# Supabase Recovery Plan

## Execution Status

- Current state: `In progress`
- Active step: `Step 2 (create new Supabase project)`
- Blocker: `Need your manual creation of a new Supabase project and credentials`

## 1. Inventory + backup validation

- Status: `Need your help` (you provide backup file/details), then I execute verification.
- Confirm backup type: plain SQL (`.sql`) or custom dump (`.dump`/`.backup`).
- Identify what it contains: schema only vs schema + data + auth/storage objects.
- Snapshot current project config (`.env`, Prisma migrations) before touching anything.
- Progress notes:
  - Located Prisma migrations in repo.
  - Backup located: `db_cluster-18-08-2025@16-58-29.backup`.
  - Backup format validated as plain SQL text (despite `.backup` suffix).
  - Backup includes `public`, `auth`, and `storage` schemas, plus data (`COPY` blocks), and role/permission statements.
  - Local `psql`/`pg_restore` clients are not installed in this environment.

## 2. Create a new Supabase project

- Status: `Need your help` (manual action in Supabase dashboard).
- Create a fresh project in Supabase (same region if possible).
- Record new connection details and API keys:
  - Postgres connection string (for `DATABASE_URL`)
  - Supabase project URL
  - anon/public key
  - service role key (server-only if needed)

## 3. Restore database from backup

- Status: `I can do this` (after you provide backup file path and new DB credentials).
- If plain SQL: restore with `psql`.
- If custom dump: restore with `pg_restore`.
- Validate restore success: required tables exist (`Issue`, `User`, `Account`, `Session`, `Project`, `Tag`, `Dialog`, etc.) and row counts look sane.

## 4. Reconcile Prisma migration state

- Status: `I can do this`.
- Compare restored schema with `prisma/schema.prisma` + `prisma/migrations`.
- If backup already includes latest schema:
  - mark migrations as applied (`prisma migrate resolve`) to avoid reapplying.
- If schema is behind:
  - run pending migrations safely (`prisma migrate deploy`).

## 5. Reconnect app configuration

- Status: `Shared` (I edit project env files; you supply new secrets/keys).
- Update env values in this project:
  - `DATABASE_URL` -> new Supabase Postgres URL
  - Supabase URL/key vars used by the app code (currently `NEXT_PUBLIC_SERVICE_ID` and `NEXT_PUBLIC_PUBLIC_KEY`; re-verify exact usage before editing).
- Keep secrets server-only where applicable (no service-role key in `NEXT_PUBLIC_*`).

## 6. App-level verification

- Status: `Shared` (I run technical checks; you validate business/login flow in browser if needed).
- Run Prisma checks (`prisma generate`, `prisma db pull` sanity check).
- Start app and test critical flows:
  - auth/login
  - issue CRUD
  - any pages querying Supabase directly
- Fix runtime/config mismatches found during verification.

## 7. Hardening + rollback safety

- Status: `Shared` (you rotate credentials in Supabase dashboard; I update references/docs in repo).
- Rotate old credentials and remove dead project references.
- Save a fresh backup from the new project.
- Document final env/key mapping and restore command used.

## Inputs needed before execution

1. Backup file path and format (`.sql` or `.dump`).
2. Whether backup includes Auth/Storage-related objects or only app tables.
3. Confirmation of restore path: Supabase dashboard import flow or local CLI (`psql`/`pg_restore`).

## Pause Points (where I will stop and ask you)

1. After backup analysis, if restore strategy is ambiguous.
2. Before restore, to confirm new Supabase project and credentials are ready.
3. After env changes, to confirm you want key rotation in Supabase dashboard.

## Immediate Next Input Needed

1. Create a new Supabase project in the dashboard.
2. Share the new project `DATABASE_URL` (or DB host/user/password/dbname/port).
3. Share the new project URL and anon key for app reconnection.
