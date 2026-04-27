-- Extiende la tabla properties para soportar el formulario de creación/edición.
-- Ejecutar en Supabase SQL Editor.

-- 1. Columnas nuevas
alter table public.properties
  add column if not exists description   text,
  add column if not exists year_built    integer,
  add column if not exists parking       integer not null default 0,
  add column if not exists latitude      double precision,
  add column if not exists longitude     double precision;

-- 2. Permitir status 'sold' (además de sale/rent)
alter table public.properties
  drop constraint if exists properties_type_check;

alter table public.properties
  add constraint properties_type_check
  check (type in ('sale','rent','sold'));

-- 3. Asegurar updated_at
alter table public.properties
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- 4. RLS: solo admins pueden mutar (lectura sigue como esté)
alter table public.properties enable row level security;

drop policy if exists "properties_admin_write" on public.properties;
create policy "properties_admin_write"
  on public.properties
  for all
  to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Lectura pública: si aún no existe, abrir SELECT a anon/authenticated
drop policy if exists "properties_public_read" on public.properties;
create policy "properties_public_read"
  on public.properties
  for select
  to anon, authenticated
  using (true);
