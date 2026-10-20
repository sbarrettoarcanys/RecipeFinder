-- Per-user meal comments and ratings, keyed by Firebase UID like favorites
-- (see 20261006000000_firebase_auth_user_ids.sql).

begin;

create table public.meal_comments (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt() ->> 'sub')
    references public.profiles (id) on delete cascade,
  meal_id text not null,
  comment text not null,
  created_at timestamptz default now()
);

create table public.meal_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt() ->> 'sub')
    references public.profiles (id) on delete cascade,
  meal_id text not null,
  rating int not null check (rating between 1 and 5),
  unique (user_id, meal_id)
);

-- Row Level Security: a user can only see and change their own rows.
alter table public.meal_comments enable row level security;
alter table public.meal_ratings enable row level security;

create policy "Own meal comments" on public.meal_comments
  for all to anon, authenticated
  using (user_id = (select auth.jwt() ->> 'sub'))
  with check (user_id = (select auth.jwt() ->> 'sub'));

create policy "Own meal ratings" on public.meal_ratings
  for all to anon, authenticated
  using (user_id = (select auth.jwt() ->> 'sub'))
  with check (user_id = (select auth.jwt() ->> 'sub'));

commit;
