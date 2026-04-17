import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, LogIn, UserPlus, ArrowRight, Sparkles } from 'lucide-react'

// ── Inline Login Form ──────────────────────────────────────────────────────────
function LoginForm({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        onSuccess?.()
        navigate('/dashboard', { replace: true })
      } else {
        setError(res.message)
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg text-xs border text-red-400 border-red-400/20 bg-red-400/5">
          {error}
        </div>
      )}
      <div>
        <label className="text-xs font-medium text-dim mb-1.5 block">Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          required className="input-base text-sm" placeholder="name@example.com"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-dim mb-1.5 block">Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          required className="input-base text-sm" placeholder="••••••••"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading
          ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in…</span>
          : <span className="flex items-center gap-2"><LogIn size={16}/> Sign In</span>
        }
      </button>
      <p className="text-center text-xs text-muted pt-1">
        New here?{' '}
        <button type="button" onClick={onSwitch} className="text-accent hover:underline font-semibold">
          Create account
        </button>
      </p>
    </form>
  )
}

// ── Inline Signup Form ─────────────────────────────────────────────────────────
function SignupForm({ onSuccess, onSwitch }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (username.length < 3) return setError('Username must be at least 3 characters.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    try {
      const res = await signup(username, email, password)
      if (res.success) {
        onSuccess?.()
        navigate('/dashboard')
      } else {
        setError(res.message)
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg text-xs border text-red-400 border-red-400/20 bg-red-400/5">
          {error}
        </div>
      )}
      <div>
        <label className="text-xs font-medium text-dim mb-1.5 block">Username</label>
        <input
          type="text" value={username} onChange={e => setUsername(e.target.value)}
          required className="input-base text-sm" placeholder="johndoe"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-dim mb-1.5 block">Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          required className="input-base text-sm" placeholder="name@example.com"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-dim mb-1.5 block">Password</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          required className="input-base text-sm" placeholder="Min. 8 characters"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading
          ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating…</span>
          : <span className="flex items-center gap-2"><Sparkles size={16}/> Create Account <ArrowRight size={14}/></span>
        }
      </button>
      <p className="text-center text-xs text-muted pt-1">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent hover:underline font-semibold">
          Sign in
        </button>
      </p>
    </form>
  )
}

// ── Main Auth Gate Modal ───────────────────────────────────────────────────────
export default function AuthGateModal({ isOpen, onClose }) {
  // 'choose' | 'login' | 'signup'
  const [view, setView] = useState('choose')

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
            className="relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--panel-color)',
              borderColor: 'var(--border-color)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-accent via-blue-400 to-accent opacity-80" />

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <Zap size={12} fill="currentColor" className="text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent">MockifyAI</span>
                </div>
                <h2 className="font-display font-black text-2xl text-text tracking-tight mb-2">
                  {view === 'choose' && 'Get Started'}
                  {view === 'login' && 'Welcome Back'}
                  {view === 'signup' && 'Create Account'}
                </h2>
                <p className="text-sm text-dim">
                  {view === 'choose' && 'Sign in or create an account to build mock APIs.'}
                  {view === 'login' && 'Sign in to continue to your workspace.'}
                  {view === 'signup' && 'Join MockifyAI and start building in seconds.'}
                </p>
              </div>

              {/* Choice View */}
              <AnimatePresence mode="wait">
                {view === 'choose' && (
                  <motion.div
                    key="choose"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-3"
                  >
                    {/* New User Card */}
                    <button
                      onClick={() => setView('signup')}
                      className="w-full group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#3B82F6'
                        e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.05)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-color)'
                        e.currentTarget.style.backgroundColor = 'var(--surface-color)'
                      }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <UserPlus size={20} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-bold text-text text-base mb-0.5">I'm new here</p>
                        <p className="text-xs text-dim">Create a free account and start building mock APIs</p>
                      </div>
                      <ArrowRight size={16} className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* Existing User Card */}
                    <button
                      onClick={() => setView('login')}
                      className="w-full group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#3B82F6'
                        e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.05)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-color)'
                        e.currentTarget.style.backgroundColor = 'var(--surface-color)'
                      }}
                    >
                      <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)' }}>
                        <LogIn size={20} className="text-dim group-hover:text-accent transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-bold text-text text-base mb-0.5">I already have an account</p>
                        <p className="text-xs text-dim">Sign in and continue where you left off</p>
                      </div>
                      <ArrowRight size={16} className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </button>

                    <p className="text-center text-[11px] text-muted pt-2">
                      Free plan includes 10 endpoints · No credit card required
                    </p>
                  </motion.div>
                )}

                {view === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <LoginForm onSuccess={onClose} onSwitch={() => setView('signup')} />
                    <button
                      onClick={() => setView('choose')}
                      className="mt-4 w-full text-xs text-muted hover:text-dim transition-colors text-center"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}

                {view === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <SignupForm onSuccess={onClose} onSwitch={() => setView('login')} />
                    <button
                      onClick={() => setView('choose')}
                      className="mt-4 w-full text-xs text-muted hover:text-dim transition-colors text-center"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
