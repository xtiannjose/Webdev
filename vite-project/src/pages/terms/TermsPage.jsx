const sections = [
  {
    title: 'Use of the site',
    body: 'By browsing or purchasing, you agree to use this site for lawful purposes only and follow all posted policies.',
  },
  {
    title: 'Orders & payments',
    body: 'Prices and availability may change. We reserve the right to cancel or refund orders in case of errors or fraud.',
  },
  {
    title: 'Shipping & delivery',
    body: 'Transit times are estimates. Delays caused by carriers or customs are outside our control, but we’ll help where possible.',
  },
  {
    title: 'Returns & exchanges',
    body: 'Eligible items can be returned within 30 days. See our Return Policy page for full details on exclusions and steps.',
  },
  {
    title: 'Privacy',
    body: 'We collect only what’s needed to serve you and protect your data with industry-standard safeguards.',
  },
  {
    title: 'Intellectual property',
    body: 'All content, branding, and designs are owned by RAKU and may not be reused without permission.',
  },
  {
    title: 'Liability',
    body: 'To the fullest extent permitted by law, RAKU is not liable for indirect or consequential damages from site use.',
  },
  {
    title: 'Changes',
    body: 'We may update these terms at any time. Continued use after updates means you accept the revised terms.',
  },
]

export function TermsPage({ onNavigate }) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Legal</p>
        <h1 className="text-3xl font-semibold">Terms &amp; Conditions</h1>
        <p className="max-w-3xl text-neutral-700">
          Please read these terms carefully before using our site or making a purchase. By continuing, you accept these
          conditions.
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
          <h3 className="text-xl font-semibold">Questions about these terms?</h3>
          <p className="text-sm text-neutral-300">
            Reach out to our support team and we&apos;ll clarify anything before you order.
          </p>
        </div>
        <div className="mt-6 flex gap-3 text-sm">
          <button
            type="button"
            className="rounded-full bg-white px-5 py-2 font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:shadow"
            onClick={() => onNavigate?.('contact')}
          >
            Contact support
          </button>
          <button
            type="button"
            className="rounded-full border border-neutral-700 px-5 py-2 font-semibold text-neutral-50 transition hover:-translate-y-0.5 hover:border-neutral-500"
            onClick={() => onNavigate?.('returns')}
          >
            View return policy
          </button>
        </div>
      </div>
    </section>
  )
}
