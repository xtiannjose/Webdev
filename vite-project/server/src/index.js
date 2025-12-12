import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  addCart,
  addWishlist,
  createOrder,
  createUser,
  findUserByEmail,
  listCart,
  listOrders,
  listProducts,
  listWishlist,
  removeCart,
  removeWishlist,
  updateCart,
} from './db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
app.use(express.json())

function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
})

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const existing = await findUserByEmail(email)
  if (existing) return res.status(409).json({ error: 'User exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = await createUser(email, hash)
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const user = await findUserByEmail(email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

app.get('/api/products', async (req, res) => {
  const items = await listProducts()
  res.json(items)
})

app.get('/api/cart', async (req, res) => {
  const items = await listCart()
  res.json({ items })
})

app.post('/api/cart', requireAuth, async (req, res) => {
  const item = req.body
  if (!item?.id || !item?.name || !item?.price) return res.status(400).json({ error: 'Invalid item' })
  await addCart(item)
  const items = await listCart()
  res.json({ items })
})

app.patch('/api/cart/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { qty, size } = req.body
  await updateCart(id, size, Number(qty) || 1)
  const items = await listCart()
  res.json({ items })
})

app.delete('/api/cart/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { size } = req.query
  await removeCart(id, size)
  const items = await listCart()
  res.json({ items })
})

app.get('/api/wishlist', async (req, res) => {
  const items = await listWishlist()
  res.json({ items })
})

app.post('/api/wishlist', requireAuth, async (req, res) => {
  const item = req.body
  if (!item?.id || !item?.name) return res.status(400).json({ error: 'Invalid item' })
  await addWishlist(item)
  const items = await listWishlist()
  res.json({ items })
})

app.delete('/api/wishlist/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  await removeWishlist(id)
  const items = await listWishlist()
  res.json({ items })
})

app.post('/api/checkout', requireAuth, async (req, res) => {
  const { shipping } = req.body
  const order = await createOrder(shipping)
  res.json({ order })
})

app.get('/api/orders', requireAuth, async (req, res) => {
  const orders = await listOrders()
  res.json({ orders })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
