import { useProducts } from '../../hooks/useProducts.js'

const looks = [
  {
    title: 'Breeze Summer Dress',
    price: 480,
    image: '/womens/b5e6ce57-02a1-4538-b182-aa4b8f266899.jpg',
  },
  {
    title: 'Coastal Linen Set',
    price: 500,
    image: '/womens/821bb0c1-e722-45d5-b9d1-9fc0e9df2037.jpg',
  },
  {
    title: 'Sunrise Knit Top',
    price: 380,
    image: '/womens/9d0027dc-65c2-4e56-9ea7-d5447352e608.jpg',
  },
  {
    title: 'Seaside Pastel Hoodie',
    price: 420,
    image: '/womens/32882a40-22e9-4651-b9af-d958363b4649.jpg',
  },
  {
    title: 'Garden Stroll Hoodie',
    price: 450,
    image: '/womens/ca0c54f7-8129-41cf-a9fb-fbf109ace73b.jpg',
  },
  {
    title: 'Weekend Lounge Tee',
    price: 360,
    image: '/womens/cb956d59-27be-4f67-a091-d2f85332949f.jpg',
  },
  {
    title: 'Twilight Floral Top',
    price: 390,
    image: '/womens/d9dd1dc6-932c-45ca-bed9-77441b1c104e.jpg',
  },
  {
    title: 'City Drive Crewneck',
    price: 400,
    image: '/womens/f035bf05-7525-4f18-957e-488c96284908.jpg',
  },
]

export function WomenPage({ onNavigate }) {
  const { products: apiProducts } = useProducts()
  const filtered = apiProducts.filter((p) => (p.tag || '').toLowerCase() === 'women')
  const items =
    filtered.length >= 6
      ? filtered.map((p) => ({ title: p.name, price: p.price, image: p.image }))
      : [...filtered.map((p) => ({ title: p.name, price: p.price, image: p.image })), ...looks].reduce((acc, item) => {
          if (!acc.find((p) => p.title === item.title)) acc.push(item)
          return acc
        }, [])
  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-xl bg-gradient-to-r from-rose-100 via-amber-50 to-white p-8 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">New arrival</p>
            <h2 className="text-3xl font-semibold text-neutral-900">Women&apos;s Summer Edit</h2>
            <p className="max-w-2xl text-neutral-700">
              Soft fabrics, breathable silhouettes, and statement accents. Discover the women&apos;s edit we curated to
              keep you cool and polished all summer long.
            </p>
          </div>
          <button
            type="button"
            className="self-start rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => onNavigate?.('product')}
          >
            Shop a featured look
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="group space-y-3 rounded-xl border border-neutral-200 bg-white/80 p-3 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase text-rose-600 shadow-sm">
                Fresh
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rose-500/60 to-transparent px-3 py-2 text-xs uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
                Summer-ready
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="space-y-1">
                <div className="font-medium text-neutral-900">{item.title}</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900">₱{item.price}</span>
                  <span className="text-[11px] text-rose-600">New</span>
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
    </section>
  )
}
