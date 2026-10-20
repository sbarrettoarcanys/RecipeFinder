-- Link Supabase tables to Firebase Auth instead of Supabase Auth.
--
-- Firebase UIDs are 28-char strings (not uuids) and Firebase users never exist
-- in auth.users, so:
--   * profiles.id and every user_id column become text holding the Firebase UID
--   * foreign keys to auth.users are replaced by foreign keys to profiles.id
--   * RLS identifies the caller via the Firebase ID token's `sub` claim
--
-- Prerequisite: Supabase Dashboard -> Authentication -> Third-party Auth ->
-- add Firebase with your Firebase project ID.

begin;

-- 1. Drop foreign keys pointing at auth.users (constraint names are generated,
--    so look them up instead of hard-coding them).
do $$
declare
  r record;
begin
  for r in
    select c.conrelid::regclass as tbl, c.conname
    from pg_constraint c
    where c.contype = 'f'
      and c.confrelid = 'auth.users'::regclass
      and c.conrelid in (
        'public.profiles'::regclass,
        'public.meal_plans'::regclass,
        'public.pantry_items'::regclass,
        'public.favorites'::regclass
      )
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;

-- 2. uuid -> text for the Firebase UID columns, defaulting to the caller's UID.
alter table public.profiles
  alter column id drop default,
  alter column id type text using id::text,
  alter column id set default (auth.jwt() ->> 'sub');

alter table public.meal_plans
  alter column user_id type text using user_id::text,
  alter column user_id set default (auth.jwt() ->> 'sub'),
  alter column user_id set not null;

alter table public.pantry_items
  alter column user_id type text using user_id::text,
  alter column user_id set default (auth.jwt() ->> 'sub'),
  alter column user_id set not null;

alter table public.favorites
  alter column user_id type text using user_id::text,
  alter column user_id set default (auth.jwt() ->> 'sub'),
  alter column user_id set not null;

-- 3. Every user-owned row hangs off the user's profile.
alter table public.meal_plans
  add constraint meal_plans_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.pantry_items
  add constraint pantry_items_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

alter table public.favorites
  add constraint favorites_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

-- 4. Row Level Security: a user can only see and change their own rows.
--    Policies cover both roles: Firebase tokens without a `role: "authenticated"`
--    custom claim are treated as `anon`. Requests with no Firebase token have
--    no `sub`, so they never match.
alter table public.profiles enable row level security;
alter table public.meal_plans enable row level security;
alter table public.pantry_items enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "Own profile: select" on public.profiles;
drop policy if exists "Own profile: insert" on public.profiles;
drop policy if exists "Own profile: update" on public.profiles;

create policy "Own profile: select" on public.profiles
  for select to anon, authenticated
  using (id = (select auth.jwt() ->> 'sub'));

create policy "Own profile: insert" on public.profiles
  for insert to anon, authenticated
  with check (id = (select auth.jwt() ->> 'sub'));

create policy "Own profile: update" on public.profiles
  for update to anon, authenticated
  using (id = (select auth.jwt() ->> 'sub'))
  with check (id = (select auth.jwt() ->> 'sub'));

drop policy if exists "Own meal plans" on public.meal_plans;
create policy "Own meal plans" on public.meal_plans
  for all to anon, authenticated
  using (user_id = (select auth.jwt() ->> 'sub'))
  with check (user_id = (select auth.jwt() ->> 'sub'));

drop policy if exists "Own pantry items" on public.pantry_items;
create policy "Own pantry items" on public.pantry_items
  for all to anon, authenticated
  using (user_id = (select auth.jwt() ->> 'sub'))
  with check (user_id = (select auth.jwt() ->> 'sub'));

drop policy if exists "Own favorites" on public.favorites;
create policy "Own favorites" on public.favorites
  for all to anon, authenticated
  using (user_id = (select auth.jwt() ->> 'sub'))
  with check (user_id = (select auth.jwt() ->> 'sub'));

commit;
