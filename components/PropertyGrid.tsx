import { Property } from '@/lib/properties';
import PropertyCard from './PropertyCard';
import Pagination from './Pagination';

interface PropertyGridProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
}

export default function PropertyGrid({ properties, currentPage, totalPages }: PropertyGridProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
          <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">All</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">Buy</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark transition-colors">Rent</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={{
              id: property.id,
              title: property.title,
              location: property.location,
              price: property.price,
              priceSuffix: property.price_suffix ?? undefined,
              beds: property.beds,
              baths: property.baths,
              area: property.area,
              imageUrl: property.image_url,
              imageAlt: property.image_alt,
              badge: property.badge ?? undefined,
              type: property.type,
            }}
          />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
