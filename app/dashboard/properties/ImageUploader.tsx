'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { deletePropertyImage } from './actions';

const BUCKET = 'property-images';

export type GalleryImage = {
  url: string;
  /** Path relativo dentro del bucket (sin el prefijo /storage/v1/...) */
  path: string;
};

type Props = {
  propertyId: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  labels: {
    dropHint: string;
    maxSize: string;
    formats: string;
    main: string;
    addMore: string;
    uploading: string;
    uploadError: string;
  };
};

function fileExt(name: string) {
  const dot = name.lastIndexOf('.');
  if (dot === -1) return 'jpg';
  return name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
}

export default function ImageUploader({
  propertyId,
  images,
  onChange,
  labels,
}: Props) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);

    const accepted: GalleryImage[] = [];
    for (const file of Array.from(files)) {
      try {
        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const path = `properties/${propertyId}/${id}.${fileExt(file.name)}`;

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type || 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });
        if (upErr) {
          console.error('upload error', upErr);
          setError(labels.uploadError);
          continue;
        }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        accepted.push({ url: pub.publicUrl, path });
      } catch (e) {
        console.error('upload threw', e);
        setError(labels.uploadError);
      }
    }

    if (accepted.length) onChange([...images, ...accepted]);
    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function removeImage(idx: number) {
    const img = images[idx];
    if (!img) return;
    const next = images.filter((_, i) => i !== idx);
    onChange(next);
    if (img.path) {
      // No bloquear UI por la respuesta, pero loguear errores
      deletePropertyImage(img.path).catch((e) =>
        console.error('deletePropertyImage threw', e),
      );
    }
  }

  return (
    <div className="space-y-6">
      <div
        className="relative border-2 border-dashed border-nordic-dark/20 rounded-xl bg-clear-day/40 p-10 text-center hover:bg-hint-of-green/30 hover:border-mosque/40 transition-colors group"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={busy}
        />
        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
            <span className="material-icons text-2xl">cloud_upload</span>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-nordic-dark">
              {busy ? labels.uploading : labels.dropHint}
            </p>
            <p className="text-xs text-nordic-dark/40">{labels.maxSize}</p>
            <p className="text-[10px] uppercase tracking-wider text-nordic-dark/40">
              {labels.formats}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.path || img.url}
              className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-clear-day"
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="240px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-nordic-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                  aria-label="remove"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                  {labels.main}
                </span>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="aspect-square rounded-lg border border-dashed border-nordic-dark/20 flex flex-col items-center justify-center text-nordic-dark/40 hover:text-mosque hover:border-mosque hover:bg-hint-of-green/20 transition-all group disabled:opacity-50"
          >
            <span className="material-icons group-hover:scale-110 transition-transform">
              add
            </span>
            <span className="text-xs mt-1 font-medium">{labels.addMore}</span>
          </button>
        </div>
      )}
    </div>
  );
}
