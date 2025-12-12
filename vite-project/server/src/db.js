import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
}

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

export async function createOrder(shipping) {
  const client = await getPrisma()
  if (client) {
    const items = await client.cartItem.findMany({ include: { product: true } })
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.product.price, 0)
    const shippingFee = shipping?.shippingFee ?? 0
    const tax = shipping?.tax ?? 0
    const total = subtotal + shippingFee + tax
    const order = await client.order.create({
      data: {
        total,
        status: 'paid',
        shipping: shipping || null,
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
  const total = subtotal + shippingFee + tax
  const order = {
    id: crypto.randomUUID(),
    total,
    status: 'paid',
    shipping: shipping || null,
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
