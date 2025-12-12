import { useState } from 'react'

const wishlistItems = [
  {
    name: 'UV Protection Cap',
    productId: '481632',
    color: '09 Black',
    size: 'Unisex',
    image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg',
  },
  {
    name: 'Italian Oiled Leather Belt',
    productId: '481622',
    color: '09 Black',
    size: 'Men',
    image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg',
  },
  {
    name: 'Heattech Beanie',
    productId: '485256',
    color: '44 Yellow',
    size: 'Unisex',
    image: '/womens/d9dd1dc6-932c-45ca-bed9-77441b1c104e.jpg',
  },
]

export function WishlistPage({ onNavigate }) {
  const [saved, setSaved] = useState(() =>
    wishlistItems.reduce((acc, item) => {
      acc[item.productId] = true
      return acc
    }, {})
  )

  const toggleSaved = (productId) =>
    setSaved((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Wish List</h1>
        <p className="text-neutral-700">{wishlistItems.length} item(s)</p>
      </div>

      <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        {wishlistItems.map((item) => (
          <article
            key={item.name}
            className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-8 md:gap-10"
          >
            <div className="relative h-[210px] w-[230px] flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm sm:h-[230px] sm:w-[260px]">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              <button
                type="button"
                className={`absolute right-3 top-3 p-1 text-3xl transition hover:scale-110 ${
                  saved[item.productId] ? 'text-red-500' : 'text-neutral-400'
                }`}
                aria-label={saved[item.productId] ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => toggleSaved(item.productId)}
              >
                ♥
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 text-base text-neutral-800">
              <div className="font-semibold text-lg text-neutral-900">{item.name}</div>
              <div className="text-neutral-600">Product ID: {item.productId}</div>
              <div className="text-neutral-600">Color: {item.color}</div>
              <div className="text-neutral-600">Size: {item.size}</div>
            </div>

            <div className="flex w-full max-w-xs flex-col items-start gap-3 sm:max-w-[220px] sm:items-end">
              <button
                type="button"
                className="w-full rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                onClick={() => onNavigate?.('cart')}
              >
                Move to cart
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300"
                onClick={() => onNavigate?.('product')}
              >
                View details
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
