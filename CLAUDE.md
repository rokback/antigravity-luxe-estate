# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server (default http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (config: `eslint.config.mjs`, extends `next/core-web-vitals`)

There is no test runner configured.

## Required environment variables

Set in `.env.local` (template at `.env.template`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — only used by `lib/supabase/admin.ts`; must never be imported from client code

## Stack

Next.js 16 App Router (React 19), TypeScript (strict), Tailwind v4, Supabase (`@supabase/ssr` + `@supabase/supabase-js`), Leaflet via `react-leaflet`. Path alias `@/*` resolves to the repo root.

## Architecture

### Supabase clients — pick the right one

There are three distinct Supabase factories and they are not interchangeable:

- `lib/supabase/client.ts` — `createBrowserClient` for Client Components only.
- `lib/supabase/server.ts` — `createServerClient` wired to Next.js cookies; use in Server Components, Server Actions, and Route Handlers. The cookie `setAll` swallows errors thrown from Server Components on purpose, since the middleware refreshes sessions.
- `lib/supabase/admin.ts` — service-role client (`createAdminClient`). Server-only. Never import this from a Client Component or pass its data to one without filtering.

`middleware.ts` runs `supabase.auth.getUser()` on every matched request to refresh the auth cookies. The comment in the file is load-bearing — removing the call breaks session sync between browser and server. The matcher excludes `_next/static`, `_next/image`, `favicon.ico`, and common image extensions.

OAuth flow: `/login` calls `signInWithOAuth` (Google/GitHub) with `redirectTo: ${origin}/auth/callback`. `app/auth/callback/route.ts` exchanges the code for a session and redirects to a `next` query param (relative paths only — open-redirect guard already in place).

Note: `lib/properties.ts` instantiates its own Supabase client at module scope using the anon key. It is used from Server Components (e.g. `app/page.tsx`, `app/properties/[slug]/page.tsx`) and is therefore subject to RLS. Don't replace it with the admin client without thinking through the security implications.

### Data model

Properties live in a Supabase `properties` table. The `Property` interface in `lib/properties.ts` is the source of truth for the columns the app reads (`slug`, `images`, `amenities`, `is_featured`, `category`, `type: 'sale' | 'rent'`, etc.). `getProperties` paginates server-side at `PAGE_SIZE = 8` and supports filtering by location (ilike), price range, beds/baths (gte), category, type, and amenities (`contains`).

### Routing

- `app/page.tsx` — home; reads search params for filters and renders `Hero`, `FeaturedCollections` (hidden when filters are active), and `PropertyGrid`.
- `app/properties/[slug]/page.tsx` — property detail. Implements `generateMetadata` (OG tags) and `generateStaticParams` (pre-renders the first page of properties). Slugs are stored on the row.
- `app/login/page.tsx` — OAuth login (Client Component).
- `app/auth/callback/route.ts` — OAuth code exchange.
- `app/dashboard/properties`, `app/dashboard/users`, `app/asesoria` — directories exist; check for `page.tsx` before assuming routes.

### i18n

Cookie-driven (`NEXT_LOCALE`), no URL prefix. Default locale is `es`; supported: `es`, `en`, `fr`. Dictionaries in `i18n/dictionaries/*.json`.

Two access patterns, do not mix them in the same component:

- Server Components / Route Handlers: `await getTranslations()` from `@/i18n` returns a `t(key)` function. Used e.g. in `app/properties/[slug]/page.tsx`.
- Client Components: `useLanguage()` from `@/i18n/LanguageContext`. The provider is mounted in `app/layout.tsx` with the dictionary already loaded server-side; `setLocale` writes the cookie and calls `router.refresh()` to re-read it on the server.

Missing keys fall back to returning the key string itself (both implementations) — useful when scanning logs for untranslated strings.

### Styling

Tailwind v4 with theme defined inline in `app/globals.css` via `@theme`. Custom color tokens (`nordic-dark`, `mosque`, `hint-of-green`, `clear-day`, `background-light`, `nordic-muted`, `primary`) and shadows (`shadow-soft`, `shadow-card`) come from there. The brand palette is mandatory per `antigravity/guidelines.md` — don't introduce new accent colors without checking that file.

`next/image` `remotePatterns` are restricted to `lh3.googleusercontent.com`, `images.unsplash.com`, and `avatars.githubusercontent.com` (`next.config.ts`). Add new hosts there before using them.

## Project guidelines (from `antigravity/`)

These are explicit rules from the project owner; honor them when in doubt:

- Default to React Server Components. Only add `"use client"` for actual interactivity.
- Prefer feature-based organization for new code; reusable logic in `/lib`.
- Don't install or configure new libraries without asking first (`antigravity/guidelines.md`).
- Every property must have a unique `/properties/[slug]` URL with dynamic `generateMetadata` for Open Graph; the existing route is the template.
- Supabase RLS is expected on all tables — assume the anon-key client in `lib/properties.ts` is enforcing it.

## Things to watch out for

- `lib/mock-data.ts` and `lib/mock-data.ts.bak` are legacy from before Supabase. Don't reintroduce them as a data source.
- `app/page.tsx` defines `searchParams` as a `Promise` (Next.js 16 behavior) — `await` it.
- `LanguageProvider` in `app/layout.tsx` receives the dictionary as a prop; don't refetch dictionaries client-side.
