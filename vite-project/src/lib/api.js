const API_URL = import.meta.env.VITE_API_URL

function getAuthHeaders() {
  if (typeof localStorage === 'undefined') return {}
  const raw = localStorage.getItem('raku-auth')
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.token) return { Authorization: `Bearer ${parsed.token}` }
  } catch {
    return {}
  }
  return {}
}

async function request(path, options = {}) {
  if (!API_URL) throw new Error('API_URL not configured')
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export async function fetchCart() {
  return request('/api/cart')
}

export async function addCartItem(item) {
  return request('/api/cart', { method: 'POST', body: JSON.stringify(item) })
}

export async function updateCartItem(id, size, qty) {
  return request(`/api/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ qty, size }) })
}

export async function removeCartItem(id, size) {
  const query = size ? `?size=${encodeURIComponent(size)}` : ''
  return request(`/api/cart/${id}${query}`, { method: 'DELETE' })
}

export async function fetchWishlist() {
  return request('/api/wishlist')
}

export async function addWishlistItem(item) {
  return request('/api/wishlist', { method: 'POST', body: JSON.stringify(item) })
}

export async function removeWishlistItem(id) {
  return request(`/api/wishlist/${id}`, { method: 'DELETE' })
}

export async function fetchProducts() {
  return request('/api/products')
}

export async function checkout(shipping) {
  return request('/api/checkout', { method: 'POST', body: JSON.stringify({ shipping }) })
}

export async function fetchOrders() {
  return request('/api/orders')
}
