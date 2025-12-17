import { useLocation, useNavigate } from 'react-router-dom'

export function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  if (!order) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Order confirmation</h1>
        <p className="text-sm text-neutral-600">No order found. View your orders in your profile.</p>
        <button
          type="button"
          className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
          onClick={() => navigate('/profile')}
        >
          Go to Profile
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Order placed</h1>
        <p className="text-sm text-neutral-600">Thank you! We emailed a confirmation (stub) for order #{order.id?.slice(0, 8)}.</p>
      </div>

      <div className="space-y-3">
        <div className="font-semibold text-neutral-900">Items</div>
        <div className="space-y-2 text-sm">
          {(order.items || []).map((item) => (
            <div key={item.id || item.name} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
              <div className="space-y-1">
                <div className="font-semibold text-neutral-900">{item.name}</div>
                <div className="text-xs text-neutral-500">
                  {item.size || 'One size'} · Qty {item.qty}
                </div>
              </div>
              <div className="text-sm font-semibold text-neutral-900">₱{item.price * item.qty}</div>
            </div>
          ))}
        </div>
      </div>

      {order.shipping && (
        <div className="space-y-2">
          <div className="font-semibold text-neutral-900">Shipping</div>
          <div className="rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700">
            <div className="font-semibold text-neutral-900">{order.shipping.name}</div>
            <div>{order.shipping.address}</div>
            <div>
              {order.shipping.city}, {order.shipping.country}
            </div>
            {order.shipping.shippingMethod && (
              <div className="text-xs text-neutral-500">
                Method: {order.shipping.shippingMethod.label} ({order.shipping.shippingMethod.eta}) · ₱{order.shipping.shippingMethod.fee}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-700">Subtotal</span>
          <span className="font-semibold text-neutral-900">₱{(order.shipping?.subtotal || 0).toFixed?.(2) || ''}</span>
        </div>
        {order.shipping?.discount ? (
          <div className="flex items-center justify-between text-emerald-700">
            <span>Discount</span>
            <span>-₱{order.shipping.discount.toFixed?.(2) || order.shipping.discount}</span>
          </div>
        ) : null}
        {order.shipping?.tax ? (
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Tax</span>
            <span className="font-semibold text-neutral-900">₱{order.shipping.tax.toFixed?.(2) || order.shipping.tax}</span>
          </div>
        ) : null}
        {order.shipping?.shippingFee ? (
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Shipping</span>
            <span className="font-semibold text-neutral-900">₱{order.shipping.shippingFee.toFixed?.(2) || order.shipping.shippingFee}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
          <span>Total</span>
          <span>₱{order.total}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
          onClick={() => navigate('/profile')}
        >
          View orders
        </button>
        <button
          type="button"
          className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-300"
          onClick={() => navigate('/')}
        >
          Continue shopping
        </button>
      </div>
    </section>
  )
}
