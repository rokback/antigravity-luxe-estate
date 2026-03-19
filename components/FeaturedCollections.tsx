import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedProperties } from '@/lib/properties';

export default async function FeaturedCollections() {
  const featuredProperties = await getFeaturedProperties();

  if (!featuredProperties || featuredProperties.length === 0) {
    return null; // Don't render if no featured properties
  }

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">Featured Collections</h2>
          <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
        </div>
        <Link href="#" className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity">
          View all <span className="material-icons text-sm">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredProperties.map((property) => (
          <Link key={property.id} href={`/properties/${property.slug}`}>
            <div className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer h-full border border-nordic-dark/5">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <Image 
                  src={property.images[0]} 
                  alt={property.image_alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {property.badge && (
                  <div className="absolute top-4 left-4 bg-mosque text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider z-10 shadow-sm">
                    {property.badge}
                  </div>
                )}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all z-10 shadow-sm">
                  <span className="material-icons text-xl">favorite_border</span>
                </button>
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-0"></div>
              </div>

              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">{property.title}</h3>
                    <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
                      <span className="material-icons text-sm">place</span> {property.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-semibold text-mosque">${property.price.toLocaleString()}</span>
                    {property.price_suffix && (
                      <span className="text-xs text-nordic-muted uppercase">{property.price_suffix}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
                  <div className="flex items-center gap-2 text-nordic-muted text-sm">
                    <span className="material-icons text-lg text-mosque/70">king_bed</span> {property.beds} Beds
                  </div>
                  <div className="flex items-center gap-2 text-nordic-muted text-sm">
                    <span className="material-icons text-lg text-mosque/70">bathtub</span> {property.baths} Baths
                  </div>
                  <div className="flex items-center gap-2 text-nordic-muted text-sm">
                    <span className="material-icons text-lg text-mosque/70">square_foot</span> {property.area.toLocaleString()} m²
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
