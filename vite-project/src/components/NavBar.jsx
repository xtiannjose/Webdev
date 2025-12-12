import { useAuth } from '../context/AuthContext.jsx'

export function NavBar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth()
  return (
    <header className="border-b border-neutral-200 bg-[#E6E6FA]">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-[auto,1fr,auto] items-center px-3 py-5 md:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-3xl font-semibold tracking-tight transition hover:opacity-75"
            aria-label="Go to home"
          >
            楽
          </button>
        </div>

        <nav className="flex items-center justify-center gap-10 text-sm font-semibold uppercase tracking-wide">
          {[
            { key: 'men', label: 'Men' },
            { key: 'women', label: 'Women' },
            { key: 'lookbook', label: 'Lookbook' },
            { key: 'collection', label: 'Collection' },
          ].map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => onNavigate(link.key)}
              className={`border-b border-transparent pb-1 transition hover:border-neutral-900 ${currentPage === link.key ? 'border-neutral-900' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-5 text-neutral-800">
          {user && (
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-900 md:flex"
              onClick={logout}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </span>
              Sign out
            </button>
          )}
          <button
            type="button"
            className="rounded-full p-2.5 transition hover:bg-neutral-100"
            aria-label="Profile"
            onClick={() => onNavigate('auth')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 12c4.97 0 9 2.24 9 5v1H3v-1c0-2.76 4.03-5 9-5"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-full p-2.5 transition hover:bg-neutral-100"
            aria-label="Wishlist"
            onClick={() => onNavigate('wishlist')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M12 21s-6.5-4.35-9.33-8.17C.4 10.23.9 7.3 3.07 5.64A5.27 5.27 0 0 1 12 7.16a5.27 5.27 0 0 1 8.93-1.52c2.17 1.66 2.67 4.59.4 7.19C18.5 16.65 12 21 12 21"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-full p-2.5 transition hover:bg-neutral-100"
            aria-label="Cart"
            onClick={() => onNavigate('cart')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M7 4h-2l-1 2H2v2h1l3.6 7.59-1.35 2.45c-.14.25-.25.54-.25.86 0 .83.67 1.5 1.5 1.5H19v-2H7.42c-.08 0-.13-.08-.09-.15L8.1 15h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.998.998 0 0 0 20 6H6.21l.94-2Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
