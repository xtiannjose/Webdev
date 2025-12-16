import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const faqs = (actions) => [
  {
    q: 'Shipping information',
    a: 'Domestic orders arrive in 2-5 business days; international in 10-14 days.',
    action: { label: 'View shipping details', onClick: actions.goShipping },
  },
  {
    q: 'Return information',
    a: 'Return unworn items within 30 days for a full refund.',
    action: { label: 'Go to return policy', onClick: actions.goReturns },
  },
  {
    q: 'Sizing help',
    a: 'Check our standard PH sizing chart for tops and bottoms.',
    action: { label: 'Open size guide', onClick: actions.openSizeGuide },
  },
  {
    q: 'Payment options',
    a: 'We accept major credit/debit cards, GCash, Maya, and Cash on Delivery (selected areas).',
  },
  {
    q: 'Order inquiries',
    a: 'Need help with an order? Message our support team and we’ll reply within 24 hours.',
    action: { label: 'Contact support', onClick: actions.goContact },
  },
]

const sizeGuide = [
  { size: 'XS', chest: '32-33 in', waist: '25-26 in', hips: '35-36 in' },
  { size: 'S', chest: '34-35 in', waist: '27-28 in', hips: '37-38 in' },
  { size: 'M', chest: '36-38 in', waist: '29-31 in', hips: '39-41 in' },
  { size: 'L', chest: '39-41 in', waist: '32-34 in', hips: '42-44 in' },
  { size: 'XL', chest: '42-44 in', waist: '35-37 in', hips: '45-47 in' },
]

export function SupportPage() {
  const navigate = useNavigate()
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const faqItems = faqs({
    goShipping: () => navigate('/shipping'),
    goReturns: () => navigate('/returns'),
    openSizeGuide: () => setShowSizeGuide(true),
    goContact: () => navigate('/contact'),
  })

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Support</h2>
        <p className="text-neutral-700">FAQs, accessibility details, and the fastest ways to reach us.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {faqItems.map((item) => (
          <div key={item.q} className="space-y-3 rounded-lg border border-neutral-200 p-4">
            <div className="font-semibold">{item.q}</div>
            <p className="text-sm text-neutral-700">{item.a}</p>
            {item.action && (
              <button
                type="button"
                className="text-xs font-semibold text-neutral-900 underline underline-offset-4 transition hover:opacity-80"
                onClick={item.action.onClick}
              >
                {item.action.label}
              </button>
            )}
          </div>
        ))}
        <div className="space-y-3 rounded-lg bg-neutral-50 p-4 shadow-sm md:col-span-2">
          <div className="font-semibold">Accessibility</div>
          <p className="text-sm text-neutral-700">
            We design with inclusive sizing, clean typography, strong color contrast, and keyboard-friendly navigation.
            Need assistance? Email care@raku.co for personalized support.
          </p>
        </div>
      </div>

      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Standard PH Size Guide</h3>
              <button
                type="button"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Close size guide"
                onClick={() => setShowSizeGuide(false)}
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-700">Measurements are body measurements; choose the closest range.</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
              <div className="grid grid-cols-4 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase text-neutral-600">
                <span>Size</span>
                <span>Chest</span>
                <span>Waist</span>
                <span>Hips</span>
              </div>
              <div className="divide-y divide-neutral-200 text-sm text-neutral-800">
                {sizeGuide.map((row) => (
                  <div key={row.size} className="grid grid-cols-4 px-3 py-2">
                    <span className="font-semibold">{row.size}</span>
                    <span>{row.chest}</span>
                    <span>{row.waist}</span>
                    <span>{row.hips}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3 text-sm">
              <button
                type="button"
                className="rounded-full border border-neutral-200 px-4 py-2 font-semibold text-neutral-800 transition hover:border-neutral-300"
                onClick={() => setShowSizeGuide(false)}
              >
                Close
              </button>
              <button
                type="button"
              className="rounded-full bg-neutral-900 px-4 py-2 font-semibold text-white transition hover:bg-neutral-800"
              onClick={() => {
                setShowSizeGuide(false)
                navigate('/contact')
              }}
            >
              Ask for sizing help
            </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
