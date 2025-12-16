import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { setJSONLD } from '../../lib/seo.js'

const gallery = [
  { src: '/mens/4d53bc77-16bb-4e92-8205-4d8e8ddb08e5.jpg', alt: 'Half zip polo in blue' },
  { src: '/mens/50aa801b-bae8-4e0c-93a9-550baf3defdc.jpg', alt: 'Half zip polo in charcoal' },
  { src: '/mens/479121be-4991-438c-b132-b166b283d86d.jpg', alt: 'Half zip polo detail' },
  { src: '/mens/1de3e249-45bb-40cd-a756-d29d25a5cb88.jpg', alt: 'Half zip polo flatlay' },
]

const colors = [
  { name: 'Blue', swatch: 'bg-slate-500' },
  { name: 'Charcoal', swatch: 'bg-neutral-700' },
  { name: 'Olive', swatch: 'bg-emerald-900' },
  { name: 'Taupe', swatch: 'bg-amber-200' },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL']

const inspiration = [
  { src: '/Lookbook/10008afa-016e-4873-a0bd-d9457f455633.jpg', user: 'JB', size: 'M' },
  { src: '/Lookbook/a1ea777d-0c13-4d6b-a909-11ccec68429e.jpg', user: 'Putra', size: 'L' },
  { src: '/Lookbook/a8d3c029-dbe8-462f-bdcd-4354c788c4fa.jpg', user: 'Omega', size: 'M' },
]

const freqBought = [
  { title: 'Dry Waffle Henley', price: 790, image: '/mens/41dfbb67-36e0-45e3-8c1c-743d8256238e.jpg', tag: 'Unisex' },
  { title: 'Half-Zip Sweatshirt', price: 990, image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg', tag: 'Men' },
  { title: 'Airism Crew Long Sleeve', price: 990, image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg', tag: 'Unisex' },
  { title: 'Straight Jeans', price: 1190, image: '/mens/a4ff4db1-c2e2-4455-a76d-606c187cf54f.jpg', tag: 'Men' },
]

const reviews = [
  { name: 'Miguel T.', rating: 5, size: 'M', body: 'Soft, breathable, and the collar stays sharp after washing.' },
  { name: 'Hannah L.', rating: 4, size: 'S', body: 'Relaxed fit without looking sloppy. Went one size down.' },
  { name: 'Carlo R.', rating: 5, size: 'L', body: 'Perfect weight for Manila weather—layerable but not hot.' },
]

export function ProductPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const product = {
    id: id || 'wash-cotton-half-zip',
    name: 'Wash Cotton Half Zip Polo Shirt',
    price: 590,
    compareAt: 1290,
    tag: 'Men',
    image: gallery[0].src,
  }
  const { addToCart } = useStore()
  const [selectedColor, setSelectedColor] = useState(colors[0].name)
  const [selectedSize, setSelectedSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [addedOpen, setAddedOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const stockBySize = { XS: 0, S: 3, M: 5, L: 2, XL: 1, '2XL': 0 }
  const stockLevel = stockBySize[selectedSize] ?? 0
  const inStock = stockLevel > 0

  useEffect(() => {
    const ldProduct = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: gallery.map((g) => g.src),
      description: 'Wash cotton half zip polo shirt with breathable fabric and relaxed shoulders.',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'PHP',
        price: product.price,
        availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      brand: { '@type': 'Brand', name: 'Raku' },
      sku: product.id,
    }
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: 'Product', item: window.location.href },
      ],
    }
    setJSONLD('ld-product', ldProduct)
    setJSONLD('ld-breadcrumbs', breadcrumbs)
  }, [product.id, product.name, product.price, inStock])

  const addItem = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
      size: selectedSize,
      color: selectedColor,
      tag: product.tag,
    })
    setAddedOpen(true)
  }

  const increment = () => setQty((n) => Math.min(n + 1, stockLevel || 4))
  const decrement = () => setQty((n) => Math.max(1, n - 1))

  return (
    <section className="space-y-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="grid gap-4 rounded-2xl bg-white p-2 shadow-sm md:grid-cols-2">
          <div className="col-span-2 overflow-hidden rounded-xl border border-neutral-200">
            <img src={gallery[0].src} alt={gallery[0].alt} loading="lazy" className="h-[360px] w-full object-cover md:h-[420px]" />
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <img src={gallery[1].src} alt={gallery[1].alt} loading="lazy" className="h-80 w-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <img src={gallery[2].src} alt={gallery[2].alt} loading="lazy" className="h-80 w-full object-cover" />
          </div>
          <div className="col-span-2 overflow-hidden rounded-xl border border-neutral-200">
            <img src={gallery[3].src} alt={gallery[3].alt} loading="lazy" className="h-80 w-full object-cover" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Raku.co</p>
            <h1 className="text-3xl font-semibold text-neutral-900">Wash Cotton Half Zip Polo Shirt</h1>
            <div className="flex items-center gap-3 text-lg">
              <span className="text-neutral-400 line-through">₱1,290</span>
              <span className="text-red-600">₱590</span>
            </div>
            <p className="text-xs font-semibold uppercase text-red-600">Sale</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Color</div>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 border-white shadow ring-1 ring-neutral-300 transition hover:ring-neutral-500 ${c.swatch} ${
                      selectedColor === c.name ? 'ring-neutral-900' : ''
                    }`}
                    aria-label={`Color ${c.name}`}
                    onClick={() => setSelectedColor(c.name)}
                  />
                ))}
              </div>
            </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Size</div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                    key={size}
                    type="button"
                    className={`min-w-[56px] rounded border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      selectedSize === size ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 hover:border-neutral-900'
                    }`}
                    aria-label={`Size ${size}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-sky-700 underline-offset-4 hover:underline"
                  onClick={() => setSizeGuideOpen(true)}
                >
                  Check my size
                </button>
              </div>
            </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-neutral-300">
              <button type="button" className="px-4 py-2 text-lg text-neutral-700" onClick={decrement}>
                −
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-neutral-900">{qty}</span>
              <button type="button" className="px-4 py-2 text-lg text-neutral-700" onClick={increment}>
                +
              </button>
            </div>
            <p className={`text-xs font-semibold ${inStock ? 'text-emerald-700' : 'text-red-600'}`}>
              {inStock ? `In stock — ${stockLevel} left` : 'Out of stock'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              onClick={addItem}
              disabled={!inStock}
            >
              {inStock ? 'Add to cart' : 'Notify when back'}
            </button>
            <button
              type="button"
              className="w-full rounded-full border border-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
              onClick={() => setNotifyOpen(true)}
            >
              Notify me
            </button>
            <p className="text-xs text-neutral-600">Restock notification available · Free shipping for Click & Collect orders</p>
            <button type="button" className="text-xs font-semibold text-sky-700 underline-offset-4 hover:underline">
              Find stock in store
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-xs text-neutral-500">Product ID: 477156</p>
        </div>
        <details className="group space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
            Features <span className="text-neutral-400 group-open:rotate-180">⌃</span>
          </summary>
          <div className="grid gap-3 md:grid-cols-[160px,1fr] md:items-center">
            <img src="/mens/479121be-4991-438c-b132-b166b283d86d.jpg" alt="Fabric detail" loading="lazy" className="rounded-lg object-cover shadow-sm" />
            <p className="text-sm text-neutral-700">
              Lightweight French terry fabric that can be worn like a tee. Garment-washed for a softly faded color and casual drape.
            </p>
          </div>
        </details>
        {[
          { title: 'Details', body: 'Half zip placket, ribbed collar, relaxed shoulders, straight hem.' },
          { title: 'Materials / Care', body: 'Cotton blend. Machine wash cold, tumble dry low, do not bleach.' },
          { title: 'Delivery / Exchange / Returns', body: 'Free returns within 30 days. Delivery 1-5 business days depending on region.' },
        ].map((item) => (
          <details key={item.title} className="rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              {item.title} <span className="text-neutral-400">+</span>
            </summary>
            <p className="mt-2 text-neutral-700">{item.body}</p>
          </details>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customer reviews</h2>
          <div className="text-sm text-neutral-700">4.7 ★ average</div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="space-y-2 rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-neutral-900">{review.name}</div>
                <div className="text-amber-500">{'★'.repeat(review.rating)}</div>
              </div>
              <div className="text-xs uppercase tracking-wide text-neutral-500">Size: {review.size}</div>
              <p className="text-neutral-700">{review.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 md:pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">StyleHint Inspiration</h2>
          <button type="button" className="text-sm font-semibold text-sky-700 underline-offset-4 hover:underline">
            View more looks
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {inspiration.map((item) => (
            <article key={item.src} className="space-y-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
              <img src={item.src} alt={item.user} loading="lazy" className="h-56 w-full rounded-lg object-cover md:h-64" />
              <div className="text-xs text-neutral-700">
                <div className="font-semibold text-neutral-900">{item.user}</div>
                <div>Size: {item.size}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Frequently Bought Together</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {freqBought.map((item) => (
            <article key={item.title} className="space-y-2 rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm">
              <div className="overflow-hidden rounded-lg bg-neutral-50">
                <img src={item.image} alt={item.title} loading="lazy" className="h-44 w-full object-cover transition duration-500 hover:scale-105 md:h-48" />
              </div>
              <div className="text-[11px] uppercase tracking-wide text-neutral-500">{item.tag}</div>
              <div className="font-semibold text-neutral-900">{item.title}</div>
              <div className="font-semibold text-neutral-900">₱{item.price}</div>
              <div className="flex items-center gap-1 text-[11px] text-amber-500">
                ★★★★★ <span className="text-neutral-500">(300+)</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Recently viewed</h2>
        <div className="flex flex-wrap gap-4">
          {gallery.slice(0, 1).map((item) => (
            <article key={item.src} className="w-60 space-y-2 rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm">
              <div className="overflow-hidden rounded-lg bg-neutral-50">
                <img src={item.src} alt="Recently viewed" loading="lazy" className="h-56 w-full object-cover md:h-64" />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                <span className="h-2 w-2 rounded-full bg-neutral-700" />
                <span className="h-2 w-2 rounded-full bg-emerald-900" />
              </div>
              <div className="text-[11px] uppercase tracking-wide text-neutral-500">Men · S-3XL</div>
              <div className="font-semibold text-neutral-900">Wash Cotton Half Zip Polo Shirt</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-400 line-through">₱1,290</span>
                <span className="font-semibold text-red-600">₱590</span>
              </div>
              <div className="text-[11px] font-semibold uppercase text-red-600">Sale</div>
              <div className="flex items-center gap-1 text-[11px] text-amber-500">
                ★★★★☆ <span className="text-neutral-500">(136)</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {addedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 text-sm">
              <div className="font-semibold text-neutral-800">1 item added to your cart</div>
              <button
                type="button"
                className="text-lg text-neutral-500 transition hover:text-neutral-900"
                aria-label="Close"
                onClick={() => setAddedOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold">
              <div className="flex items-center justify-between">
                <span>
                  Subtotal | {freqBought.length} item(s)
                </span>
                <span className="text-neutral-900">₱{(freqBought.reduce((s, i) => s + i.price, 0)).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-4 px-4 py-4">
              <h3 className="text-center text-lg font-semibold text-neutral-900">Items Purchased Together</h3>
              <div className="grid gap-4 md:grid-cols-4">
                {freqBought.map((item) => (
                  <article key={item.title} className="space-y-2 rounded-xl border border-neutral-200 p-3 text-sm shadow-sm">
                    <div className="overflow-hidden rounded-lg bg-neutral-50">
                      <img src={item.image} alt={item.title} loading="lazy" className="h-40 w-full object-cover transition duration-500 hover:scale-105" />
                    </div>
                    <div className="text-[11px] uppercase tracking-wide text-neutral-500">{item.tag}</div>
                    <div className="font-semibold text-neutral-900">{item.title}</div>
                    <div className="font-semibold text-neutral-900">₱{item.price}</div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500">
                      ★★★★☆ <span className="text-neutral-500">(100+)</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="w-full rounded-full border border-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white sm:w-auto"
                  onClick={() => {
                    setAddedOpen(false)
                    navigate('/')
                  }}
                >
                  Continue shopping
                </button>
                <button
                  type="button"
                  className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto"
                  onClick={() => {
                    setAddedOpen(false)
                    navigate('/cart')
                  }}
                >
                  View cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Size & Fit Guide</h3>
              <button
                type="button"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size guide"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-700">Measure your favorite tee flat and match to the table below.</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
              <div className="grid grid-cols-5 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase text-neutral-600">
                <span>Size</span>
                <span>Chest</span>
                <span>Length</span>
                <span>Shoulder</span>
                <span>Sleeve</span>
              </div>
              <div className="divide-y divide-neutral-200 text-sm text-neutral-800">
                {[
                  { size: 'XS', chest: '36 in', length: '26 in', shoulder: '16.5 in', sleeve: '8.5 in' },
                  { size: 'S', chest: '38 in', length: '27 in', shoulder: '17 in', sleeve: '9 in' },
                  { size: 'M', chest: '40 in', length: '28 in', shoulder: '17.5 in', sleeve: '9.25 in' },
                  { size: 'L', chest: '42 in', length: '29 in', shoulder: '18 in', sleeve: '9.5 in' },
                  { size: 'XL', chest: '44 in', length: '30 in', shoulder: '18.5 in', sleeve: '9.75 in' },
                ].map((row) => (
                  <div key={row.size} className="grid grid-cols-5 px-3 py-2">
                    <span className="font-semibold">{row.size}</span>
                    <span>{row.chest}</span>
                    <span>{row.length}</span>
                    <span>{row.shoulder}</span>
                    <span>{row.sleeve}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {notifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notify me</h3>
              <button
                type="button"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
                onClick={() => setNotifyOpen(false)}
                aria-label="Close notification modal"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              We&apos;ll email you when {product.name} is back in stock for size {selectedSize} in {selectedColor}.
            </p>
            <form
              className="mt-4 space-y-3 text-sm"
              onSubmit={(e) => {
                e.preventDefault()
                setNotifyOpen(false)
                setAddedOpen(false)
              }}
            >
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Email</span>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 focus:border-neutral-900 focus:outline-none"
                  placeholder="you@example.com"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Save notification
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
