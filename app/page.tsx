import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import PropertyGrid from "@/components/PropertyGrid";
import { getProperties } from "@/lib/properties";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const { properties, totalPages } = await getProperties(page);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        <FeaturedCollections />
        <PropertyGrid
          properties={properties}
          currentPage={page}
          totalPages={totalPages}
        />
      </main>
    </>
  );
}
