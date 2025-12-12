export function OrderDetailModal({ order, onClose }) {
  if (!order) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="text-base font-semibold">Order #{order.id?.slice(0, 8)}</div>
          <button
            type="button"
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-neutral-800">
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="font-semibold uppercase text-neutral-700">{order.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="font-semibold text-neutral-900">₱{order.total}</span>
          </div>
          {order.shipping && (
            <div className="rounded-lg bg-neutral-50 px-3 py-2">
              <div className="text-xs font-semibold uppercase text-neutral-500">Shipping</div>
              <div>{order.shipping.name}</div>
              <div>{order.shipping.address}</div>
              <div>
                {order.shipping.city}, {order.shipping.country}
              </div>
              {order.shipping.notes && <div className="text-neutral-500">Notes: {order.shipping.notes}</div>}
              {(order.shipping.shippingFee || order.shipping.tax) && (
                <div className="pt-1 text-neutral-600">
                  {order.shipping.shippingFee ? <div>Shipping fee: ₱{order.shipping.shippingFee}</div> : null}
                  {order.shipping.tax ? <div>Tax: ₱{order.shipping.tax}</div> : null}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase text-neutral-500">Items</div>
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-neutral-900">{item.product?.name || item.name || 'Item'}</div>
                  <div className="text-xs text-neutral-500">Size: {item.size || 'One size'}</div>
                </div>
                <div className="text-sm font-semibold text-neutral-900">₱{item.price * item.qty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
