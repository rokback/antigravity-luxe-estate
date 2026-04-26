'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin, type UserRole } from '@/lib/auth/roles';

export type UpdateRoleResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<UpdateRoleResult> {
  if (role !== 'admin' && role !== 'user') {
    return { ok: false, error: 'invalid_role' };
  }

  const me = await requireAdmin();

  if (me.id === userId && role !== 'admin') {
    return { ok: false, error: 'cannot_demote_self' };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from('user_roles')
    .upsert(
      { user_id: userId, role, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );

  if (error) {
    console.error('updateUserRole error:', error);
    return { ok: false, error: 'db_error' };
  }

  revalidatePath('/dashboard/users');
  revalidatePath('/dashboard');
  return { ok: true };
}
