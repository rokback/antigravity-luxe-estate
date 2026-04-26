import Image from 'next/image';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin, type UserRole } from '@/lib/auth/roles';
import { getTranslations } from '@/i18n';
import { RoleSelector } from './RoleSelector';
import Pagination from '../Pagination';

const PER_PAGE = 20;

type SearchParams = Promise<{
  page?: string;
  role?: 'admin' | 'user';
  q?: string;
}>;

type Row = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  role: UserRole;
};

type StatusKind = 'active' | 'away' | 'inactive' | 'never';

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

function statusOf(lastSignInAt: string | null): StatusKind {
  if (!lastSignInAt) return 'never';
  const now = Date.now();
  const last = new Date(lastSignInAt).getTime();
  const days = (now - last) / (1000 * 60 * 60 * 24);
  if (days < 7) return 'active';
  if (days < 30) return 'away';
  return 'inactive';
}

function formatDate(value: string | null) {
  if (!value) return null;
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
  const { page, role: roleFilter, q } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { rows, total } = await loadUsers(currentPage);

  // In-memory filtering on the loaded page (auth.admin.listUsers has no filter API)
  const query = q?.trim().toLowerCase() ?? '';
  const filteredRows = rows.filter((r) => {
    if (roleFilter && r.role !== roleFilter) return false;
    if (
      query &&
      !r.email.toLowerCase().includes(query) &&
      !(r.fullName ?? '').toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const fromIndex = (currentPage - 1) * PER_PAGE + 1;
  const toIndex = Math.min(fromIndex + filteredRows.length - 1, total);

  const labels = {
    admin: t('dashboard.role.admin'),
    user: t('dashboard.role.user'),
    saving: t('dashboard.users.saving'),
    cannotDemoteSelf: t('dashboard.users.cannot_demote_self'),
    saved: t('dashboard.users.saved'),
    error: t('dashboard.users.error'),
    changeRole: t('dashboard.users.change_role'),
  };

  const tabs: { key: 'all' | 'admins' | 'users'; href: string; active: boolean }[] = [
    { key: 'all', href: '/dashboard/users', active: !roleFilter },
    {
      key: 'admins',
      href: '/dashboard/users?role=admin',
      active: roleFilter === 'admin',
    },
    {
      key: 'users',
      href: '/dashboard/users?role=user',
      active: roleFilter === 'user',
    },
  ];

  const statusIcons: Record<StatusKind, string> = {
    active: 'check_circle',
    away: 'schedule',
    inactive: 'remove_circle_outline',
    never: 'help_outline',
  };
  const statusDotClass: Record<StatusKind, string> = {
    active: 'bg-green-400',
    away: 'bg-yellow-400',
    inactive: 'bg-gray-400',
    never: 'bg-transparent',
  };
  const statusIconClass: Record<StatusKind, string> = {
    active: 'text-mosque',
    away: 'text-yellow-500',
    inactive: 'text-gray-400',
    never: 'text-gray-300',
  };

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
            {t('dashboard.users.title')}
          </h1>
          <p className="text-nordic-muted mt-1 text-sm">
            {t('dashboard.users.directory_subtitle')}
          </p>
        </div>

        <form
          method="get"
          className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
        >
          {/* Preserve role filter when searching */}
          {roleFilter && (
            <input type="hidden" name="role" value={roleFilter} />
          )}
          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-nordic-dark/40 group-focus-within:text-mosque text-xl">
                search
              </span>
            </div>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder={t('dashboard.users.search_placeholder')}
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic-dark shadow-soft placeholder:text-nordic-dark/30 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-sm outline-none"
            />
          </div>
          <button
            type="button"
            disabled
            title={t('dashboard.properties.coming_soon')}
            aria-disabled="true"
            className="bg-mosque text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-mosque/20 inline-flex items-center gap-2 opacity-60 cursor-not-allowed whitespace-nowrap"
          >
            <span className="material-icons text-base">add</span>
            {t('dashboard.users.add_user')}
          </button>
        </form>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-nordic-dark/10 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
              tab.active
                ? 'text-mosque border-b-2 border-mosque font-semibold'
                : 'text-nordic-dark/60 hover:text-nordic-dark'
            }`}
          >
            {t(`dashboard.users.tabs.${tab.key}`)}
          </Link>
        ))}
      </div>

      {/* Column header (desktop only) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50 mb-2">
        <div className="col-span-4">{t('dashboard.users.col.user_details')}</div>
        <div className="col-span-3">{t('dashboard.users.col.role_status')}</div>
        <div className="col-span-3">{t('dashboard.users.col.performance')}</div>
        <div className="col-span-2 text-right">
          {t('dashboard.users.col.actions')}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredRows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft border border-nordic-dark/5 px-6 py-10 text-center text-nordic-muted">
            {t('dashboard.users.empty')}
          </div>
        ) : (
          filteredRows.map((row) => {
            const isMe = row.id === me.id;
            const status = statusOf(row.lastSignInAt);
            const cardClass = isMe
              ? 'bg-hint-of-green border-transparent'
              : 'bg-white border-gray-100 hover:bg-hint-of-green/40';

            return (
              <div
                key={row.id}
                className={`group relative rounded-xl p-5 shadow-sm border flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-colors ${cardClass}`}
              >
                {/* User Details */}
                <div className="col-span-12 md:col-span-4 flex items-center w-full">
                  <div className="relative flex-shrink-0">
                    {row.avatarUrl ? (
                      <Image
                        src={row.avatarUrl}
                        alt={row.fullName ?? row.email}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-mosque/10 text-mosque font-semibold flex items-center justify-center border-2 border-white">
                        {row.email.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    {status !== 'never' && (
                      <span
                        className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusDotClass[status]}`}
                      />
                    )}
                  </div>
                  <div className="ml-4 overflow-hidden min-w-0">
                    <div className="text-sm font-bold text-nordic-dark truncate">
                      {row.fullName ?? row.email}
                      {isMe && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-mosque font-semibold">
                          {t('dashboard.users.you')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-nordic-dark/70 truncate">
                      {row.email}
                    </div>
                    <div
                      className={`mt-1 text-[10px] px-2 py-0.5 inline-block rounded text-nordic-dark/60 ${
                        isMe ? 'bg-white/50' : 'bg-gray-50'
                      }`}
                    >
                      {t('dashboard.users.id_prefix')}
                      {row.id.slice(0, 4).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                  {row.role === 'admin' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-nordic-dark text-white">
                      {labels.admin}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {labels.user}
                    </span>
                  )}
                  <div className="flex items-center text-xs text-nordic-dark/60">
                    <span
                      className={`material-icons text-[14px] mr-1 ${statusIconClass[status]}`}
                    >
                      {statusIcons[status]}
                    </span>
                    {t(`dashboard.users.status.${status}`)}
                  </div>
                </div>

                {/* Performance / Metrics */}
                <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic-dark/40">
                      {t('dashboard.users.metrics.created')}
                    </div>
                    <div className="text-sm font-semibold text-nordic-dark">
                      {formatDate(row.createdAt) ?? '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic-dark/40">
                      {t('dashboard.users.metrics.last_login')}
                    </div>
                    <div className="text-sm font-semibold text-nordic-dark">
                      {formatDate(row.lastSignInAt) ??
                        t('dashboard.users.status.never')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                  <RoleSelector
                    userId={row.id}
                    initialRole={row.role}
                    isSelf={isMe}
                    highlight={isMe}
                    labels={labels}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <nav className="mt-8 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-nordic-dark/60">
          {t('dashboard.users.pagination.showing')
            .replace('{from}', String(fromIndex))
            .replace('{to}', String(toIndex))
            .replace('{total}', String(total))}
        </p>
        <Pagination
          basePath="/dashboard/users"
          currentPage={currentPage}
          totalPages={totalPages}
          params={{ role: roleFilter, q }}
          prevLabel={t('pagination.prev')}
          nextLabel={t('pagination.next')}
        />
      </nav>
    </div>
  );
}
