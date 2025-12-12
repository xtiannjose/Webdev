import { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { checkout } from '../../lib/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export function CheckoutPage({ onNavigate }) {
  const { cart, totals } = useStore()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', country: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const tax = Math.round(totals.subtotal * 0.12)
  const shippingFee = totals.shipping

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      addToast('Please sign in to checkout', 'error')
      onNavigate?.('auth')
      return
    }
    setLoading(true)
    try {
      await checkout({ ...shipping, tax, shippingFee })
      addToast('Order placed')
      onNavigate?.('orders')
    } catch (err) {
      addToast(err.message || 'Checkout failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!cart.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-neutral-600">Your cart is empty.</p>
      </section>
    )
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Full name' },
            { key: 'address', label: 'Address' },
            { key: 'city', label: 'City' },
            { key: 'country', label: 'Country' },
          ].map((field) => (
            <label key={field.key} className="block text-sm font-semibold text-neutral-800">
              {field.label}
              <input
                required
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                value={shipping[field.key]}
                onChange={(e) => setShipping((s) => ({ ...s, [field.key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block text-sm font-semibold text-neutral-800">
            Notes
            <textarea
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              value={shipping.notes}
              onChange={(e) => setShipping((s) => ({ ...s, notes: e.target.value }))}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </div>

      <div className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-800">Order summary</h2>
        <div className="space-y-2 text-sm">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex items-center justify-between">
              <span className="text-neutral-700">
                {item.name} <span className="text-xs text-neutral-500">({item.size || 'One size'})</span>
              </span>
              <span className="font-semibold text-neutral-900">₱{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Shipping</span>
            <span className="font-semibold text-neutral-900">₱{shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Tax (12%)</span>
            <span className="font-semibold text-neutral-900">₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
            <span>Total</span>
            <span>₱{(totals.total + tax).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
