import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from './NavBar.jsx'
import { Footer } from './Footer.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { setOG } from '../lib/og.js'

const TITLES = {
  '/': 'Home',
  '/men': 'Men',
  '/men/page-2': 'Men — Page 2',
  '/women': 'Women',
  '/lookbook': 'Lookbook',
  '/collection': 'Collection',
  '/product': 'Product',
  '/contact': 'Contact',
  '/about': 'About',
  '/support': 'Support',
  '/returns': 'Returns',
  '/terms': 'Terms',
  '/shipping': 'Shipping',
  '/privacy': 'Privacy',
  '/wishlist': 'Wishlist',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/profile': 'Profile',
  '/auth': 'Sign in',
  '/search': 'Search',
}

export function Layout() {
  const { toasts } = useToast()
  const location = useLocation()
  const pathKey = location.pathname.startsWith('/product') ? '/product' : location.pathname

  useEffect(() => {
    const title = TITLES[pathKey] ?? 'Home'
    const desc =
      pathKey === '/product'
        ? 'Shop detailed product views, colors, and sizes.'
        : pathKey === '/men'
          ? 'Menswear drops—tees, hoodies, and essentials.'
          : pathKey === '/women'
            ? 'Womenswear curation—dresses, tops, and layers.'
            : pathKey === '/search'
              ? 'Search Raku apparel by name, tag, and more.'
              : 'Raku apparel — curated mens and womenswear drops, lookbook, collections, and seamless shopping.'
    document.title = `Raku — ${title}`
    const existing = document.querySelector('meta[name="description"]')
    if (existing) {
      existing.setAttribute('content', desc)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = desc
      document.head.appendChild(meta)
    }
    setOG({ title: `Raku — ${title}`, description: desc, image: '/vite.svg', url: window.location.href })
  }, [pathKey])

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavBar />
      <main className="fade-up mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-3 pb-20 pt-10 md:px-8 lg:px-10">
        <Outlet />
      </main>
      <Footer />
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-sm rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
