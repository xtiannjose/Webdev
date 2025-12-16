import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts.js'
import { setJSONLD } from '../../lib/seo.js'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
]

export function SearchPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const initialQuery = params.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [tag, setTag] = useState('all')
  const { products, loading, error } = useProducts()

  useEffect(() => {
    const next = new URLSearchParams(location.search)
    if (query) next.set('q', query)
    else next.delete('q')
    if (tag !== 'all') next.set('tag', tag)
    else next.delete('tag')
    navigate({ search: next.toString() }, { replace: true })
  }, [query, tag, navigate, location.search])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => (tag === 'all' ? true : (p.tag || '').toLowerCase() === tag))
      .filter((p) => (!q ? true : p.name.toLowerCase().includes(q)))
  }, [products, query, tag])

  useEffect(() => {
    setJSONLD('ld-search', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })
  }, [])

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Search</p>
        <h1 className="text-3xl font-semibold">Find your next piece</h1>
        <p className="text-sm text-neutral-700">Search by name or filter by tag. Powered by live product data.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          placeholder="Search tees, hoodies, dresses…"
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-800 shadow-inner focus:border-neutral-900 focus:outline-none md:max-w-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                tag === f.value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-800 hover:border-neutral-400'
              }`}
              onClick={() => setTag(f.value)}
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-wide text-neutral-600 underline-offset-4 transition hover:text-neutral-900"
            onClick={() => {
              setQuery('')
              setTag('all')
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-64 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Failed to load products. Please refresh or try again later.
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-4 text-sm text-neutral-700">
          No products found. Try another search term or reset filters.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {results.map((item) => (
            <article
              key={item.id || item.name}
              className="group space-y-3 rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm transition hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[11px] uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
                  {item.tag || 'Featured'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-semibold text-neutral-900">{item.name}</div>
                  <div className="font-semibold text-neutral-800">₱{item.price}</div>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-neutral-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
                  onClick={() => navigate(`/product/${item.id || ''}`)}
                >
                  View
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
