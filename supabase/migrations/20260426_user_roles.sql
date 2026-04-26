-- user_roles: binary admin / user role per authenticated account.
-- Apply this in the Supabase SQL Editor.

-- 1. Enum
do $$ begin
  create type public.user_role as enum ('admin', 'user');
exception
  when duplicate_object then null;
end $$;

-- 2. Tabla
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_roles_role_idx on public.user_roles(role);

-- 3. Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
  before update on public.user_roles
  for each row execute function public.set_updated_at();

-- 4. Trigger: cada signup nuevo recibe rol 'user'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: usuarios auth ya existentes sin fila quedan como 'user'
insert into public.user_roles (user_id, role)
select id, 'user' from auth.users
on conflict (user_id) do nothing;

-- 5. is_admin(): security definer evita recursión en políticas RLS
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = uid and role = 'admin'
  );
$$;

-- 6. RLS
alter table public.user_roles enable row level security;

drop policy if exists "user_roles_self_select" on public.user_roles;
create policy "user_roles_self_select"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_roles_admin_select" on public.user_roles;
create policy "user_roles_admin_select"
  on public.user_roles for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- INSERT/UPDATE/DELETE quedan denegados desde anon/authenticated (no hay políticas).
-- Las mutaciones legítimas se hacen vía Server Actions con service-role (bypass RLS).
