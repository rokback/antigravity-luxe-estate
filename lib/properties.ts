import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  price_suffix: string | null;
  beds: number;
  baths: number;
  area: number;
  images: string[];
  image_alt: string;
  badge: string | null;
  type: 'sale' | 'rent' | 'sold';
  is_featured: boolean;
  category: string | null;
  amenities: string[];
  description: string | null;
  year_built: number | null;
  parking: number;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  beds?: number;
  baths?: number;
  amenities?: string[];
  type?: 'sale' | 'rent';
  /**
   * Por defecto solo se devuelven propiedades activas (is_active = true).
   * Pasar `true` desde el panel administrativo para ver también las desactivadas.
   */
  includeInactive?: boolean;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found / inactive
    console.error('Error fetching property by slug:', error);
    return null;
  }

  return data as Property;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching property by id:', error);
    return null;
  }

  return data as Property;
}

const PAGE_SIZE = 8;

export async function getProperties(page: number = 1, filters: PropertyFilters = {}) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' });

  // Apply filters
  // `location` ahora busca en título OR ubicación (un solo input para el usuario).
  // Sanea caracteres que rompen la sintaxis de .or() (la coma es separador).
  if (filters.location) {
    const term = filters.location.replace(/[%,()]/g, ' ').trim();
    if (term) {
      const pattern = `%${term}%`;
      query = query.or(`title.ilike.${pattern},location.ilike.${pattern}`);
    }
  }
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (filters.beds) {
    query = query.gte('beds', filters.beds);
  }
  if (filters.baths) {
    query = query.gte('baths', filters.baths);
  }
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains('amenities', filters.amenities);
  }
  if (!filters.includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
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
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(2); // Limit to 2 for the homescreen

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return (data as Property[]) ?? [];
}
