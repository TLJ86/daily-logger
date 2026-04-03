# Daily Logger

A simple daily check-in web app built with:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)

## Features

- Email + password auth with Supabase
- Protected dashboard for signed-in users
- One daily check-in per date
- Save entries to Supabase `check_ins` table
- View previous check-ins under the form
- Edit/delete check-ins
- Basic trend charts (weight, mood, energy)

## 1) Environment Variables

Create `/.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## 2) Supabase Setup

### Enable email + password auth

In Supabase Dashboard:

- Go to `Authentication` -> `Providers` -> `Email`
- Enable email sign-ins
- For easiest setup, disable "Confirm email" while building locally (optional)

### Create table

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in_date date not null,
  weight numeric not null,
  training_done boolean not null default false,
  protein_hit boolean not null default false,
  creatine_hit boolean not null default false,
  steps integer not null default 0,
  mood integer not null check (mood between 1 and 10),
  energy integer not null check (energy between 1 and 10),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, check_in_date)
);

alter table public.check_ins enable row level security;

create policy "Users can read own check-ins"
on public.check_ins for select
using (auth.uid() = user_id);

create policy "Users can insert own check-ins"
on public.check_ins for insert
with check (auth.uid() = user_id);

create policy "Users can update own check-ins"
on public.check_ins for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own check-ins"
on public.check_ins for delete
using (auth.uid() = user_id);
```

## 3) Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
