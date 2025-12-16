import { useNavigate } from 'react-router-dom'

const shippingOptions = [
  { title: 'Metro Manila', detail: '2-3 business days via partner couriers.' },
  { title: 'Luzon (outside Metro)', detail: '3-5 business days depending on destination.' },
  { title: 'Visayas & Mindanao', detail: '5-7 business days; remote areas may take longer.' },
  { title: 'International', detail: '10-14 business days; customs duties and taxes may apply.' },
]

export function ShippingInfoPage() {
  const navigate = useNavigate()
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Support</p>
        <h1 className="text-3xl font-semibold">Shipping Information</h1>
        <p className="max-w-3xl text-neutral-700">
          Learn how we ship your orders, estimated timelines, and what to expect once you check out.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {shippingOptions.map((item) => (
          <article key={item.title} className="space-y-2 rounded-xl border border-neutral-200 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900">{item.title}</h2>
            <p className="text-sm text-neutral-700">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl bg-neutral-950 px-6 py-8 text-neutral-50">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Tracking and updates</h3>
          <p className="text-sm text-neutral-300">
            We’ll email tracking within 24 hours of dispatch. Need help updating your address or holding a package?
            Message us and we’ll assist.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            className="rounded-full bg-white px-5 py-2 font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow"
            onClick={() => navigate('/contact')}
          >
            Track my order
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-5 py-2 font-semibold text-neutral-50 transition hover:-translate-y-0.5 hover:border-neutral-500"
            onClick={() => navigate('/contact')}
          >
            Contact support
          </button>
        </div>
      </div>
    </section>
  )
}
