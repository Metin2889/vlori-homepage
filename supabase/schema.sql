-- vlori – Datenbankschema für Supabase (Postgres)
-- Im Supabase-Dashboard unter "SQL Editor" einmal komplett ausführen.
-- Zugriff erfolgt ausschließlich serverseitig über den Service-Role-Key (Vercel-API-Routen);
-- RLS ist aktiv und ohne öffentliche Policies, d. h. der anon-Key kann nichts lesen oder schreiben.

create table if not exists public.job_alerts (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    modules text[] not null,
    remote boolean not null default false,
    source text not null default 'homepage',
    consent_at timestamptz not null,
    confirm_token uuid not null unique,
    confirmed_at timestamptz,
    created_at timestamptz not null default now()
);

create table if not exists public.match_items (
    id uuid primary key default gen_random_uuid(),
    kind text not null check (kind in ('projekt', 'berater')),
    title text not null,
    sub text not null default '',
    modules text[] not null default '{}',
    rate integer not null check (rate > 0),
    remote integer not null default 0 check (remote between 0 and 100),
    city text not null default '',
    industry text not null default '',
    years integer not null default 0,
    lead boolean not null default false,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
create index if not exists match_items_kind_active on public.match_items (kind, active, created_at desc);

create table if not exists public.rate_stats (
    code text primary key,
    name text not null,
    median integer not null,
    p25 integer not null,
    p75 integer not null,
    remote integer not null check (remote between 0 and 100),
    open integer not null default 0,
    demand integer[] not null check (cardinality(demand) > 1),
    updated_at timestamptz not null default now()
);

alter table public.job_alerts enable row level security;
alter table public.match_items enable row level security;
alter table public.rate_stats enable row level security;
