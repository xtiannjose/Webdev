export function ReturnPolicyPage() {
  const highlights = [
    { title: 'Return window', detail: '30 days from delivery for unworn, unwashed items with tags attached.' },
    { title: 'Refunds', detail: 'Original payment method or store credit issued once items are inspected.' },
    { title: 'Exclusions', detail: 'Final sale, intimate wear, and customized pieces are non-returnable.' },
  ]

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Support</p>
        <h2 className="text-3xl font-semibold">Return Policy</h2>
        <p className="max-w-3xl text-neutral-700">
          We want you to love your purchase. If it isn&apos;t quite right, here&apos;s how to start a smooth return or
          exchange.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="space-y-2 rounded-xl border border-neutral-200 p-4 shadow-sm">
            <div className="text-sm font-semibold">{item.title}</div>
            <p className="text-sm text-neutral-700">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white px-6 py-4">
          <div className="text-sm font-semibold text-neutral-900">How returns work</div>
          <p className="text-sm text-neutral-600">A quick guide to get your item back to us.</p>
        </div>
        <ol className="space-y-0.5 px-6 py-5 text-sm text-neutral-700">
          <li>1. Submit a return request with your order number and item details.</li>
          <li>2. Pack the item securely; include all accessories and original packaging.</li>
          <li>3. Attach the provided return label and drop off at the nearest courier location.</li>
          <li>4. We inspect your return within 3-5 business days of receipt.</li>
          <li>5. Refunds or exchanges are processed immediately after approval.</li>
        </ol>
      </div>

      <div className="rounded-2xl bg-neutral-950 px-6 py-10 text-center text-neutral-100">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">Need help with a return?</h3>
          <p className="text-sm text-neutral-300">
            Message us for a prepaid label or to check the status of your return.
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-3 text-sm">
          <button
            type="button"
            className="rounded-full bg-white px-5 py-2 font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow"
          >
            Start a return
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-5 py-2 font-semibold text-neutral-100 transition hover:-translate-y-0.5 hover:border-neutral-500"
          >
            Contact support
          </button>
        </div>
      </div>
    </section>
  )
}
