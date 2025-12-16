import { Link } from 'react-router-dom'

export function Footer() {
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { label: 'Men', to: '/men' },
        { label: 'Women', to: '/women' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', to: '/support' },
        { label: 'Contact', to: '/contact' },
        { label: 'Return Policy', to: '/returns' },
        { label: 'About', to: '/about' },
      ],
    },
  ]

  const socialLinks = [
    { label: 'Instagram', to: '/', icon: 'instagram' },
    { label: 'TikTok', to: '/', icon: 'tiktok' },
    { label: 'Lazada', to: '/', icon: 'lazada' },
    { label: 'Shoppee', to: '/', icon: 'shoppee' },
  ]

  return (
    <footer className="border-t border-neutral-200 bg-[#E6E6FA]">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-3 py-12 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 text-sm md:grid-cols-3">
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-3">
              <div className="font-semibold">{column.title}</div>
              <div className="flex flex-col gap-2 text-xs text-neutral-600">
                {column.links.map((link) => (
                  <Link key={link.label} to={link.to} className="flex items-center gap-2 text-left transition hover:text-neutral-900">
                    {link.icon && <Icon name={link.icon} className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-3 text-center md:text-left">
            <div className="font-semibold md:text-left">Connect</div>
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-full border border-neutral-200 p-2 text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900"
                  aria-label={link.label}
                >
                  <Icon name={link.icon} className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 text-[11px] text-neutral-500 md:flex-row md:items-center">
          <span>© 2025 All rights reserved</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/terms" className="transition hover:text-neutral-900">
              Terms &amp; Condition
            </Link>
            <span aria-hidden className="text-neutral-300">•</span>
            <Link to="/privacy" className="transition hover:text-neutral-900">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Icon({ name, className = '' }) {
  const common = 'stroke-current'
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
            className={common}
            fill="currentColor"
            d="M15.5 6.5a3.5 3.5 0 0 0 3.5 3.5v2a5.5 5.5 0 0 1-3.5-1.2v4.2a4.5 4.5 0 1 1-4.5-4.5h.5v2h-.5a2.5 2.5 0 1 0 2.5 2.5V4h2v2.5Z"
          />
        </svg>
      )
    case 'lazada':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
          <path
            className={common}
            fill="currentColor"
            d="M12 4 5 7.5v9L12 20l7-3.5v-9Zm-5 4.27 5-2.5 5 2.5v5.96l-5 2.5-5-2.5Z"
          />
        </svg>
      )
    case 'shoppee':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
          <path
            className={common}
            fill="currentColor"
            d="M16.5 9.5V8A4.5 4.5 0 0 0 12 3.5 4.5 4.5 0 0 0 7.5 8v1.5H5V20h14V9.5Zm-7 0V8a2.5 2.5 0 0 1 5 0v1.5Zm1.2 6.5c-.9 0-1.7-.4-2.24-1l1.03-.96c.23.27.66.46 1.01.46.4 0 .73-.2.73-.54 0-.3-.2-.45-.7-.57l-.7-.18c-.97-.26-1.46-.87-1.46-1.66 0-.99.86-1.75 2.03-1.75.82 0 1.53.32 2.04.9l-.97.92c-.24-.24-.53-.38-.88-.38-.34 0-.6.18-.6.48 0 .26.2.4.67.52l.68.18c.99.27 1.52.87 1.52 1.72 0 1.04-.87 1.84-2.16 1.84Z"
          />
        </svg>
      )
    default:
      return null
  }
}
