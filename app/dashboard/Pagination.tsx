import Link from 'next/link';

type Props = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  /** Extra params (besides `page`) to preserve in URLs. Falsy values are skipped. */
  params?: Record<string, string | number | undefined | null>;
  prevLabel: string;
  nextLabel: string;
};

/**
 * Numbered pagination with prev/next and ellipsis when there are many pages.
 * Renders with anchor links so it works inside Server Components without
 * client-side state.
 */
export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  params,
  prevLabel,
  nextLabel,
}: Props) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const sp = new URLSearchParams();
    sp.set('page', String(page));
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue;
        sp.set(k, String(v));
      }
    }
    return `${basePath}?${sp.toString()}`;
  }

  const pages = computePageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="inline-flex items-center gap-1 rounded-md"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center px-2 py-2 rounded-md text-sm font-medium text-nordic-dark/60 hover:text-mosque transition-colors"
          aria-label={prevLabel}
        >
          <span className="material-icons text-xl">chevron_left</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center px-2 py-2 rounded-md text-sm text-nordic-dark/30 cursor-not-allowed"
          aria-label={prevLabel}
        >
          <span className="material-icons text-xl">chevron_left</span>
        </span>
      )}

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 py-2 text-sm text-nordic-dark/40 select-none"
          >
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className="bg-mosque text-white relative inline-flex items-center justify-center px-3.5 py-1.5 text-sm font-medium rounded-md min-w-[2rem] shadow-sm"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className="bg-transparent text-nordic-dark/70 hover:bg-white hover:text-mosque relative inline-flex items-center justify-center px-3.5 py-1.5 text-sm font-medium rounded-md min-w-[2rem] transition-colors"
          >
            {p}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center px-2 py-2 rounded-md text-sm font-medium text-nordic-dark/60 hover:text-mosque transition-colors"
          aria-label={nextLabel}
        >
          <span className="material-icons text-xl">chevron_right</span>
        </Link>
      ) : (
        <span
          className="inline-flex items-center px-2 py-2 rounded-md text-sm text-nordic-dark/30 cursor-not-allowed"
          aria-label={nextLabel}
        >
          <span className="material-icons text-xl">chevron_right</span>
        </span>
      )}
    </nav>
  );
}

/**
 * Returns the list of page entries to render: numbers + "…" for gaps.
 * Logic: always show first, last, current ±1, plus ellipsis where it skips ≥2 pages.
 */
function computePageList(
  current: number,
  total: number,
): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (const p of [current - 1, current, current + 1]) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('…');
    }
    result.push(sorted[i]);
  }
  return result;
}
