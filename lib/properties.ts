import { supabase } from '@/lib/supabase/server';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  price_suffix: string | null;
  beds: number;
  baths: number;
  area: number;
  image_url: string;
  image_alt: string;
  badge: string | null;
  type: 'sale' | 'rent';
  is_featured: boolean;
}

const PAGE_SIZE = 8;

export async function getProperties(page: number = 1) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], totalCount: 0, totalPages: 0 };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return { properties: (data as Property[]) ?? [], totalCount, totalPages };
}

export async function getFeaturedProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: true })
    .limit(4); // Limit to 4 for the homescreen

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return (data as Property[]) ?? [];
}
