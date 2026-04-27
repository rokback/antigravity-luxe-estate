-- Fix de seguridad: quitar la policy de SELECT pública sobre storage.objects.
--
-- Por qué: dejar SELECT abierto a `public` permite a cualquier cliente listar
-- todos los archivos del bucket vía la API de Supabase Storage
-- (`supabase.storage.from('property-images').list(...)`).
--
-- Las URLs públicas (`/storage/v1/object/public/property-images/<path>`) NO
-- necesitan esta policy: funcionan porque el bucket tiene `public = true`.
--
-- Ejecutar en Supabase SQL Editor.

drop policy if exists "property_images_public_read" on storage.objects;

-- Verificar (debe devolver 3 filas: insert / update / delete, todas para admin):
-- select policyname, cmd from pg_policies
-- where tablename = 'objects' and policyname like 'property_images_%';
