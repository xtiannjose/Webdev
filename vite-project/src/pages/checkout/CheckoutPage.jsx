import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import {
  addAddress,
  checkout,
  createPaymentIntent,
  deleteAddress,
  fetchAddresses,
  fetchShippingMethods,
  validatePromo,
} from '../../lib/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE) : null

function CheckoutContainer(props) {
  return stripePromise ? (
    <Elements stripe={stripePromise}>
      <CheckoutPage {...props} />
    </Elements>
  ) : (
    <CheckoutPage {...props} />
  )
}

export default CheckoutContainer

function CheckoutPage() {
  const { cart, totals } = useStore()
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [shipping, setShipping] = useState({ name: '', address: '', city: '', country: '', notes: '' })
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [shippingMethods, setShippingMethods] = useState([])
  const [shippingMethod, setShippingMethod] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [promo, setPromo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [methodsLoading, setMethodsLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const tax = Math.round(totals.subtotal * 0.12)
  const shippingFee = shippingMethod?.fee ?? totals.shipping

  useEffect(() => {
    setMethodsLoading(true)
    fetchShippingMethods()
      .then((res) => {
        setShippingMethods(res.methods || [])
        if (res.methods?.length) setShippingMethod(res.methods[0])
      })
      .catch(() => setShippingMethods([]))
      .finally(() => setMethodsLoading(false))
  }, [])

  useEffect(() => {
    if (!user) return
    fetchAddresses()
      .then((res) => setAddresses(res.addresses || []))
      .catch(() => setAddresses([]))
  }, [user])

  useEffect(() => {
    if (!selectedAddress) return
    const addr = addresses.find((a) => a.id === selectedAddress)
    if (addr) {
      setShipping((prev) => ({
        ...prev,
        name: addr.name || '',
        address: addr.line1 || '',
        city: addr.city || '',
        country: addr.country || '',
      }))
    }
  }, [addresses, selectedAddress])

  const discount = useMemo(() => {
    if (!promo) return 0
    if (promo.type === 'percent') return Math.round((totals.subtotal * promo.value) / 100)
    if (promo.type === 'shipping') return Math.min(promo.value, shippingFee)
    return 0
  }, [promo, totals.subtotal, shippingFee])

  const totalWithExtras = totals.subtotal + shippingFee + tax - discount

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      addToast('Please sign in to checkout', 'error')
      navigate('/auth')
      return
    }
    if (!shippingMethod) {
      addToast('Please select a shipping method', 'error')
      return
    }
    setLoading(true)
    try {
      const intent = await createPaymentIntent(totalWithExtras)
      const paymentIntentId = intent.clientSecret || 'test'
      // If Stripe is configured, confirm card payment client-side
      if (stripe && elements && intent.clientSecret) {
        const card = elements.getElement(CardElement)
        if (!card) throw new Error('Payment element missing')
        const res = await stripe.confirmCardPayment(intent.clientSecret, { payment_method: { card } })
        if (res.error) throw new Error(res.error.message)
      }
      const order = await checkout(
        {
          ...shipping,
          shippingMethod,
          promoCode: promoCode || undefined,
          discount,
          tax,
          shippingFee,
          subtotal: totals.subtotal,
          paymentStatus: 'paid',
        },
        paymentIntentId
      )
      addToast('Order placed')
      navigate('/order-confirmation', { state: { order: order.order, total: totalWithExtras } })
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
    <Elements stripe={stripePromise}>
      <InnerCheckout
        cart={cart}
        totals={totals}
        user={user}
        navigate={navigate}
        addToast={addToast}
        shippingState={{ shipping, setShipping }}
        addressState={{ addresses, setAddresses, selectedAddress, setSelectedAddress }}
        shippingMethodState={{ shippingMethods, shippingMethod, setShippingMethod }}
        promoState={{ promoCode, setPromoCode, promo, setPromo }}
        loaders={{ loading, setLoading, methodsLoading }}
        tax={tax}
        shippingFee={shippingFee}
        discount={discount}
        totalWithExtras={totalWithExtras}
      />
    </Elements>
  )
}

function InnerCheckout({
  cart,
  totals,
  user,
  navigate,
  addToast,
  shippingState,
  addressState,
  shippingMethodState,
  promoState,
  loaders,
  tax,
  shippingFee,
  discount,
  totalWithExtras,
}) {
  const { shipping, setShipping } = shippingState
  const { addresses, setAddresses, selectedAddress, setSelectedAddress } = addressState
  const { shippingMethods, shippingMethod, setShippingMethod } = shippingMethodState
  const { promoCode, setPromoCode, promo, setPromo } = promoState
  const { loading, setLoading, methodsLoading } = loaders
  const stripe = useStripe()
  const elements = useElements()

  if (!cart.length) {
    return null
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-neutral-800">Shipping method</div>
              {methodsLoading && <span className="text-xs text-neutral-500">Loading…</span>}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-2 text-xs ${
                    shippingMethod?.id === method.id ? 'border-neutral-900 bg-white shadow-sm' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={shippingMethod?.id === method.id}
                    onChange={() => setShippingMethod(method)}
                  />
                  <span className="font-semibold text-neutral-900">{method.label}</span>
                  <span className="text-neutral-700">₱{method.fee}</span>
                  <span className="text-[11px] text-neutral-500">{method.eta}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-neutral-800">Saved addresses</div>
              {user && (
                <button
                  type="button"
                  className="text-xs font-semibold text-neutral-700 underline-offset-4 hover:underline"
                  onClick={() => setSelectedAddress('')}
                >
                  Use new
                </button>
              )}
            </div>
            {addresses.length === 0 && <div className="text-neutral-600">No saved addresses yet.</div>}
            {addresses.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-lg border p-3 text-xs ${selectedAddress === addr.id ? 'border-neutral-900 bg-white shadow-sm' : 'border-neutral-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <label className="flex flex-1 items-start gap-2">
                        <input
                          type="radio"
                          className="mt-1"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                        />
                        <div>
                          <div className="font-semibold text-neutral-900">{addr.name}</div>
                          <div className="text-neutral-700">{addr.line1}</div>
                          <div className="text-neutral-500">
                            {addr.city}, {addr.country}
                          </div>
                        </div>
                      </label>
                      <button
                        type="button"
                        className="text-xs text-red-500 hover:underline"
                        onClick={async () => {
                          await deleteAddress(addr.id)
                          const res = await fetchAddresses()
                          setAddresses(res.addresses || [])
                          setSelectedAddress('')
                        }}
                        aria-label="Delete address"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            type="button"
            className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-400"
            onClick={async () => {
              try {
                await addAddress({
                  name: shipping.name,
                  line1: shipping.address,
                  city: shipping.city,
                  country: shipping.country,
                })
                const res = await fetchAddresses()
                setAddresses(res.addresses || [])
                addToast('Address saved')
              } catch {
                addToast('Failed to save address', 'error')
              }
            }}
          >
            Save address
          </button>

          <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                className="rounded-full border border-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
                onClick={async () => {
                  try {
                    const res = await validatePromo(promoCode, totals.subtotal)
                    setPromo(res.promo)
                    addToast('Promo applied')
                  } catch {
                    setPromo(null)
                    addToast('Invalid promo code', 'error')
                  }
                }}
              >
                Apply
              </button>
            </div>
            {promo && (
              <div className="text-xs text-emerald-700">
                Applied {promo.code} ({promo.type === 'percent' ? `${promo.value}%` : `₱${promo.value}`})
              </div>
            )}
          </div>

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
          {promo && (
            <div className="flex items-center justify-between text-emerald-700">
              <span>Promo ({promo.code})</span>
              <span>-₱{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Tax (12%)</span>
            <span className="font-semibold text-neutral-900">₱{tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
            <span>Total</span>
            <span>₱{totalWithExtras.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
