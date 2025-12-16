import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export function AuthPage() {
  const { signup, login, user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        addToast('Logged in')
      } else {
        await signup(email, password)
        addToast('Account created')
      }
      navigate('/')
    } catch (err) {
      addToast(err.message || 'Auth failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{user ? 'Account' : mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className="text-sm text-neutral-600">
          {user
            ? 'You are signed in.'
            : mode === 'login'
              ? 'Access your saved cart and wishlist.'
              : 'Create an account to save your cart and wishlist.'}
        </p>
      </div>

      {user ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800">
            Signed in as <span className="font-semibold">{user.email}</span>
          </div>
          <button
            type="button"
            className="w-full rounded-full border border-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-neutral-800">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-semibold text-neutral-800">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      )}

      {!user && (
        <div className="text-center text-sm text-neutral-600">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" className="font-semibold text-neutral-900 underline-offset-4 hover:underline" onClick={() => setMode('signup')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="font-semibold text-neutral-900 underline-offset-4 hover:underline" onClick={() => setMode('login')}>
                Sign in
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
