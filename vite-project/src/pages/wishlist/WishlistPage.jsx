import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'

const wishlistFallback = [
  {
    name: 'UV Protection Cap',
    productId: '481632',
    color: '09 Black',
    size: 'Unisex',
    image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg',
    price: 460,
  },
  {
    name: 'Italian Oiled Leather Belt',
    productId: '481622',
    color: '09 Black',
    size: 'Men',
    image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg',
    price: 360,
  },
  {
    name: 'Heattech Beanie',
    productId: '485256',
    color: '44 Yellow',
    size: 'Unisex',
    image: '/womens/d9dd1dc6-932c-45ca-bed9-77441b1c104e.jpg',
    price: 320,
  },
]

export function WishlistPage() {
  const navigate = useNavigate()
  const { wishlist, addToCart, toggleWishlist } = useStore()
  const savedItems = wishlist.length
    ? wishlist.map((item) => ({
        ...item,
        productId: item.id || item.productId || item.name,
      }))
    : []
  const recommendations = wishlist.length ? [] : wishlistFallback
  const [saved, setSaved] = useState(() =>
    (savedItems.length ? savedItems : wishlistFallback).reduce((acc, item) => {
      const key = item.id || item.productId || item.name
      acc[key] = true
      return acc
    }, {})
  )

  const toggleSaved = (item) => {
    const key = item.productId || item.id || item.name
    if (item.id) toggleWishlist(item)
    setSaved((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const moveToCart = (item) => {
    addToCart({
      id: item.id || item.productId || item.name,
      name: item.name,
      price: item.price || 0,
      image: item.image,
      qty: 1,
      size: item.size || 'One size',
      color: item.color || 'Standard',
      tag: item.tag || 'Wishlist',
    })
    if (item.id || wishlist.length) {
      toggleWishlist(item)
    }
    navigate('/cart')
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Wish List</h1>
        <p className="text-neutral-700">{savedItems.length} item(s)</p>
      </div>

      {savedItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-700">
          Your wishlist is empty. Browse the latest drops and tap the heart to save favorites.
          <div className="mt-3">
            <button
              type="button"
              className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
              onClick={() => navigate('/men')}
            >
              Shop now
            </button>
          </div>
        </div>
      )}

      {savedItems.length > 0 && (
        <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          {savedItems.map((item) => (
            <article
              key={item.productId || item.name}
              className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-8 md:gap-10"
            >
              <div className="relative h-[210px] w-[230px] flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm sm:h-[230px] sm:w-[260px]">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                <button
                  type="button"
                  className={`absolute right-3 top-3 p-1 text-3xl transition hover:scale-110 ${
                    saved[item.productId || item.id || item.name] ? 'text-red-500' : 'text-neutral-400'
                  }`}
                  aria-label={saved[item.productId || item.id || item.name] ? 'Remove from wishlist' : 'Add to wishlist'}
                  onClick={() => toggleSaved(item)}
                >
                  ♥
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2 text-base text-neutral-800">
                <div className="font-semibold text-lg text-neutral-900">{item.name}</div>
                <div className="text-neutral-600">Product ID: {item.productId}</div>
                {item.color && <div className="text-neutral-600">Color: {item.color}</div>}
                <div className="text-neutral-600">Size: {item.size}</div>
                {item.price ? <div className="font-semibold text-neutral-900">₱{item.price}</div> : null}
              </div>

              <div className="flex w-full max-w-xs flex-col items-start gap-3 sm:max-w-[220px] sm:items-end">
                <button
                  type="button"
                  className="w-full rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                  onClick={() => moveToCart(item)}
                >
                  Move to cart
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300"
                  onClick={() => navigate('/product')}
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {savedItems.length === 0 && recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Trending picks</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.productId} className="space-y-2 rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm">
                <div className="overflow-hidden rounded-lg bg-neutral-50">
                  <img src={item.image} alt={item.name} className="h-40 w-full object-cover transition duration-500 hover:scale-105" />
                </div>
                <div className="font-semibold text-neutral-900">{item.name}</div>
                <div className="text-neutral-700">₱{item.price}</div>
                <button
                  type="button"
                  className="w-full rounded-full border border-neutral-200 px-3 py-2 text-[11px] font-semibold text-neutral-800 transition hover:border-neutral-300"
                  onClick={() => moveToCart(item)}
                >
                  Move to cart
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
