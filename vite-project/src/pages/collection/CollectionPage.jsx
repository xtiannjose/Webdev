import { useRef, useState } from 'react'
import { useProducts } from '../../hooks/useProducts.js'

const drops = [
  {
    title: 'Summer Essentials',
    desc: 'Breathable tees, relaxed shorts, and airy layers built for heat.',
    cta: 'Shop Men',
    page: 'men',
    image: '/mens/50aa801b-bae8-4e0c-93a9-550baf3defdc.jpg',
  },
  {
    title: 'City Layers',
    desc: 'Structured outerwear and monochrome staples for cooler nights.',
    cta: 'Shop Women',
    page: 'women',
    image: '/womens/f035bf05-7525-4f18-957e-488c96284908.jpg',
  },
  {
    title: 'Statement Graphics',
    desc: 'Bold prints and playful color for standing out anywhere.',
    cta: 'See Lookbook',
    page: 'lookbook',
    image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg',
  },
]

const showcase = [
  { title: 'Graphic Hoodie', image: '/mens/4d53bc77-16bb-4e92-8205-4d8e8ddb08e5.jpg', price: 500 },
  { title: 'Coastal Linen Set', image: '/womens/821bb0c1-e722-45d5-b9d1-9fc0e9df2037.jpg', price: 500 },
  { title: 'Crescent Cargo', image: '/mens/a4ff4db1-c2e2-4455-a76d-606c187cf54f.jpg', price: 420 },
  { title: 'Garden Hoodie', image: '/womens/ca0c54f7-8129-41cf-a9fb-fbf109ace73b.jpg', price: 450 },
  { title: 'Primal Tee', image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg', price: 460 },
  { title: 'City Drive Crew', image: '/womens/f035bf05-7525-4f18-957e-488c96284908.jpg', price: 400 },
]

export function CollectionPage({ onNavigate }) {
  const scrollRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const { products: apiProducts } = useProducts()

  const onMouseDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    setDragging(true)
    setStartX(e.pageX - el.offsetLeft)
    setScrollLeft(el.scrollLeft)
  }

  const onMouseLeave = () => setDragging(false)
  const onMouseUp = () => setDragging(false)

  const onMouseMove = (e) => {
    if (!dragging) return
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX) * 1.2
    el.scrollLeft = scrollLeft - walk
  }

  return (
    <section className="space-y-10">
      <div className="rounded-lg bg-neutral-50 p-8">
        <h1 className="text-3xl font-semibold">Collections</h1>
        <p className="mt-3 max-w-2xl text-neutral-700">
          Curated drops you can browse quickly. Each capsule focuses on a distinct vibe—mix and match or dive deep into
          one story.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Showcase</h2>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/70 p-3 shadow-sm">
          <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto pb-3 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {(apiProducts.length ? apiProducts : showcase).map((item) => (
              <article
                key={item.title}
                className="group w-56 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <img src={item.image} alt={item.title} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
                    Featured
                  </div>
                </div>
                <div className="space-y-1 px-3 py-3 text-sm">
                  <div className="font-semibold text-neutral-900">{item.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">₱{item.price}</span>
                    <span className="text-[11px] text-emerald-600">New</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {drops.map((drop) => (
          <article key={drop.title} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
            <img src={drop.image} alt={drop.title} className="aspect-[3/4] w-full rounded-md object-cover" />
            <div className="space-y-2 text-sm">
              <div className="text-lg font-semibold">{drop.title}</div>
              <p className="text-neutral-700">{drop.desc}</p>
            </div>
            <button
              type="button"
              className="pill-button w-full"
              onClick={() => onNavigate?.(drop.page)}
            >
              {drop.cta}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
