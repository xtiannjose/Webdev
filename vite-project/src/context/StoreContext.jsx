import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addCartItem,
  addWishlistItem,
  fetchCart,
  fetchWishlist,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
} from '../lib/api.js'
import { useToast } from './ToastContext.jsx'
import { logEvent, logError } from '../lib/events.js'

const StoreContext = createContext(null)

const STORAGE_KEY = 'raku-store'

function loadState() {
  if (typeof localStorage === 'undefined') return { cart: [], wishlist: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { cart: [], wishlist: [] }
    const parsed = JSON.parse(raw)
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
    }
  } catch {
    return { cart: [], wishlist: [] }
  }
}

function saveState(state) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => loadState().cart)
  const [wishlist, setWishlist] = useState(() => loadState().wishlist)
  const apiEnabled = Boolean(import.meta.env.VITE_API_URL)
  const { addToast } = useToast()

  useEffect(() => {
    saveState({ cart, wishlist })
  }, [cart, wishlist])

  useEffect(() => {
    if (!apiEnabled) return
    ;(async () => {
      try {
        const cartRes = await fetchCart()
        const wishRes = await fetchWishlist()
        setCart(cartRes.items || [])
        setWishlist(wishRes.items || [])
      } catch (err) {
        logError('api_fetch_failed', err)
        console.warn('API fetch failed, using local state', err)
      }
    })()
  }, [apiEnabled])

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id && p.size === item.size)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id && p.size === item.size ? { ...p, qty: p.qty + item.qty } : p
        )
      }
      return [...prev, item]
    })
    addToast(`Added ${item.name} (${item.size || ''}) to cart`, 'info')
    logEvent('add_to_cart', { id: item.id, name: item.name, qty: item.qty })
    if (apiEnabled) {
      addCartItem(item).catch((err) => {
        logError('api_add_cart_failed', err)
        console.warn('API add cart failed', err)
      })
    }
  }

  const updateQty = (id, size, qty) => {
    setCart((prev) => prev.map((item) => (item.id === id && item.size === size ? { ...item, qty } : item)))
    logEvent('update_qty', { id, qty })
    if (apiEnabled)
      updateCartItem(id, size, qty).catch((err) => {
        logError('api_update_cart_failed', err)
        console.warn('API update cart failed', err)
      })
  }

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
    addToast('Removed item from cart', 'info')
    logEvent('remove_from_cart', { id })
    if (apiEnabled)
      removeCartItem(id, size).catch((err) => {
        logError('api_remove_cart_failed', err)
        console.warn('API remove cart failed', err)
      })
  }

  const moveToWishlist = (item) => {
    setWishlist((prev) => {
      if (prev.find((w) => w.id === item.id)) return prev
      return [...prev, { id: item.id, name: item.name, price: item.price, image: item.image, tag: item.tag }]
    })
    removeFromCart(item.id, item.size)
    addToast(`Moved ${item.name} to wishlist`, 'info')
    logEvent('move_to_wishlist', { id: item.id })
    if (apiEnabled)
      addWishlistItem(item).catch((err) => {
        logError('api_add_wishlist_failed', err)
        console.warn('API add wishlist failed', err)
      })
  }

  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      if (prev.find((w) => w.id === item.id)) {
        if (apiEnabled) removeWishlistItem(item.id).catch((err) => console.warn('API remove wishlist failed', err))
        addToast('Removed from wishlist', 'info')
        return prev.filter((w) => w.id !== item.id)
      }
      if (apiEnabled) addWishlistItem(item).catch((err) => console.warn('API add wishlist failed', err))
      addToast('Saved to wishlist', 'info')
      logEvent('save_wishlist', { id: item.id })
      return [...prev, item]
    })
  }

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const shipping = cart.length ? 120 : 0
    const total = subtotal + shipping
    return { subtotal, shipping, total }
  }, [cart])

  const value = {
    cart,
    wishlist,
    addToCart,
    updateQty,
    removeFromCart,
    moveToWishlist,
    toggleWishlist,
    totals,
    apiEnabled,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return ctx
}
