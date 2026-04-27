-- Bucket público de Supabase Storage para imágenes de propiedades.
-- Ejecutar en Supabase SQL Editor (después de 20260427_property_form_extensions.sql,
-- ya que las policies dependen de public.is_admin).

-- 1. Crear bucket (lectura pública)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- 2. RLS sobre storage.objects para este bucket
--
-- Nota de seguridad: NO creamos una policy SELECT para `public`/`anon`.
-- Las URLs `/storage/v1/object/public/<bucket>/<path>` funcionan gracias al flag
-- `public = true` del bucket (sirven los archivos sin RLS). Una policy SELECT
-- abierta permitiría a cualquiera LISTAR los archivos vía la API
-- (`supabase.storage.from(...).list()`), lo cual no necesitamos y filtra
-- metadatos. Por eso solo declaramos las policies de escritura.

-- 2a. Solo admin puede subir
drop policy if exists "property_images_public_read" on storage.objects;
drop policy if exists "property_images_admin_insert" on storage.objects;
create policy "property_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and public.is_admin(auth.uid())
  );

-- 2b. Solo admin puede actualizar
drop policy if exists "property_images_admin_update" on storage.objects;
create policy "property_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'property-images' and public.is_admin(auth.uid()));

-- 2c. Solo admin puede eliminar
drop policy if exists "property_images_admin_delete" on storage.objects;
create policy "property_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'property-images' and public.is_admin(auth.uid()));
