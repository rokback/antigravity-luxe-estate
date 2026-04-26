-- Bootstrap: promueve a admin la primera (y única) cuenta autenticada.
--
-- Cómo usarlo:
-- 1) Aplica primero la migración 20260426_user_roles.sql.
-- 2) Inicia sesión en LuxeEstate UNA vez con la cuenta que quieras como admin
--    (GitHub, Google, o la que sea). El trigger on_auth_user_created creará
--    su fila en user_roles con rol 'user'.
-- 3) Ejecuta este script. Promueve al usuario más reciente de auth.users.

update public.user_roles
set role = 'admin', updated_at = now()
where user_id = (
  select id from auth.users
  order by created_at desc
  limit 1
);

-- Verificar:
-- select u.email, ur.role
-- from public.user_roles ur
-- join auth.users u on u.id = ur.user_id
-- where ur.role = 'admin';
