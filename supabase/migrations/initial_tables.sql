-- profiles (1:1 with auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- pantry_items (per user)
create table pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  ingredient text not null,        -- e.g. "chicken_breast"
  quantity int default 1,
  added_at timestamptz default now()
);

-- meal_plans (per user, per date)
create table meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  meal_id text not null,           -- TheMealDB id
  planned_for date not null,
  status text default 'planned',   -- planned | cooked | skipped
  created_at timestamptz default now()
);

-- favorites (server-backed now, not just localStorage)
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  meal_id text not null,
  unique (user_id, meal_id)
);
