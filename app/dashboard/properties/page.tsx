import Image from 'next/image';
import Link from 'next/link';
import { getProperties } from '@/lib/properties';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTranslations } from '@/i18n';
import Pagination from '../Pagination';
import PropertyActiveToggle from './PropertyActiveToggle';

type SearchParams = Promise<{ page?: string; q?: string; type?: string }>;

function formatPrice(value: number) {
  return new Intl.NumberFormat('es', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

async function loadStats() {
  const admin = createAdminClient();
  // Las stats reflejan inventario activo (lo que el público realmente ve).
  const [total, sale, rent] = await Promise.all([
    admin
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    admin
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('type', 'sale'),
    admin
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('type', 'rent'),
  ]);
  return {
    total: total.count ?? 0,
    sale: sale.count ?? 0,
    rent: rent.count ?? 0,
  };
}

export default async function DashboardPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations();
  const { page, q, type } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [{ properties, totalCount, totalPages }, stats] = await Promise.all([
    getProperties(currentPage, {
      location: q,
      type: type === 'sale' || type === 'rent' ? type : undefined,
      includeInactive: true, // el panel admin ve también las desactivadas
    }),
    loadStats(),
  ]);

  const fromIndex = totalCount === 0 ? 0 : (currentPage - 1) * 8 + 1;
  const toIndex = (currentPage - 1) * 8 + properties.length;

  const statCards = [
    {
      label: t('dashboard.properties.stats.total'),
      value: stats.total,
      icon: 'apartment',
      iconWrap: 'bg-mosque/10 text-mosque',
    },
    {
      label: t('dashboard.properties.stats.for_sale'),
      value: stats.sale,
      icon: 'sell',
      iconWrap: 'bg-hint-of-green text-mosque',
    },
    {
      label: t('dashboard.properties.stats.for_rent'),
      value: stats.rent,
      icon: 'vpn_key',
      iconWrap: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic-dark tracking-tight">
            {t('dashboard.properties.title')}
          </h1>
          <p className="text-nordic-muted mt-1">
            {t('dashboard.properties.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={t('dashboard.properties.coming_soon')}
            className="bg-white border border-nordic-dark/15 text-nordic-dark/60 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm inline-flex items-center gap-2 opacity-60 cursor-not-allowed"
          >
            <span className="material-icons text-base">filter_list</span>
            {t('dashboard.properties.filter')}
          </button>
          <Link
            href="/dashboard/properties/new"
            className="bg-mosque hover:bg-mosque/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-mosque/20 inline-flex items-center gap-2 transition-colors"
          >
            <span className="material-icons text-base">add</span>
            {t('dashboard.properties.add_new')}
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statCards.map((c) => (
          <div
            key={c.label}
            className="bg-white p-5 rounded-xl border border-mosque/10 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-nordic-muted">{c.label}</p>
              <p className="text-2xl font-bold text-nordic-dark mt-1">{c.value}</p>
            </div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${c.iconWrap}`}
            >
              <span className="material-icons">{c.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Search row (kept functional) */}
      <form
        method="get"
        className="mb-4 flex flex-col sm:flex-row gap-2 items-stretch"
      >
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder={t('dashboard.properties.search_placeholder')}
          className="w-full sm:w-72 rounded-lg border border-nordic-dark/15 bg-white px-3 py-2 text-sm focus:border-mosque focus:outline-none"
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
          className="rounded-lg bg-mosque text-white px-4 py-2 text-sm font-medium hover:bg-mosque/90 transition-colors"
        >
          {t('dashboard.properties.search')}
        </button>
      </form>

      {/* Property list container */}
      <div className="bg-white rounded-xl shadow-sm border border-nordic-dark/10 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-clear-day/60 border-b border-nordic-dark/5 text-xs font-semibold text-nordic-dark/50 uppercase tracking-wider">
          <div className="col-span-6">{t('dashboard.properties.col.details')}</div>
          <div className="col-span-2">{t('dashboard.properties.col.price')}</div>
          <div className="col-span-2">{t('dashboard.properties.col.status')}</div>
          <div className="col-span-2 text-right">
            {t('dashboard.properties.col.actions')}
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="px-6 py-10 text-center text-nordic-muted">
            {t('dashboard.properties.empty')}
          </div>
        ) : (
          properties.map((p, idx) => {
            const isLast = idx === properties.length - 1;
            const monthly = p.type === 'rent';
            return (
              <div
                key={p.id}
                className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 ${
                  isLast ? '' : 'border-b border-nordic-dark/5'
                } hover:bg-clear-day transition-colors items-center`}
              >
                {/* Details */}
                <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                  <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-nordic-dark/5">
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.image_alt || p.title}
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/properties/${p.slug}`}
                      target="_blank"
                      className="text-lg font-bold text-nordic-dark group-hover:text-mosque transition-colors truncate block"
                    >
                      {p.title}
                    </Link>
                    <p className="text-sm text-nordic-muted truncate">
                      {p.location}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-nordic-dark/50">
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bed</span>
                        {p.beds} {t('dashboard.properties.meta.beds')}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-nordic-dark/20"></span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-[14px]">bathtub</span>
                        {p.baths} {t('dashboard.properties.meta.baths')}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-nordic-dark/20"></span>
                      <span>
                        {p.area} {t('dashboard.properties.meta.sqft')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-6 md:col-span-2">
                  <div className="text-base font-semibold text-nordic-dark">
                    {formatPrice(p.price)}
                  </div>
                  {(p.price_suffix || monthly) && (
                    <div className="text-xs text-nordic-dark/50">
                      {p.price_suffix ?? '/mo'}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-6 md:col-span-2 flex flex-wrap gap-1">
                  {!p.is_active && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 border border-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
                      {t('dashboard.properties.status.inactive')}
                    </span>
                  )}
                  {p.type === 'sale' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-of-green text-mosque border border-mosque/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-mosque mr-1.5"></span>
                      {t('dashboard.properties.status.for_sale')}
                    </span>
                  ) : p.type === 'rent' ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                      {t('dashboard.properties.status.for_rent')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-nordic-dark text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"></span>
                      {t('dashboard.properties.status.sold')}
                    </span>
                  )}
                  {p.is_featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-mosque/10 text-mosque">
                      <span className="material-icons text-[12px] mr-1">
                        star
                      </span>
                      {t('dashboard.properties.status.featured')}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-1">
                  <Link
                    href={`/dashboard/properties/${p.id}/edit`}
                    title={t('dashboard.properties.actions.edit')}
                    className="p-2 rounded-lg text-nordic-dark/60 hover:text-mosque hover:bg-hint-of-green/40 transition-all"
                  >
                    <span className="material-icons text-xl">edit</span>
                  </Link>
                  <PropertyActiveToggle
                    id={p.id}
                    isActive={p.is_active}
                    labels={{
                      deactivate: t('dashboard.properties.actions.deactivate'),
                      reactivate: t('dashboard.properties.actions.reactivate'),
                      confirmDeactivate: t('dashboard.properties.actions.confirm_deactivate'),
                      confirmReactivate: t('dashboard.properties.actions.confirm_reactivate'),
                    }}
                  />
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-nordic-dark/10 flex items-center justify-between bg-clear-day/40 flex-wrap gap-3">
          <div className="text-sm text-nordic-muted">
            {t('dashboard.properties.pagination.showing')
              .replace('{from}', String(fromIndex))
              .replace('{to}', String(toIndex))
              .replace('{total}', String(totalCount))}
          </div>
          <Pagination
            basePath="/dashboard/properties"
            currentPage={currentPage}
            totalPages={totalPages}
            params={{ q, type }}
            prevLabel={t('pagination.prev')}
            nextLabel={t('pagination.next')}
          />
        </div>
      </div>
    </div>
  );
}
