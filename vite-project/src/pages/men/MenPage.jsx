import { useProducts } from '../../hooks/useProducts.js'

const products = [
  {
    name: 'Monochrome Studio Tee',
    price: 420,
    oldPrice: null,
    badge: 'Feature',
    image: '/mens/479121be-4991-438c-b132-b166b283d86d.jpg',
  },
  {
    name: 'Primal Rose Tee',
    price: 460,
    oldPrice: 500,
    badge: 'Sale',
    image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg',
  },
  {
    name: 'Roots of Loyalty Tee',
    price: 380,
    oldPrice: 430,
    badge: '20% Off',
    image: '/mens/10f84550-41c3-414a-98f1-fbe6a01a866c.jpg',
  },
  {
    name: 'Demon Slayer: Kyojuro Sweater',
    price: 480,
    oldPrice: null,
    badge: 'New',
    image: '/mens/1de3e249-45bb-40cd-a756-d29d25a5cb88.jpg',
  },
  {
    name: 'Demon Slayer: Zenitsu Tee',
    price: 390,
    oldPrice: null,
    badge: 'New',
    image: '/mens/41dfbb67-36e0-45e3-8c1c-743d8256238e.jpg',
  },
  {
    name: 'Tanjiro + Nezuko Hoodie',
    price: 500,
    oldPrice: null,
    badge: 'New',
    image: '/mens/4d53bc77-16bb-4e92-8205-4d8e8ddb08e5.jpg',
  },
  {
    name: 'Tengen Uzui Tee',
    price: 370,
    oldPrice: null,
    badge: 'New',
    image: '/mens/50aa801b-bae8-4e0c-93a9-550baf3defdc.jpg',
  },
  {
    name: 'Slate Jeans',
    price: 360,
    oldPrice: null,
    badge: '',
    image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg',
  },
  {
    name: 'Crescent Cargo Pants',
    price: 420,
    oldPrice: null,
    badge: '',
    image: '/mens/a4ff4db1-c2e2-4455-a76d-606c187cf54f.jpg',
  },
]

export function MenPage({ onNavigate }) {
  const { products: apiProducts } = useProducts()
  const filtered = apiProducts.filter((p) => (p.tag || '').toLowerCase() === 'men')
  const items =
    filtered.length >= 6
      ? filtered
      : [...filtered, ...products].reduce((acc, item) => {
          if (!acc.find((p) => p.name === item.name)) acc.push(item)
          return acc
        }, [])
  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300">Menswear</p>
            <h2 className="text-3xl font-semibold">Men&apos;s Drop</h2>
            <p className="max-w-2xl text-neutral-200">
              Everyday comfort, graphic staples, and statement outerwear—curated for the season. Explore the latest
              essentials designed to move from city days to weekend getaways.
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
          {items.map((product) => (
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
                    {product.oldPrice && <span className="text-xs text-neutral-400 line-through">₱{product.oldPrice}</span>}
                    <span className="font-semibold text-neutral-900">₱{product.price}</span>
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

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => onNavigate?.('men')}
        >
          1
        </button>
        <button
          type="button"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:text-neutral-900"
          onClick={() => onNavigate?.('men2')}
        >
          2
        </button>
        <button
          type="button"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:text-neutral-900"
          onClick={() => onNavigate?.('men2')}
        >
          Next →
        </button>
      </div>
    </section>
  )
}
