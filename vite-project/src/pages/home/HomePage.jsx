import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '../../hooks/useProducts.js'

const heroImages = [
  '/MainHero/002e662f-a806-4746-926b-3e2c0c80da1b.jpg',
  '/MainHero/70696968-31f8-43fe-80ed-0b0980541423.jpg',
  '/MainHero/c77a8764-cef1-4d87-9b4b-bd595b8969fb.jpg',
  '/MainHero/f193b782-a184-4f34-87ff-08d37d2045c2.jpg',
]

const featuredProducts = [
  { name: 'Primal Rose Tee', price: 460, image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg', tag: 'Men' },
  { name: 'Roots of Loyalty Tee', price: 380, image: '/mens/10f84550-41c3-414a-98f1-fbe6a01a866c.jpg', tag: 'Men' },
  { name: 'Demon Slayer Sweater', price: 480, image: '/mens/1de3e249-45bb-40cd-a756-d29d25a5cb88.jpg', tag: 'Men' },
  { name: 'Tanjiro + Nezuko Hoodie', price: 500, image: '/mens/4d53bc77-16bb-4e92-8205-4d8e8ddb08e5.jpg', tag: 'Men' },
  { name: 'Crescent Cargo Pants', price: 420, image: '/mens/a4ff4db1-c2e2-4455-a76d-606c187cf54f.jpg', tag: 'Men' },
  { name: 'Breeze Summer Dress', price: 480, image: '/womens/b5e6ce57-02a1-4538-b182-aa4b8f266899.jpg', tag: 'Women' },
  { name: 'Coastal Linen Set', price: 500, image: '/womens/821bb0c1-e722-45d5-b9d1-9fc0e9df2037.jpg', tag: 'Women' },
  { name: 'Seaside Pastel Hoodie', price: 420, image: '/womens/32882a40-22e9-4651-b9af-d958363b4649.jpg', tag: 'Women' },
  { name: 'Garden Stroll Hoodie', price: 450, image: '/womens/ca0c54f7-8129-41cf-a9fb-fbf109ace73b.jpg', tag: 'Women' },
  { name: 'City Drive Crewneck', price: 400, image: '/womens/f035bf05-7525-4f18-957e-488c96284908.jpg', tag: 'Women' },
]

const categories = [
  { label: 'Shirts', image: '/mens/41dfbb67-36e0-45e3-8c1c-743d8256238e.jpg', page: 'men' },
  { label: 'Shorts', image: '/mens/a4ff4db1-c2e2-4455-a76d-606c187cf54f.jpg', page: 'men' },
  { label: 'Hoodies & Sweaters', image: '/womens/32882a40-22e9-4651-b9af-d958363b4649.jpg', page: 'women' },
  { label: 'Pants', image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg', page: 'men' },
  { label: 'Accessories', image: '/womens/cb956d59-27be-4f67-a091-d2f85332949f.jpg', page: 'women' },
]

export function HomePage({ onNavigate }) {
  const [index, setIndex] = useState(0)
  const currentImage = useMemo(() => heroImages[index % heroImages.length], [index])
  const { products: apiProducts } = useProducts()
  const featured = apiProducts.length ? apiProducts : featuredProducts

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-16">
      <section className="grid items-stretch gap-10 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">New season</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Surprise TP ult</h1>
          <p className="max-w-xl text-lg text-neutral-700">
            Im not saying na may gusto rin sya sayo or may "pag-asa" ka. All im saying is why not try, wala naman
            mawawala. If it makes you happy then take actions, don't be a pussy. If it fails, at least you tried. Dont
            let any one stand against your happiness. just be careful, a sentinel is trying to attack behind your back,
            and keep in mind he knows exactly where you are!
          </p>
          <button
            type="button"
            className="pill-button"
            onClick={() => onNavigate?.('men')}
          >
            Explore new December Plot Twist styles
          </button>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-neutral-100 blur-3xl" aria-hidden />
          <div className="relative h-[520px] overflow-hidden rounded-2xl bg-neutral-100 shadow-xl">
                <img
                  key={currentImage}
                  src={currentImage}
                  alt="Featured look"
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-700 ease-in-out"
                />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
          </div>
          <div className="mt-4 flex items-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 w-8 rounded-full transition ${i === index ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured products</h2>
          <button
            type="button"
            className="text-sm font-semibold text-neutral-700 underline underline-offset-4 transition hover:text-neutral-900"
            onClick={() => onNavigate?.('product')}
          >
            View all
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/70 p-3 shadow-sm">
          <div className="loop-strip flex gap-4">
            {[...featured, ...featured].map((item, idx) => (
              <article
                key={`${item.name}-${idx}`}
                className="group w-56 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <img src={item.image} alt={item.name} loading="lazy" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2 py-1 text-[11px] font-semibold uppercase text-white">
                    {item.tag}
                  </span>
                </div>
                <div className="space-y-1 px-3 py-3 text-sm">
                  <div className="font-semibold text-neutral-900">{item.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">₱{item.price}</span>
                    <span className="text-[11px] text-emerald-600">New</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Shop by category</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">Curated for you</p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => onNavigate?.(cat.page)}
              className="group relative overflow-hidden rounded-xl bg-neutral-900 p-4 text-left text-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img src={cat.image} alt={cat.label} className="absolute inset-0 h-full w-full object-cover opacity-40 transition group-hover:opacity-60" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="text-base font-semibold md:text-lg">{cat.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-100">Explore</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
