const products = [
  {
    name: 'Playful Moments Hoodie',
    price: 48,
    oldPrice: null,
    badge: 'New',
    image: '/mens/b59edaea-c914-4331-b193-e05cd31c8c92.jpg',
  },
]

export function MenPage2({ onNavigate }) {
  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300">Menswear</p>
            <h2 className="text-3xl font-semibold">Men&apos;s Drop — Page 2</h2>
            <p className="max-w-2xl text-neutral-200">
              Bonus looks and fresh drops curated for the Menswear page. Tap back to explore more pieces in the main edit.
            </p>
          </div>
          <button
            type="button"
            className="self-start rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => onNavigate?.('product')}
          >
            Shop featured piece
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Men&apos;s Collection</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="group space-y-3 rounded-xl border border-neutral-200 bg-white/80 p-3 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold uppercase text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[11px] font-semibold uppercase text-white">
                    Sale
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-3 text-xs uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
                  <span>Just in</span>
                  <span className="animate-pulse text-amber-300">New Drop</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div className="font-medium text-neutral-900">{product.name}</div>
                  <div className="flex items-center gap-2">
                    {product.oldPrice && <span className="text-xs text-neutral-400 line-through">${product.oldPrice}</span>}
                    <span className="font-semibold text-neutral-900">${product.price}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-neutral-900 px-4 py-2 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                  onClick={() => onNavigate?.('product')}
                >
                  View
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:text-neutral-900"
          onClick={() => onNavigate?.('men')}
        >
          ← Previous page
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:text-neutral-900"
            onClick={() => onNavigate?.('men')}
          >
            1
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => onNavigate?.('men2')}
          >
            2
          </button>
        </div>
      </div>
    </section>
  )
}
