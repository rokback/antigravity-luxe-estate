import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin, type UserRole } from '@/lib/auth/roles';
import { getTranslations } from '@/i18n';
import { RoleSelector } from './RoleSelector';

const PER_PAGE = 20;

type SearchParams = Promise<{ page?: string }>;

type Row = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  role: UserRole;
};

async function loadUsers(page: number): Promise<{ rows: Row[]; total: number }> {
  const admin = createAdminClient();

  const [{ data: usersData, error: usersErr }, { data: rolesData }] =
    await Promise.all([
      admin.auth.admin.listUsers({ page, perPage: PER_PAGE }),
      admin.from('user_roles').select('user_id, role'),
    ]);

  if (usersErr) {
    console.error('listUsers error:', usersErr);
    return { rows: [], total: 0 };
  }

  const roleMap = new Map<string, UserRole>(
    (rolesData ?? []).map((r: { user_id: string; role: UserRole }) => [
      r.user_id,
      r.role,
    ]),
  );

  const rows: Row[] = (usersData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? '—',
    fullName:
      (u.user_metadata?.full_name as string | undefined) ??
      (u.user_metadata?.name as string | undefined) ??
      null,
    avatarUrl:
      (u.user_metadata?.avatar_url as string | undefined) ??
      (u.user_metadata?.picture as string | undefined) ??
      null,
    createdAt: u.created_at,
    lastSignInAt: u.last_sign_in_at ?? null,
    role: roleMap.get(u.id) ?? 'user',
  }));

  return { rows, total: usersData?.total ?? rows.length };
}

function formatDate(value: string | null) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function DashboardUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const me = await requireAdmin();
  const t = await getTranslations();
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { rows, total } = await loadUsers(currentPage);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const labels = {
    admin: t('dashboard.role.admin'),
    user: t('dashboard.role.user'),
    saving: t('dashboard.users.saving'),
    cannotDemoteSelf: t('dashboard.users.cannot_demote_self'),
    saved: t('dashboard.users.saved'),
    error: t('dashboard.users.error'),
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.users.title')}
        </h1>
        <p className="text-nordic-muted mt-1">
          {t('dashboard.users.subtitle').replace('{count}', String(total))}
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-soft border border-nordic-dark/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-clear-day text-left text-xs uppercase tracking-wider text-nordic-muted">
            <tr>
              <th className="px-4 py-3">{t('dashboard.users.col.user')}</th>
              <th className="px-4 py-3">{t('dashboard.users.col.created')}</th>
              <th className="px-4 py-3">{t('dashboard.users.col.last_login')}</th>
              <th className="px-4 py-3">{t('dashboard.users.col.role')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nordic-dark/5">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-nordic-muted">
                  {t('dashboard.users.empty')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-clear-day/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.avatarUrl ? (
                        <Image
                          src={row.avatarUrl}
                          alt={row.fullName ?? row.email}
                          width={36}
                          height={36}
                          className="rounded-full object-cover w-9 h-9"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-mosque/10 text-mosque font-semibold flex items-center justify-center">
                          {row.email.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {row.fullName ?? row.email}
                          {row.id === me.id && (
                            <span className="ml-2 text-[11px] uppercase tracking-wider text-mosque">
                              {t('dashboard.users.you')}
                            </span>
                          )}
                        </p>
                        {row.fullName && (
                          <p className="text-xs text-nordic-muted">{row.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-nordic-muted">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-nordic-muted">
                    {formatDate(row.lastSignInAt)}
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelector
                      userId={row.id}
                      initialRole={row.role}
                      isSelf={row.id === me.id}
                      labels={labels}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between">
          <p className="text-sm text-nordic-muted">
            {t('dashboard.properties.page_of')
              .replace('{current}', String(currentPage))
              .replace('{total}', String(totalPages))}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/dashboard/users?page=${currentPage - 1}`}
                className="rounded-lg border border-nordic-dark/15 bg-white px-3 py-2 text-sm font-medium hover:border-mosque hover:text-mosque transition-colors"
              >
                {t('pagination.prev')}
              </Link>
            ) : (
              <span className="rounded-lg border border-nordic-dark/10 px-3 py-2 text-sm text-nordic-muted">
                {t('pagination.prev')}
              </span>
            )}
            {currentPage < totalPages ? (
              <Link
                href={`/dashboard/users?page=${currentPage + 1}`}
                className="rounded-lg border border-nordic-dark/15 bg-white px-3 py-2 text-sm font-medium hover:border-mosque hover:text-mosque transition-colors"
              >
                {t('pagination.next')}
              </Link>
            ) : (
              <span className="rounded-lg border border-nordic-dark/10 px-3 py-2 text-sm text-nordic-muted">
                {t('pagination.next')}
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
