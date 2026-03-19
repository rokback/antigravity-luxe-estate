# Best Practices — Luxe Estate

---

## Arquitectura & Rendimiento
- App Router con React Server Components (RSC)
- Organizar por feature: `/features/properties/`, `/features/agents/`
- Lógica reutilizable en `/lib`
- `next/image` con WebP/AVIF y lazy loading en todas las fotos
- SSG para listados estáticos, ISR para datos semi-dinámicos
- Paginación server-side
- `next/font` para tipografías sin layout shift
- `next/dynamic` para componentes pesados (mapas, tours)
- Minimizar `"use client"` — solo donde haya interactividad real

---

## Páginas Dinámicas & Compartir en Redes
- **`/properties/[slug]/page.tsx`** obligatorio para que cada propiedad tenga su URL única
- Slugs descriptivos y SEO-friendly: `/properties/glass-pavilion-miami-beach`
- `generateMetadata()` dinámico en cada `[slug]/page.tsx` para Open Graph:
  - `og:title` → nombre de la propiedad
  - `og:description` → descripción corta
  - `og:image` → imagen principal de la propiedad (1200x630px ideal)
  - `og:url` → URL canónica
  - `twitter:card` → `summary_large_image`
- `generateStaticParams()` para pre-renderizar las rutas de propiedades
- Vista previa atractiva al compartir en WhatsApp, Instagram, Facebook, Twitter/X

---

## Diseño & UX Premium
- Minimalista, limpio, mucho whitespace
- Paleta sofisticada: neutros + color acentuado elegante
- Tipografía premium (Inter, Outfit, Playfair Display)
- Micro-animaciones: hover en tarjetas, transiciones suaves, parallax sutil
- Smooth scroll (Lenis) + animaciones de entrada (Framer Motion / GSAP)
- Hero con imagen/video fullscreen de alta calidad
- Glassmorphism sutil en overlays
- Skeleton loaders en vez de spinners

---

## Búsqueda & Filtrado
- Filtros por: ubicación, precio, tipo, habitaciones, baños, amenidades
- Autocompletado / sugerencias instantáneas
- Búsqueda por mapa interactivo (Mapbox / Google Maps)
- Filtros responsive y animados en mobile
- Guardar búsquedas recientes

---

## Página de Propiedad (Detail)
- Galería con lightbox, swipe y zoom
- Tour virtual 360° (Matterport / Kuula)
- Video drone / cinematográfico
- Amenidades con iconos claros
- Mapa interactivo con puntos de interés cercanos
- Floor plans interactivos
- Calculadora de hipoteca
- CTA sticky: WhatsApp, llamar, formulario
- Info del vecindario: walkability, escuelas, restaurantes

---

## Auth & Perfiles
- Supabase Auth / Clerk / Auth.js
- Login con Google, Apple, email
- Propiedades favoritas sincronizadas
- Alertas: notificar nuevas propiedades según criterios
- Historial de vistas y búsquedas

---

## Mobile-First
- Diseño mobile-first obligatorio
- Bottom navigation en mobile (inicio, buscar, favoritos, perfil)
- Botones thumb-friendly
- Click-to-call y click-to-WhatsApp
- Formularios simplificados (mínimos campos)

---

## SEO
- URL única por propiedad con slug descriptivo
- Schema markup JSON-LD tipo `RealEstateListing`
- Meta tags dinámicos por propiedad (Open Graph + Twitter Cards)
- Sitemap XML auto-generado
- Un solo `<h1>` por página
- Alt text en todas las imágenes
- URLs canónicas

---

## Seguridad
- RLS en Supabase en todas las tablas
- Validación client + server
- Rate limiting en API routes
- Sanitización de inputs (XSS / SQL injection)

---

## Ideas Diferenciadores
- Comparar propiedades side-by-side
- Blog de lifestyle / inversiones / mercado
- Testimonios con diseño premium
- Newsletter con lead magnet
- Citas online con calendario integrado
- Multi-idioma (`next-intl`)
- Multi-moneda (USD, EUR, local)
- Supabase Realtime para cambios de precio / vendido
- Portal para agentes con dashboard privado
- AI: recomendaciones, chatbot, búsqueda por voz
