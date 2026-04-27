'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/roles';

export type PropertyInput = {
  id?: string;
  slug?: string;
  title: string;
  location: string;
  price: number;
  price_suffix?: string | null;
  beds: number;
  baths: number;
  parking: number;
  area: number;
  year_built?: number | null;
  type: 'sale' | 'rent' | 'sold';
  category: string | null;
  description: string | null;
  is_featured?: boolean;
  amenities: string[];
  images: string[];
  image_alt?: string;
  latitude: number | null;
  longitude: number | null;
};

export type ActionResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

async function ensureUniqueSlug(
  admin: ReturnType<typeof createAdminClient>,
  base: string,
  excludeId?: string,
): Promise<string> {
  const slug = base || `property-${Date.now()}`;
  for (let i = 0; i < 25; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    let query = admin
      .from('properties')
      .select('id', { head: true, count: 'exact' })
      .eq('slug', candidate);
    if (excludeId) query = query.neq('id', excludeId);
    const { count, error } = await query;
    if (error) throw error;
    if ((count ?? 0) === 0) return candidate;
  }
  return `${slug}-${Date.now()}`;
}

function validate(input: PropertyInput): string | null {
  if (!input.title?.trim()) return 'title_required';
  if (!input.location?.trim()) return 'location_required';
  if (!Number.isFinite(input.price) || input.price < 0) return 'price_invalid';
  if (!['sale', 'rent', 'sold'].includes(input.type)) return 'type_invalid';
  return null;
}

function buildRow(input: PropertyInput) {
  return {
    title: input.title.trim(),
    location: input.location.trim(),
    price: input.price,
    price_suffix: input.price_suffix ?? (input.type === 'rent' ? '/mo' : null),
    beds: input.beds,
    baths: input.baths,
    parking: input.parking,
    area: input.area,
    year_built: input.year_built ?? null,
    type: input.type,
    category: input.category ?? null,
    description: input.description?.trim() || null,
    is_featured: input.is_featured ?? false,
    amenities: input.amenities ?? [],
    images: input.images ?? [],
    image_alt: input.image_alt ?? input.title.trim(),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
  };
}

export async function createProperty(
  input: PropertyInput,
): Promise<ActionResult> {
  await requireAdmin();
  const error = validate(input);
  if (error) return { ok: false, error };

  const admin = createAdminClient();

  try {
    const slug = await ensureUniqueSlug(admin, input.slug || slugify(input.title));
    const row = { ...buildRow(input), slug };
    if (input.id) (row as { id?: string }).id = input.id;

    const { data, error: insErr } = await admin
      .from('properties')
      .insert(row)
      .select('id, slug')
      .single();

    if (insErr) {
      console.error('createProperty insert:', insErr);
      return { ok: false, error: insErr.message };
    }

    revalidatePath('/dashboard/properties');
    revalidatePath('/');
    revalidatePath(`/properties/${data.slug}`);

    return { ok: true, id: data.id, slug: data.slug };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    console.error('createProperty error:', e);
    return { ok: false, error: msg };
  }
}

export async function updateProperty(
  id: string,
  input: PropertyInput,
): Promise<ActionResult> {
  await requireAdmin();
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const admin = createAdminClient();

  try {
    let slug = input.slug?.trim();
    if (!slug) {
      slug = await ensureUniqueSlug(admin, slugify(input.title), id);
    }
    const row = { ...buildRow(input), slug };

    const { data, error: updErr } = await admin
      .from('properties')
      .update(row)
      .eq('id', id)
      .select('id, slug')
      .single();

    if (updErr) {
      console.error('updateProperty error:', updErr);
      return { ok: false, error: updErr.message };
    }

    revalidatePath('/dashboard/properties');
    revalidatePath(`/dashboard/properties/${id}/edit`);
    revalidatePath('/');
    revalidatePath(`/properties/${data.slug}`);

    return { ok: true, id: data.id, slug: data.slug };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    console.error('updateProperty error:', e);
    return { ok: false, error: msg };
  }
}

/**
 * Elimina una imagen del bucket. Recibe la ruta interna del bucket
 * (ej. "properties/<uuid>/<file>.jpg"), no la URL completa.
 */
export async function deletePropertyImage(
  path: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (!path) return { ok: false, error: 'empty_path' };

  const admin = createAdminClient();
  const { error } = await admin.storage.from('property-images').remove([path]);
  if (error) {
    console.error('deletePropertyImage:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
