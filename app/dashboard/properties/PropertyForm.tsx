'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import type { Property } from '@/lib/properties';
import {
  createProperty,
  updateProperty,
  type PropertyInput,
} from './actions';
import CounterInput from './CounterInput';
import ImageUploader, { type GalleryImage } from './ImageUploader';
import LocationPicker from './LocationPicker';

const STORAGE_HOST_PATH = '/storage/v1/object/public/property-images/';
const DESCRIPTION_MAX = 2000;

const AMENITIES_LIST = [
  'Swimming Pool',
  'Garden',
  'Air Conditioning',
  'Smart Home System',
  'Gym',
  'Parking',
  'High-speed Wifi',
  'Wine Cellar',
];

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Commercial'];

type Mode = 'create' | 'edit';

type FormLabels = {
  breadcrumbRoot: string;
  modeLabel: string;
  title: string;
  subtitle: string;
  save: string;
  saving: string;
  cancel: string;
  requiredHint: string;
  sections: {
    basic: string;
    description: string;
    gallery: string;
    location: string;
    details: string;
  };
  fields: {
    title: string;
    price: string;
    status: string;
    type: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    area: string;
    yearBuilt: string;
    beds: string;
    baths: string;
    parking: string;
    amenities: string;
  };
  status: { sale: string; rent: string; sold: string };
  types: Record<string, string>;
  amenityLabels: Record<string, string>;
  charsLabel: string;
  gallery: {
    dropHint: string;
    maxSize: string;
    formats: string;
    main: string;
    addMore: string;
    uploading: string;
    uploadError: string;
  };
  map: { hint: string };
  errors: { saveFailed: string };
};

type Props = {
  mode: Mode;
  initial?: Property;
  labels: FormLabels;
};

type FormState = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  type: 'sale' | 'rent' | 'sold';
  category: string;
  description: string;
  area: string;
  year_built: string;
  beds: number;
  baths: number;
  parking: number;
  amenities: string[];
  images: GalleryImage[];
  latitude: number | null;
  longitude: number | null;
  is_featured: boolean;
};

function urlToPath(url: string): string {
  const idx = url.indexOf(STORAGE_HOST_PATH);
  if (idx === -1) return '';
  return url.slice(idx + STORAGE_HOST_PATH.length);
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function PropertyForm({ mode, initial, labels }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const initialState = useMemo<FormState>(() => {
    if (initial) {
      return {
        id: initial.id,
        slug: initial.slug,
        title: initial.title,
        location: initial.location,
        price: String(initial.price ?? ''),
        type: initial.type,
        category: initial.category ?? '',
        description: initial.description ?? '',
        area: String(initial.area ?? ''),
        year_built: initial.year_built ? String(initial.year_built) : '',
        beds: initial.beds ?? 0,
        baths: initial.baths ?? 0,
        parking: initial.parking ?? 0,
        amenities: initial.amenities ?? [],
        images: (initial.images ?? []).map((url) => ({
          url,
          path: urlToPath(url),
        })),
        latitude: initial.latitude,
        longitude: initial.longitude,
        is_featured: initial.is_featured ?? false,
      };
    }
    return {
      id: newId(),
      slug: '',
      title: '',
      location: '',
      price: '',
      type: 'sale',
      category: PROPERTY_TYPES[0],
      description: '',
      area: '',
      year_built: '',
      beds: 0,
      baths: 0,
      parking: 0,
      amenities: [],
      images: [],
      latitude: null,
      longitude: null,
      is_featured: false,
    };
  }, [initial]);

  const [state, setState] = useState<FormState>(initialState);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function toggleAmenity(name: string) {
    setState((s) => ({
      ...s,
      amenities: s.amenities.includes(name)
        ? s.amenities.filter((a) => a !== name)
        : [...s.amenities, name],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const input: PropertyInput = {
      id: mode === 'create' ? state.id : initial?.id,
      slug: state.slug || undefined,
      title: state.title,
      location: state.location,
      price: Number(state.price) || 0,
      type: state.type,
      category: state.category || null,
      description: state.description || null,
      area: Number(state.area) || 0,
      year_built: state.year_built ? Number(state.year_built) : null,
      beds: state.beds,
      baths: state.baths,
      parking: state.parking,
      amenities: state.amenities,
      images: state.images.map((img) => img.url),
      image_alt: state.title,
      is_featured: state.is_featured,
      latitude: state.latitude,
      longitude: state.longitude,
    };

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createProperty(input)
          : await updateProperty(initial!.id, input);

      if (!result.ok) {
        setFormError(result.error || labels.errors.saveFailed);
        return;
      }
      router.push('/dashboard/properties');
      router.refresh();
    });
  }

  const charCount = state.description.length;

  return (
    <form onSubmit={handleSubmit} className="pb-32 md:pb-0">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-nordic-dark/10 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-nordic-dark/60 font-medium">
              <li>
                <Link
                  href="/dashboard/properties"
                  className="hover:text-mosque transition-colors"
                >
                  {labels.breadcrumbRoot}
                </Link>
              </li>
              <li>
                <span className="material-icons text-xs text-nordic-dark/40">
                  chevron_right
                </span>
              </li>
              <li aria-current="page" className="text-nordic-dark">
                {labels.modeLabel}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic-dark tracking-tight mb-2">
              {labels.title}
            </h1>
            <p className="text-base text-nordic-dark/60 max-w-2xl">
              {labels.subtitle} {labels.requiredHint}
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          <Link
            href="/dashboard/properties"
            className="px-5 py-2.5 rounded-lg border border-nordic-dark/15 bg-white text-nordic-dark hover:bg-clear-day transition-colors font-medium text-sm"
          >
            {labels.cancel}
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-icons text-sm">save</span>
            {pending ? labels.saving : labels.save}
          </button>
        </div>
      </header>

      {formError && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left column */}
        <div className="xl:col-span-8 space-y-8">
          {/* Basic Information */}
          <SectionCard
            icon="info"
            title={labels.sections.basic}
            tone="primary"
          >
            <div className="space-y-6 p-8">
              <div>
                <Label required htmlFor="title">
                  {labels.fields.title}
                </Label>
                <input
                  id="title"
                  type="text"
                  required
                  value={state.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Modern Penthouse with Ocean View"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label required htmlFor="price">
                    {labels.fields.price}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nordic-dark/40 text-sm">
                      $
                    </span>
                    <input
                      id="price"
                      type="number"
                      min={0}
                      step={1}
                      required
                      value={state.price}
                      onChange={(e) => update('price', e.target.value)}
                      placeholder="0"
                      className={`${inputClass} pl-7`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">{labels.fields.status}</Label>
                  <select
                    id="status"
                    value={state.type}
                    onChange={(e) =>
                      update('type', e.target.value as FormState['type'])
                    }
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="sale">{labels.status.sale}</option>
                    <option value="rent">{labels.status.rent}</option>
                    <option value="sold">{labels.status.sold}</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="type">{labels.fields.type}</Label>
                  <select
                    id="type"
                    value={state.category}
                    onChange={(e) => update('category', e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {labels.types[t] ?? t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-nordic-dark cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={state.is_featured}
                  onChange={(e) => update('is_featured', e.target.checked)}
                  className="w-4 h-4 text-mosque border-nordic-dark/20 rounded focus:ring-mosque"
                />
                <span>Featured</span>
              </label>
            </div>
          </SectionCard>

          {/* Description */}
          <SectionCard icon="description" title={labels.sections.description}>
            <div className="p-8">
              <div className="mb-3 flex gap-2 border-b border-nordic-dark/5 pb-2">
                <ToolbarBtn icon="format_bold" />
                <ToolbarBtn icon="format_italic" />
                <ToolbarBtn icon="format_list_bulleted" />
              </div>
              <textarea
                id="description"
                value={state.description}
                onChange={(e) =>
                  update(
                    'description',
                    e.target.value.slice(0, DESCRIPTION_MAX),
                  )
                }
                placeholder="Describe the property features, neighborhood, and unique selling points..."
                className={`${inputClass} leading-relaxed resize-y min-h-[200px]`}
              />
              <div className="mt-2 text-right text-xs text-nordic-dark/40">
                {charCount} / {DESCRIPTION_MAX} {labels.charsLabel}
              </div>
            </div>
          </SectionCard>

          {/* Gallery */}
          <SectionCard
            icon="image"
            title={labels.sections.gallery}
            extra={
              <span className="text-xs font-medium text-nordic-dark/60 bg-clear-day px-2 py-1 rounded">
                {labels.gallery.formats}
              </span>
            }
          >
            <div className="p-8">
              <ImageUploader
                propertyId={state.id}
                images={state.images}
                onChange={(images) => update('images', images)}
                labels={labels.gallery}
              />
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="xl:col-span-4 space-y-8">
          {/* Location */}
          <SectionCard icon="place" title={labels.sections.location} compact>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="address">{labels.fields.address}</Label>
                <input
                  id="address"
                  type="text"
                  value={state.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="Street Address, City, Zip"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="latitude" muted>
                    {labels.fields.latitude}
                  </Label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    min={-90}
                    max={90}
                    value={state.latitude ?? ''}
                    onChange={(e) =>
                      update(
                        'latitude',
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    }
                    placeholder="40.41680"
                    className={subtleInputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" muted>
                    {labels.fields.longitude}
                  </Label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    min={-180}
                    max={180}
                    value={state.longitude ?? ''}
                    onChange={(e) =>
                      update(
                        'longitude',
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    }
                    placeholder="-3.70380"
                    className={subtleInputClass}
                  />
                </div>
              </div>
              <LocationPicker
                latitude={state.latitude}
                longitude={state.longitude}
                onChange={(lat, lng) => {
                  update('latitude', lat);
                  update('longitude', lng);
                }}
                hintLabel={labels.map.hint}
              />
            </div>
          </SectionCard>

          {/* Details */}
          <SectionCard
            icon="straighten"
            title={labels.sections.details}
            compact
            sticky
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area" muted>
                    {labels.fields.area}
                  </Label>
                  <input
                    id="area"
                    type="number"
                    min={0}
                    value={state.area}
                    onChange={(e) => update('area', e.target.value)}
                    placeholder="0"
                    className={subtleInputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="year" muted>
                    {labels.fields.yearBuilt}
                  </Label>
                  <input
                    id="year"
                    type="number"
                    min={1700}
                    max={2100}
                    value={state.year_built}
                    onChange={(e) => update('year_built', e.target.value)}
                    placeholder="YYYY"
                    className={subtleInputClass}
                  />
                </div>
              </div>

              <hr className="border-nordic-dark/5" />

              <div className="space-y-4">
                <CounterInput
                  label={labels.fields.beds}
                  icon="bed"
                  value={state.beds}
                  onChange={(v) => update('beds', v)}
                />
                <CounterInput
                  label={labels.fields.baths}
                  icon="shower"
                  value={state.baths}
                  onChange={(v) => update('baths', v)}
                />
                <CounterInput
                  label={labels.fields.parking}
                  icon="directions_car"
                  value={state.parking}
                  onChange={(v) => update('parking', v)}
                />
              </div>

              <hr className="border-nordic-dark/5" />

              <div>
                <h3 className="text-xs uppercase tracking-wider text-nordic-dark/50 font-bold mb-3">
                  {labels.fields.amenities}
                </h3>
                <div className="space-y-2">
                  {AMENITIES_LIST.map((name) => {
                    const checked = state.amenities.includes(name);
                    return (
                      <label
                        key={name}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAmenity(name)}
                          className="w-4 h-4 text-mosque border-nordic-dark/20 rounded focus:ring-mosque"
                        />
                        <span className="text-sm text-nordic-dark/80 group-hover:text-nordic-dark transition-colors">
                          {labels.amenityLabels[name] ?? name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-nordic-dark/10 shadow-xl md:hidden z-40 flex gap-3">
        <Link
          href="/dashboard/properties"
          className="flex-1 py-3 rounded-lg border border-nordic-dark/15 bg-white text-nordic-dark font-medium text-center"
        >
          {labels.cancel}
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium flex justify-center items-center gap-2 disabled:opacity-60"
        >
          <span className="material-icons text-base">save</span>
          {pending ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full text-base px-4 py-2.5 rounded-md border border-nordic-dark/15 bg-white text-nordic-dark placeholder:text-nordic-dark/40 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all outline-none';

const subtleInputClass =
  'w-full text-left px-3 py-2 rounded border border-nordic-dark/15 bg-clear-day text-nordic-dark focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm outline-none';

function Label({
  children,
  htmlFor,
  required,
  muted,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  muted?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block ${muted ? 'text-xs text-nordic-dark/60 mb-1' : 'text-sm font-medium text-nordic-dark mb-1.5'}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function ToolbarBtn({ icon }: { icon: string }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="p-1.5 text-nordic-dark/40 hover:text-nordic-dark hover:bg-clear-day rounded transition-colors cursor-not-allowed"
      title="Coming soon"
    >
      <span className="material-icons text-lg">{icon}</span>
    </button>
  );
}

function SectionCard({
  icon,
  title,
  extra,
  children,
  compact,
  sticky,
}: {
  icon: string;
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
  sticky?: boolean;
  tone?: 'primary';
}) {
  return (
    <section
      className={`bg-white rounded-xl shadow-sm border border-nordic-dark/5 overflow-hidden ${
        sticky ? 'xl:sticky xl:top-24' : ''
      }`}
    >
      <header
        className={`flex items-center justify-between gap-3 bg-gradient-to-r from-hint-of-green/30 to-transparent border-b border-hint-of-green/40 ${
          compact ? 'px-6 py-4' : 'px-8 py-6'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-hint-of-green flex items-center justify-center text-nordic-dark">
            <span className="material-icons text-lg">{icon}</span>
          </div>
          <h2
            className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-nordic-dark`}
          >
            {title}
          </h2>
        </div>
        {extra}
      </header>
      {children}
    </section>
  );
}
