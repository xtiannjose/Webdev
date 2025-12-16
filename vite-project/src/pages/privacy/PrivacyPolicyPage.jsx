import { useNavigate } from 'react-router-dom'

const sections = [
  {
    title: 'Data we collect',
    body: 'Contact info, order details, device data, and site usage needed to fulfill orders and improve experience.',
  },
  {
    title: 'How we use it',
    body: 'To process purchases, provide support, personalize recommendations, and prevent fraud.',
  },
  {
    title: 'Sharing',
    body: 'Shared only with trusted partners (payment, logistics, analytics) required to deliver the service.',
  },
  {
    title: 'Security',
    body: 'We use encryption in transit, limited access controls, and regular reviews to protect your data.',
  },
  {
    title: 'Your choices',
    body: 'You can request access, correction, or deletion of personal data, and opt out of marketing.',
  },
  {
    title: 'Cookies',
    body: 'Used for sign-in, cart persistence, and analytics. Adjust your browser settings to manage cookies.',
  },
]

export function PrivacyPolicyPage() {
  const navigate = useNavigate()
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Legal</p>
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="max-w-3xl text-neutral-700">
          We respect your privacy and handle your data with care. Here&apos;s a clear view of what we collect and how it
          is used.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((item) => (
          <article key={item.title} className="space-y-2 rounded-xl border border-neutral-200 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900">{item.title}</h2>
            <p className="text-sm text-neutral-700">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl bg-neutral-950 px-6 py-8 text-neutral-50">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Need to manage your data?</h3>
          <p className="text-sm text-neutral-300">
            Submit a request to access, update, or delete your information. We respond within 3 business days.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            className="rounded-full bg-white px-5 py-2 font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow"
            onClick={() => navigate('/contact')}
          >
            Contact support
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-5 py-2 font-semibold text-neutral-50 transition hover:-translate-y-0.5 hover:border-neutral-500"
            onClick={() => navigate('/terms')}
          >
            View terms
          </button>
        </div>
      </div>
    </section>
  )
}
