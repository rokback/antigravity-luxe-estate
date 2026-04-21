import { Property } from '@/lib/properties';
import PropertyCard from './PropertyCard';
import Pagination from './Pagination';
import { getTranslations } from '@/i18n';

interface PropertyGridProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
}

export default async function PropertyGrid({ properties, currentPage, totalPages }: PropertyGridProps) {
  const t = await getTranslations();
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">{t('grid.title')}</h2>
          <p className="text-nordic-muted mt-1 text-sm">{t('grid.subtitle')}</p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">{t('grid.all')}</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">{t('grid.buy')}</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">{t('grid.rent')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
