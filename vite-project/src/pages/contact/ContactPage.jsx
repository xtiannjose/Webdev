export function ContactPage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">Contact Us</h2>
        <p className="text-neutral-700">If you have any questions or concerns, feel free to reach out to us.</p>
      </div>

      <form className="space-y-6">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Name:</span>
          <input
            type="text"
            className="w-full rounded border border-neutral-300 px-4 py-3 focus:border-neutral-900 focus:outline-none"
            placeholder="Your name"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Email:</span>
          <input
            type="email"
            className="w-full rounded border border-neutral-300 px-4 py-3 focus:border-neutral-900 focus:outline-none"
            placeholder="name@email.com"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Message:</span>
          <textarea
            rows="5"
            className="w-full rounded border border-neutral-300 px-4 py-3 focus:border-neutral-900 focus:outline-none"
            placeholder="How can we help?"
          />
        </label>
        <div className="pt-2">
          <button
            type="button"
            className="mx-auto flex w-full justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 md:w-1/2"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl bg-neutral-950 px-6 py-10 text-center text-neutral-100">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold">Reach out to us through our socials</h3>
          <p className="text-sm text-neutral-300">
            You can also reach out via our official Instagram or TikTok page.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-900 shadow transition hover:-translate-y-0.5 hover:shadow-lg"
            aria-label="Instagram"
          >
            <Icon name="instagram" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 text-neutral-100 transition hover:-translate-y-0.5 hover:border-neutral-500"
            aria-label="TikTok"
          >
            <Icon name="tiktok" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function Icon({ name, className = '' }) {
  switch (name) {
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
          <rect width="18" height="18" x="3" y="3" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="7" r="1" fill="currentColor" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
          <path
            fill="currentColor"
            d="M15.5 6.5a3.5 3.5 0 0 0 3.5 3.5v2a5.5 5.5 0 0 1-3.5-1.2v4.2a4.5 4.5 0 1 1-4.5-4.5h.5v2h-.5a2.5 2.5 0 1 0 2.5 2.5V4h2v2.5Z"
          />
        </svg>
      )
    default:
      return null
  }
}
