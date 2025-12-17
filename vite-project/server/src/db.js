import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'node:crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const productsPath = path.join(__dirname, 'data', 'products.json')
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))

let prisma = null
async function getPrisma() {
  if (prisma !== null) return prisma
  try {
    const { PrismaClient } = await import('@prisma/client')
    prisma = new PrismaClient()
    return prisma
  } catch (err) {
    console.warn('Prisma not available, using in-memory store', err.message)
    prisma = false
    return null
  }
}

let memory = {
  cart: [],
  wishlist: [],
  orders: [],
  users: [],
  addresses: {},
}
const shippingMethods = [
  { id: 'standard', label: 'Standard', eta: '3-5 business days', fee: 120 },
  { id: 'express', label: 'Express', eta: '1-2 business days', fee: 220 },
  { id: 'pickup', label: 'Click & Collect', eta: 'Ready in 24 hours', fee: 0 },
]
const promoCodes = [
  { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 500 },
  { code: 'SHIPFREE', type: 'shipping', value: 120, minSubtotal: 800 },
]

export async function listProducts() {
  const client = await getPrisma()
  if (client) return client.product.findMany()
  return productsData
}

export async function listCart() {
  const client = await getPrisma()
  if (client) return client.cartItem.findMany({ include: { product: true } })
  return memory.cart
}

export async function addCart(item) {
  const client = await getPrisma()
  if (client) {
    const existing = await client.cartItem.findFirst({ where: { productId: item.id, size: item.size || undefined } })
    if (existing) {
      return client.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + (item.qty || 1) },
      })
    }
    return client.cartItem.create({
      data: {
        productId: item.id,
        qty: item.qty || 1,
        size: item.size,
        color: item.color,
      },
    })
  }
  const existing = memory.cart.find((p) => p.id === item.id && p.size === item.size)
  if (existing) {
    existing.qty += item.qty || 1
  } else {
    memory.cart.push({ ...item, qty: item.qty || 1 })
  }
  return memory.cart
}

export async function updateCart(id, size, qty) {
  const client = await getPrisma()
  if (client) {
    const found = await client.cartItem.findFirst({ where: { productId: id, size: size || undefined } })
    if (!found) return
    return client.cartItem.update({ where: { id: found.id }, data: { qty } })
  }
  memory.cart = memory.cart.map((item) => (item.id === id && item.size === size ? { ...item, qty } : item))
  return memory.cart
}

export async function removeCart(id, size) {
  const client = await getPrisma()
  if (client) {
    const found = await client.cartItem.findFirst({ where: { productId: id, size: size || undefined } })
    if (found) {
      await client.cartItem.delete({ where: { id: found.id } })
    }
    return
  }
  memory.cart = memory.cart.filter((p) => !(p.id === id && (size ? p.size === size : true)))
  return memory.cart
}

export async function listWishlist() {
  const client = await getPrisma()
  if (client) return client.wishlistItem.findMany({ include: { product: true } })
  return memory.wishlist
}

export async function addWishlist(item) {
  const client = await getPrisma()
  if (client) {
    const existing = await client.wishlistItem.findFirst({ where: { productId: item.id } })
    if (existing) return existing
    return client.wishlistItem.create({
      data: {
        productId: item.id,
      },
    })
  }
  if (!memory.wishlist.find((w) => w.id === item.id)) {
    memory.wishlist.push(item)
  }
  return memory.wishlist
}

export async function removeWishlist(id) {
  const client = await getPrisma()
  if (client) {
    const existing = await client.wishlistItem.findFirst({ where: { productId: id } })
    if (existing) await client.wishlistItem.delete({ where: { id: existing.id } })
    return
  }
  memory.wishlist = memory.wishlist.filter((w) => w.id !== id)
  return memory.wishlist
}

export async function createOrder(shipping, userId = null) {
  const client = await getPrisma()
  if (client) {
    const items = await client.cartItem.findMany({ include: { product: true } })
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.product.price, 0)
    const shippingFee = shipping?.shippingFee ?? 0
    const tax = shipping?.tax ?? 0
    const discount = shipping?.discount ?? 0
    const total = subtotal + shippingFee + tax - discount
    const order = await client.order.create({
      data: {
        total,
        userId: userId || undefined,
        status: 'pending',
        paymentStatus: shipping?.paymentStatus || 'pending',
        paymentIntentId: shipping?.paymentIntentId,
        promoCode: shipping?.promoCode,
        discount,
        shippingMethod: shipping?.shippingMethod || null,
        shipping: { ...shipping, subtotal },
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            price: i.product.price,
            size: i.size,
            color: i.color,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })
    await client.cartItem.deleteMany({})
    return order
  }
  const subtotal = memory.cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shippingFee = shipping?.shippingFee ?? 0
  const tax = shipping?.tax ?? 0
  const discount = shipping?.discount ?? 0
  const total = subtotal + shippingFee + tax - discount
  const order = {
    id: crypto.randomUUID(),
    total,
    userId,
    status: 'pending',
    paymentStatus: shipping?.paymentStatus || 'pending',
    paymentIntentId: shipping?.paymentIntentId,
    promoCode: shipping?.promoCode,
    discount,
    shippingMethod: shipping?.shippingMethod || null,
    shipping: { ...shipping, subtotal },
    items: memory.cart.map((i) => ({ ...i })),
    createdAt: new Date().toISOString(),
  }
  memory.orders.push(order)
  memory.cart = []
  return order
}

export async function listOrders() {
  const client = await getPrisma()
  if (client) {
    return client.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } })
  }
  return memory.orders
}

export async function updatePaymentStatus(paymentIntentId, status) {
  if (!paymentIntentId) return null
  const client = await getPrisma()
  if (client) {
    const order = await client.order.findFirst({ where: { paymentIntentId } })
    if (!order) return null
    return client.order.update({ where: { id: order.id }, data: { paymentStatus: status, status: status === 'succeeded' ? 'paid' : status } })
  }
  const order = memory.orders.find((o) => o.paymentIntentId === paymentIntentId)
  if (order) {
    order.paymentStatus = status
    order.status = status === 'succeeded' ? 'paid' : status
  }
  return order
}

export async function createUser(email, passwordHash) {
  const client = await getPrisma()
  if (client) {
    return client.user.create({ data: { email, password: passwordHash } })
  }
  const exists = memory.users.find((u) => u.email === email)
  if (exists) throw new Error('User exists')
  const user = { id: crypto.randomUUID(), email, password: passwordHash }
  memory.users.push(user)
  return user
}

export async function findUserByEmail(email) {
  const client = await getPrisma()
  if (client) return client.user.findUnique({ where: { email } })
  return memory.users.find((u) => u.email === email) || null
}

export async function listAddresses(userId) {
  if (!userId) return []
  const client = await getPrisma()
  if (client) {
    return client.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  }
  return memory.addresses[userId] || []
}

export async function addAddress(userId, address) {
  if (!userId) return null
  const client = await getPrisma()
  if (client) {
    return client.address.create({ data: { userId, ...address } })
  }
  const entry = { id: crypto.randomUUID(), ...address }
  if (!memory.addresses[userId]) memory.addresses[userId] = []
  memory.addresses[userId].push(entry)
  return entry
}

export async function deleteAddress(userId, id) {
  if (!userId || !id) return
  const client = await getPrisma()
  if (client) {
    return client.address.delete({ where: { id } })
  }
  memory.addresses[userId] = (memory.addresses[userId] || []).filter((a) => a.id !== id)
}

export function listShippingMethods() {
  return shippingMethods
}

export function validatePromo(code, subtotal) {
  if (!code) return null
  const found = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase())
  if (!found) return null
  if (found.minSubtotal && subtotal < found.minSubtotal) return null
  return found
}
