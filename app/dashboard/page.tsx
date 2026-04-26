import { createAdminClient } from '@/lib/supabase/admin';
import { getTranslations } from '@/i18n';

async function getCounts() {
  const admin = createAdminClient();

  const [propertiesRes, rolesRes, usersRes] = await Promise.all([
    admin.from('properties').select('*', { count: 'exact', head: true }),
    admin.from('user_roles').select('role'),
    admin.auth.admin.listUsers({ page: 1, perPage: 1 }),
  ]);

  const properties = propertiesRes.count ?? 0;
  const roles = rolesRes.data ?? [];
  const admins = roles.filter((r) => r.role === 'admin').length;
  const users = usersRes.data?.total ?? roles.length;

  return { properties, users, admins };
}

export default async function DashboardHomePage() {
  const t = await getTranslations();
  const { properties, users, admins } = await getCounts();

  const cards = [
    {
      label: t('dashboard.home.total_properties'),
      value: properties,
      icon: 'home_work',
    },
    {
      label: t('dashboard.home.total_users'),
      value: users,
      icon: 'group',
    },
    {
      label: t('dashboard.home.total_admins'),
      value: admins,
      icon: 'shield_person',
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.home.title')}
        </h1>
        <p className="text-nordic-muted mt-1">{t('dashboard.home.subtitle')}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl shadow-soft border border-nordic-dark/5 p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-nordic-muted">{c.label}</span>
              <span className="material-icons text-mosque">{c.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
