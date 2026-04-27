-- Soft delete para propiedades.
-- Cuando is_active = false, la propiedad NO aparece en el sitio público
-- (filtros, home, página de detalle), pero SÍ sigue visible en el panel
-- administrativo para reactivarla más adelante.

alter table public.properties
  add column if not exists is_active boolean not null default true;

create index if not exists properties_is_active_idx on public.properties(is_active);
