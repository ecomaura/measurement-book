-- ============================================================
-- The Measurement Book — Supabase schema
-- Run this once in Supabase: Project -> SQL Editor -> New query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- Clients ----------
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact text,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

-- ---------- Measurements (append-only history) ----------
-- Every save creates a NEW row. Nothing is ever overwritten.
-- "Latest" is simply the row with the greatest measured_on / created_at
-- for a given client + type — computed at query time, not stored.
create table if not exists measurements (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in ('blouse', 'kurta')),
  measured_on date not null default current_date,
  fields jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  is_deleted boolean not null default false
);

create index if not exists idx_measurements_client on measurements(client_id, type, measured_on desc);
create index if not exists idx_clients_name on clients using gin (to_tsvector('simple', name));

-- ---------- Row Level Security ----------
-- Only authenticated staff (logged in via Supabase Auth) can read/write.
-- Add staff accounts under Supabase -> Authentication -> Users.
alter table clients enable row level security;
alter table measurements enable row level security;

create policy "Authenticated staff can read clients"
  on clients for select
  to authenticated
  using (true);

create policy "Authenticated staff can write clients"
  on clients for insert
  to authenticated
  with check (true);

create policy "Authenticated staff can update clients"
  on clients for update
  to authenticated
  using (true);

create policy "Authenticated staff can read measurements"
  on measurements for select
  to authenticated
  using (true);

create policy "Authenticated staff can write measurements"
  on measurements for insert
  to authenticated
  with check (true);

create policy "Authenticated staff can update measurements"
  on measurements for update
  to authenticated
  using (true);

-- Note on "delete": the app performs soft deletes (is_deleted = true) so a
-- mis-tap never destroys history. Hard DELETE is intentionally not granted
-- here — remove rows manually in the Supabase table editor if ever needed.
