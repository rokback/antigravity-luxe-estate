import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'user';

export async function getCurrentUserRole(): Promise<{
  user: User | null;
  role: UserRole | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null };

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  return { user, role: (data?.role as UserRole | undefined) ?? 'user' };
}

export async function requireAdmin(): Promise<User> {
  const { user, role } = await getCurrentUserRole();

  if (!user) {
    redirect('/login?next=/dashboard');
  }
  if (role !== 'admin') {
    redirect('/?error=forbidden');
  }
  return user;
}
