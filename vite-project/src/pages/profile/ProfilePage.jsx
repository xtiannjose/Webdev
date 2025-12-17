import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { addAddress, deleteAddress, fetchAddresses, fetchOrders } from '../../lib/api.js'
import { OrderDetailModal } from '../orders/OrderDetailModal.jsx'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [addressForm, setAddressForm] = useState({ name: '', line1: '', city: '', country: '', phone: '' })

  useEffect(() => {
    if (!user) return
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetchOrders()
        if (mounted) setOrders(res.orders || [])
        if (mounted) {
          const addrRes = await fetchAddresses()
          setAddresses(addrRes.addresses || [])
        }
      } catch (err) {
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [user])

  if (!user) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-neutral-600">Please sign in to view your profile and orders.</p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-neutral-600">Signed in as {user.email}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
          onClick={() => {
            logout()
            addToast('Signed out')
            navigate('/')
          }}
        >
          Sign out
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Orders</h2>
        {loading && <p className="text-sm text-neutral-600">Loading orders…</p>}
        {error && <p className="text-sm text-red-600">Failed to load orders</p>}
        {orders.length === 0 && !loading && <p className="text-sm text-neutral-600">No orders yet.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <article
              key={order.id}
              className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedOrder(order)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-neutral-900">Order #{order.id.slice(0, 8)}</div>
                <div className="text-xs uppercase tracking-wide text-neutral-500">{order.status}</div>
              </div>
              <div className="text-neutral-700">Total: ₱{order.total}</div>
              {order.shipping?.shippingMethod ? (
                <div className="text-xs text-neutral-500">
                  {order.shipping.shippingMethod.label} · ₱{order.shipping.shippingMethod.fee} · {order.shipping.shippingMethod.eta}
                </div>
              ) : null}
              {order.shipping?.promoCode ? (
                <div className="text-xs text-emerald-700">Promo: {order.shipping.promoCode}</div>
              ) : null}
              <div className="text-xs text-neutral-500">{new Date(order.createdAt || Date.now()).toLocaleString()}</div>
              {order.shipping && (
                <div className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                  <div className="font-semibold text-neutral-900">Shipping</div>
                  <div>{order.shipping.name}</div>
                  <div>{order.shipping.address}</div>
                  <div>
                    {order.shipping.city}, {order.shipping.country}
                  </div>
                  {order.shipping.paymentStatus && <div className="text-neutral-500">Payment: {order.shipping.paymentStatus}</div>}
                  {order.shipping.notes && <div className="text-neutral-500">Notes: {order.shipping.notes}</div>}
                  {(order.shipping.tax || order.shipping.shippingFee) && (
                    <div className="pt-1 text-neutral-600">
                      {order.shipping.shippingFee ? <div>Shipping fee: ₱{order.shipping.shippingFee}</div> : null}
                      {order.shipping.tax ? <div>Tax: ₱{order.shipping.tax}</div> : null}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-neutral-700">
                      {item.product?.name || item.name || 'Item'} <span className="text-neutral-400">({item.size || 'One size'})</span>
                    </span>
                    <span className="font-semibold text-neutral-900">₱{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="space-y-1 rounded-lg border border-neutral-200 p-3 text-sm">
              <div className="font-semibold text-neutral-900">{addr.name}</div>
              <div className="text-neutral-700">{addr.line1}</div>
              <div className="text-neutral-500">
                {addr.city}, {addr.country}
              </div>
              {addr.phone && <div className="text-neutral-500">Phone: {addr.phone}</div>}
              <button
                type="button"
                className="text-xs text-red-600 underline-offset-4 hover:underline"
                onClick={async () => {
                  await deleteAddress(addr.id)
                  const res = await fetchAddresses()
                  setAddresses(res.addresses || [])
                }}
              >
                Delete
              </button>
            </div>
          ))}
          <form
            className="space-y-2 rounded-lg border border-dashed border-neutral-300 p-3 text-sm"
            onSubmit={async (e) => {
              e.preventDefault()
              await addAddress(addressForm)
              const res = await fetchAddresses()
              setAddresses(res.addresses || [])
              setAddressForm({ name: '', line1: '', city: '', country: '', phone: '' })
              addToast('Address saved')
            }}
          >
            <div className="font-semibold text-neutral-900">Add address</div>
            {[
              { key: 'name', label: 'Name' },
              { key: 'line1', label: 'Address' },
              { key: 'city', label: 'City' },
              { key: 'country', label: 'Country' },
              { key: 'phone', label: 'Phone (optional)' },
            ].map((field) => (
              <label key={field.key} className="block text-xs font-semibold text-neutral-700">
                {field.label}
                <input
                  required={field.key !== 'phone'}
                  className="mt-1 w-full rounded border border-neutral-200 px-2 py-1 text-sm focus:border-neutral-900 focus:outline-none"
                  value={addressForm[field.key]}
                  onChange={(e) => setAddressForm((f) => ({ ...f, [field.key]: e.target.value }))}
                />
              </label>
            ))}
            <button
              type="submit"
              className="w-full rounded-full bg-neutral-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Save
            </button>
          </form>
        </div>
      </div>
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </section>
  )
}
