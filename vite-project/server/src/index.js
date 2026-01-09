import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  addCart,
  addWishlist,
  createOrder,
  createUser,
  findUserByEmail,
  listAddresses,
  listCart,
  listOrders,
  listProducts,
  listShippingMethods,
  listWishlist,
  removeCart,
  addAddress,
  deleteAddress,
  removeWishlist,
  updateCart,
  validatePromo,
  updatePaymentStatus,
} from './db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'
const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-secret')
if (!jwtSecret) {
  throw new Error('JWT_SECRET must be set in production')
}
const stripeSecret = process.env.STRIPE_SECRET
const stripe = stripeSecret ? new Stripe(stripeSecret) : null
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

app.use(cors({ origin: CORS_ORIGIN, credentials: CORS_ORIGIN !== '*' }))
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))
app.use(express.json())

function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, jwtSecret)
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
  const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const user = await findUserByEmail(email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

app.get('/api/products', async (req, res) => {
  const items = await listProducts()
  res.json(items)
})

app.get('/api/cart', requireAuth, async (req, res) => {
  const items = await listCart(req.user.sub)
  res.json({ items })
})

app.post('/api/cart', requireAuth, async (req, res) => {
  const item = req.body
  if (!item?.id || !item?.name || !item?.price) return res.status(400).json({ error: 'Invalid item' })
  await addCart(req.user.sub, item)
  const items = await listCart(req.user.sub)
  res.json({ items })
})

app.patch('/api/cart/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { qty, size } = req.body
  await updateCart(req.user.sub, id, size, Number(qty) || 1)
  const items = await listCart(req.user.sub)
  res.json({ items })
})

app.delete('/api/cart/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { size } = req.query
  await removeCart(req.user.sub, id, size)
  const items = await listCart(req.user.sub)
  res.json({ items })
})

app.get('/api/wishlist', requireAuth, async (req, res) => {
  const items = await listWishlist(req.user.sub)
  res.json({ items })
})

app.post('/api/wishlist', requireAuth, async (req, res) => {
  const item = req.body
  if (!item?.id || !item?.name) return res.status(400).json({ error: 'Invalid item' })
  await addWishlist(req.user.sub, item)
  const items = await listWishlist(req.user.sub)
  res.json({ items })
})

app.delete('/api/wishlist/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  await removeWishlist(req.user.sub, id)
  const items = await listWishlist(req.user.sub)
  res.json({ items })
})

app.get('/api/shipping-methods', (req, res) => {
  res.json({ methods: listShippingMethods() })
})

app.post('/api/promo/validate', (req, res) => {
  const { code, subtotal } = req.body
  const result = validatePromo(code, Number(subtotal) || 0)
  if (!result) return res.status(400).json({ error: 'Invalid promo code' })
  res.json({ promo: result })
})

app.get('/api/addresses', requireAuth, async (req, res) => {
  const addresses = await listAddresses(req.user.sub)
  res.json({ addresses })
})

app.post('/api/addresses', requireAuth, async (req, res) => {
  const { name, line1, city, country, phone } = req.body
  if (!name || !line1) return res.status(400).json({ error: 'Name and address are required' })
  const address = await addAddress(req.user.sub, { name, line1, city, country, phone })
  const addresses = await listAddresses(req.user.sub)
  res.json({ address, addresses })
})

app.delete('/api/addresses/:id', requireAuth, async (req, res) => {
  await deleteAddress(req.user.sub, req.params.id)
  const addresses = await listAddresses(req.user.sub)
  res.json({ addresses })
})

app.post('/api/payments/intent', requireAuth, async (req, res) => {
  try {
    const { amount, currency = 'php' } = req.body
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
    if (stripe) {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(Number(amount) * 100),
        currency,
        payment_method_types: ['card'],
        metadata: { userId: req.user.sub },
      })
      return res.json({ clientSecret: intent.client_secret })
    }
    return res.json({ clientSecret: 'test_client_secret_stub' })
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Payment intent failed' })
  }
})

app.post('/api/checkout', requireAuth, async (req, res) => {
  const { shipping, paymentIntentId } = req.body
  const order = await createOrder({ ...shipping, paymentIntentId }, req.user.sub)
  console.log('Stub email: order confirmation for', order.id)
  res.json({ order })
})

app.get('/api/orders', requireAuth, async (req, res) => {
  const orders = await listOrders(req.user.sub)
  res.json({ orders })
})

app.post('/api/webhooks/stripe', async (req, res) => {
  if (!stripe || !stripeWebhookSecret) return res.status(200).json({ received: true })
  const sig = req.headers['stripe-signature']
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret)
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object
      await updatePaymentStatus(pi.id, 'succeeded')
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object
      await updatePaymentStatus(pi.id, 'payment_failed')
    }
    res.json({ received: true })
  } catch (err) {
    console.error('Webhook error', err.message)
    res.status(400).send(`Webhook error: ${err.message}`)
  }
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
