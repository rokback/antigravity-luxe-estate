import Image from 'next/image';
import Link from 'next/link';
import { getProperties } from '@/lib/properties';
import { getTranslations } from '@/i18n';

type SearchParams = Promise<{ page?: string; q?: string; type?: string }>;

function formatPrice(value: number) {
  return new Intl.NumberFormat('es', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations();
  const { page, q, type } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { properties, totalCount, totalPages } = await getProperties(currentPage, {
    location: q,
    type: type === 'sale' || type === 'rent' ? type : undefined,
  });

  return (
    <div>
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.properties.title')}
          </h1>
          <p className="text-nordic-muted mt-1">
            {t('dashboard.properties.subtitle').replace(
              '{count}',
              String(totalCount),
            )}
          </p>
        </div>

        <form className="flex gap-2" method="get">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder={t('dashboard.properties.search_placeholder')}
            className="w-full sm:w-64 rounded-lg border border-nordic-dark/15 bg-white px-3 py-2 text-sm focus:border-mosque focus:outline-none"
          />
          <select
            name="type"
            defaultValue={type ?? ''}
            className="rounded-lg border border-nordic-dark/15 bg-white px-3 py-2 text-sm focus:border-mosque focus:outline-none"
          >
            <option value="">{t('dashboard.properties.type_any')}</option>
            <option value="sale">{t('dashboard.properties.type_sale')}</option>
            <option value="rent">{t('dashboard.properties.type_rent')}</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-mosque text-white px-4 py-2 text-sm font-medium hover:bg-nordic-dark transition-colors"
          >
            {t('dashboard.properties.search')}
          </button>
        </form>
      </header>

      <div className="bg-white rounded-2xl shadow-soft border border-nordic-dark/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-clear-day text-left text-xs uppercase tracking-wider text-nordic-muted">
            <tr>
              <th className="px-4 py-3">{t('dashboard.properties.col.image')}</th>
              <th className="px-4 py-3">{t('dashboard.properties.col.title')}</th>
              <th className="px-4 py-3">{t('dashboard.properties.col.location')}</th>
              <th className="px-4 py-3">{t('dashboard.properties.col.price')}</th>
              <th className="px-4 py-3">{t('dashboard.properties.col.type')}</th>
              <th className="px-4 py-3">{t('dashboard.properties.col.featured')}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nordic-dark/5">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-nordic-muted">
                  {t('dashboard.properties.empty')}
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr key={p.id} className="hover:bg-clear-day/40">
                  <td className="px-4 py-3">
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.image_alt || p.title}
                        width={56}
                        height={42}
                        className="rounded-md object-cover w-14 h-10"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded-md bg-clear-day" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-nordic-muted">{p.location}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(p.price)}
                    {p.price_suffix && (
                      <span className="text-xs text-nordic-muted ml-1">
                        {p.price_suffix}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">{p.type}</td>
                  <td className="px-4 py-3">
                    {p.is_featured ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-mosque">
                        <span className="material-icons text-base">star</span>
                        {t('dashboard.properties.yes')}
                      </span>
                    ) : (
                      <span className="text-xs text-nordic-muted">
                        {t('dashboard.properties.no')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/properties/${p.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-mosque hover:underline"
                    >
                      {t('dashboard.properties.view')}
                    </Link>
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
            <PaginationLink
              page={currentPage - 1}
              disabled={currentPage <= 1}
              q={q}
              type={type}
              label={t('pagination.prev')}
            />
            <PaginationLink
              page={currentPage + 1}
              disabled={currentPage >= totalPages}
              q={q}
              type={type}
              label={t('pagination.next')}
            />
          </div>
        </nav>
      )}
    </div>
  );
}

function PaginationLink({
  page,
  disabled,
  q,
  type,
  label,
}: {
  page: number;
  disabled: boolean;
  q?: string;
  type?: string;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-nordic-dark/10 px-3 py-2 text-sm text-nordic-muted">
        {label}
      </span>
    );
  }
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (q) params.set('q', q);
  if (type) params.set('type', type);
  return (
    <Link
      href={`/dashboard/properties?${params.toString()}`}
      className="rounded-lg border border-nordic-dark/15 bg-white px-3 py-2 text-sm font-medium hover:border-mosque hover:text-mosque transition-colors"
    >
      {label}
    </Link>
  );
}
