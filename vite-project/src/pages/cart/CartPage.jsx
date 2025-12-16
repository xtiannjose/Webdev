import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'

const alsoBought = [
  { name: 'Tengen Uzui Tee', price: 370, image: '/mens/50aa801b-bae8-4e0c-93a9-550baf3defdc.jpg' },
  { name: 'Crescent Cargo Pants', price: 420, image: '/mens/a4ff4db1-c2e2-4455-a76d-606c187cf54f.jpg' },
  { name: 'Breeze Summer Dress', price: 480, image: '/womens/b5e6ce57-02a1-4538-b182-aa4b8f266899.jpg' },
]

const recentlyViewed = [
  { name: 'Primal Rose Tee', price: 460, image: '/mens/07758d4f-8317-41c3-8d19-4cb60ba9ca5a.jpg' },
  { name: 'Slate Jeans', price: 360, image: '/mens/662b6f78-e2b4-4bfd-be61-c3b9084fca4f.jpg' },
  { name: 'Sunrise Knit Top', price: 380, image: '/womens/9d0027dc-65c2-4e56-9ea7-d5447352e608.jpg' },
]

export function CartPage() {
  const { cart, totals, updateQty, removeFromCart, moveToWishlist } = useStore()
  const navigate = useNavigate()

  return (
    <section className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Shopping Cart</h1>
        <p className="text-neutral-700">Review your items and proceed to checkout.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[2fr_0.85fr] items-start">
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {cart.length === 0 && <p className="text-sm text-neutral-600">Your cart is empty.</p>}
          {cart.map((item) => (
            <article key={item.name} className="flex flex-col gap-3 border-b border-neutral-200 pb-4 last:border-none last:pb-0">
              <div className="flex items-start gap-4">
                <div className="relative h-44 w-44 overflow-hidden rounded-lg md:h-48 md:w-48">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase text-white">
                    {item.tag}
                  </span>
                </div>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div className="space-y-1 text-sm md:text-base">
                    <div className="font-semibold text-neutral-900">{item.name}</div>
                    <div className="text-xs text-neutral-500">Color: Pink</div>
                    <div className="text-xs text-neutral-500">Size: Unisex M</div>
                    <div className="font-semibold text-neutral-900">₱{item.price}</div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-red-500"
                    onClick={() => removeFromCart(item.id, item.size)}
                    aria-label="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pl-36 md:pl-40">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase text-neutral-800">
                  <span>Quantity</span>
                  <select
                    className="rounded border border-neutral-300 px-3 py-1 text-neutral-800 focus:border-neutral-900 focus:outline-none"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, item.size, Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm font-semibold text-neutral-900 md:text-base">Subtotal: ₱{item.price * item.qty}</div>
                <button
                  type="button"
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-[11px] font-semibold text-neutral-700 transition hover:border-neutral-300"
                  onClick={() => moveToWishlist(item)}
                >
                  Move to wishlist
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-md lg:max-w-sm lg:ml-auto">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-800">
            Order Summary | {cart.length} item(s)
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">Item(s) subtotal</span>
              <span className="font-semibold text-neutral-900">₱{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-700">Shipping</span>
              <span className="font-semibold text-neutral-900">₱{totals.shipping.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
              <span>Order total</span>
              <span>₱{totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-neutral-700">
              <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-neutral-900" /> Coupon
            </label>
            <label className="flex items-center gap-2 text-xs text-neutral-700">
              <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-neutral-900" /> Gift option
            </label>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="w-full rounded-sm bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700"
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </button>
            <button
              type="button"
              className="w-full rounded-sm border border-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
              onClick={() => navigate('/')}
            >
              Continue shopping
            </button>
          </div>

          <p className="text-[11px] text-neutral-500">
            Confirmed orders can no longer be modified. Sales invoice will be issued electronically via email and order history.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">People also bought</h2>
            <button
              type="button"
              className="text-xs font-semibold text-neutral-600 underline-offset-4 hover:underline"
              onClick={() => navigate('/collection')}
            >
              View more
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {alsoBought.map((item) => (
              <article key={item.name} className="space-y-2 rounded-xl border border-neutral-200 p-3 text-sm shadow-sm">
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain transition duration-500 hover:scale-105" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-neutral-900">{item.name}</div>
                  <div className="text-neutral-700">₱{item.price}</div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full border border-neutral-200 px-3 py-2 text-[11px] font-semibold text-neutral-800 transition hover:border-neutral-300"
                  onClick={() => navigate('/product')}
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Recently viewed</h2>
            <button
              type="button"
              className="text-xs font-semibold text-neutral-600 underline-offset-4 hover:underline"
              onClick={() => navigate('/')}
            >
              Browse more
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recentlyViewed.map((item) => (
              <article key={item.name} className="space-y-2 rounded-xl border border-neutral-200 p-3 text-sm shadow-sm">
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain transition duration-500 hover:scale-105" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-neutral-900">{item.name}</div>
                  <div className="text-neutral-700">₱{item.price}</div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full border border-neutral-200 px-3 py-2 text-[11px] font-semibold text-neutral-800 transition hover:border-neutral-300"
                  onClick={() => navigate('/product')}
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
