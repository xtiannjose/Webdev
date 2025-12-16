import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useProducts } from '../hooks/useProducts.js'

export function NavBar() {
  const { user, logout } = useAuth()
  const { cart, totals, updateQty, removeFromCart } = useStore()
  const { products } = useProducts()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 180)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    setShowCart(false)
    setShowSearch(false)
    setMobileSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchRef.current?.focus()
        setShowSearch(true)
        setMobileSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setShowCart(false)
        setMobileSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [mobileSearchOpen])

  const suggestions = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5)
  }, [products, debouncedSearch])

  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="border-b border-neutral-200 bg-[#E6E6FA]">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-[auto,1fr,auto] items-center px-3 py-5 md:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-3xl font-semibold tracking-tight transition hover:opacity-75" aria-label="Go to home">
            楽
          </NavLink>
        </div>

        <nav className="flex items-center justify-center gap-10 text-sm font-semibold uppercase tracking-wide">
          {[
            { to: '/men', label: 'Men' },
            { to: '/women', label: 'Women' },
            { to: '/lookbook', label: 'Lookbook' },
            { to: '/collection', label: 'Collection' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border-b border-transparent pb-1 transition hover:border-neutral-900 ${isActive ? 'border-neutral-900' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-5 text-neutral-800">
          <button
            type="button"
            className="rounded-full p-2.5 transition hover:bg-neutral-100 lg:hidden"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 1 4.9 14.32l3.39 3.39l-1.41 1.41l-3.4-3.39A8 8 0 0 1 10 2m0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12"
              />
            </svg>
          </button>
          <div className="relative hidden items-center gap-2 lg:flex">
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              placeholder="Search"
              className="w-48 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-inner focus:border-neutral-900 focus:outline-none"
              aria-label="Search products"
            />
            {showSearch && search && (
              <div className="absolute right-0 top-12 z-40 w-72 rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-xl">
                {suggestions.length === 0 && <div className="text-neutral-600">No matches. Enter to search all.</div>}
                {suggestions.map((item) => (
                  <button
                    key={item.id || item.name}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition hover:bg-neutral-50"
                    onClick={() => navigate(`/product/${item.id || ''}`)}
                  >
                    <span className="text-neutral-800">{item.name}</span>
                    <span className="text-xs text-neutral-500">₱{item.price}</span>
                  </button>
                ))}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="w-full rounded-full border border-neutral-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(search)}`)}
                  >
                    View all results
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-neutral-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-400"
                    onClick={() => {
                      setSearch('')
                      setShowSearch(false)
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
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
          <NavLink to="/profile" className="rounded-full p-2.5 transition hover:bg-neutral-100" aria-label="Profile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 12c4.97 0 9 2.24 9 5v1H3v-1c0-2.76 4.03-5 9-5"
              />
            </svg>
          </NavLink>
          <NavLink to="/wishlist" className="rounded-full p-2.5 transition hover:bg-neutral-100" aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M12 21s-6.5-4.35-9.33-8.17C.4 10.23.9 7.3 3.07 5.64A5.27 5.27 0 0 1 12 7.16a5.27 5.27 0 0 1 8.93-1.52c2.17 1.66 2.67 4.59.4 7.19C18.5 16.65 12 21 12 21"
              />
            </svg>
          </NavLink>
          <button
            type="button"
            className="relative rounded-full p-2.5 transition hover:bg-neutral-100"
            aria-label="Cart preview"
            onClick={() => setShowCart((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                fill="currentColor"
                d="M7 4h-2l-1 2H2v2h1l3.6 7.59-1.35 2.45c-.14.25-.25.54-.25.86 0 .83.67 1.5 1.5 1.5H19v-2H7.42c-.08 0-.13-.08-.09-.15L8.1 15h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.998.998 0 0 0 20 6H6.21l.94-2Z"
              />
            </svg>
            {cartTotalItems > 0 && (
              <span className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full bg-red-600 px-1 text-center text-[11px] font-semibold text-white">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 px-4 py-6" onClick={() => setMobileSearchOpen(false)}>
          <div
            className="mx-auto w-full max-w-xl translate-y-0 animate-fade-up rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-800">Search</div>
              <button
                type="button"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 space-y-3">
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="w-full rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-800 shadow-inner focus:border-neutral-900 focus:outline-none"
              />
              <div className="space-y-2 text-sm">
                {suggestions.length === 0 && search ? (
                  <div className="text-neutral-600">No matches. Try another term.</div>
                ) : null}
                {suggestions.map((item) => (
                  <button
                    key={item.id || item.name}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-left transition hover:border-neutral-300"
                    onClick={() => navigate(`/product/${item.id || ''}`)}
                  >
                    <span className="text-neutral-800">{item.name}</span>
                    <span className="text-xs text-neutral-500">₱{item.price}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="w-full rounded-full border border-neutral-900 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(search)}`)
                    setMobileSearchOpen(false)
                  }}
                >
                  View results
                </button>
                <button
                  type="button"
                  className="rounded-full border border-neutral-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-400"
                  onClick={() => setSearch('')}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 px-0 py-8 md:px-8" onClick={() => setShowCart(false)}>
          <div
            className="h-full w-full max-w-sm translate-x-0 animate-slide-in-right rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold text-neutral-900">Cart preview</div>
              <button
                type="button"
                className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100"
                onClick={() => setShowCart(false)}
                aria-label="Close cart preview"
              >
                ✕
              </button>
            </div>
            {cart.length === 0 && <p className="text-neutral-600">Your cart is empty.</p>}
            {cart.length > 0 && (
              <div className="space-y-3">
                <div className="max-h-[60vh] space-y-3 overflow-auto pr-1">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 rounded-lg border border-neutral-100 p-2">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-neutral-900">{item.name}</div>
                        <div className="text-xs text-neutral-500">{item.size || 'One size'}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <label className="text-neutral-500">Qty</label>
                          <select
                            className="rounded border border-neutral-200 px-2 py-1 text-xs focus:border-neutral-900 focus:outline-none"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, item.size, Number(e.target.value))}
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="text-red-500 transition hover:text-red-700"
                            onClick={() => removeFromCart(item.id, item.size)}
                            aria-label="Remove from cart"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-neutral-900">₱{item.price * item.qty}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm font-semibold text-neutral-900">
                  <span>Subtotal</span>
                  <span>₱{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-neutral-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
                    onClick={() => navigate('/cart')}
                  >
                    View cart
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-neutral-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
                    onClick={() => navigate('/checkout')}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
