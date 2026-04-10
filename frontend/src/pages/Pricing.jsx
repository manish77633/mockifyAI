import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

let API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (window.location.hostname !== 'localhost' && API_BASE.includes('localhost')) {
  API_BASE = '/api';
}
const FEATURES_FREE = [
  '10 Endpoints',
  '1 MB payload limit',
  'AI + Manual modes',
  'Public API URLs',
]

const FEATURES_PRO = [
  'Unlimited Endpoints',
  '10 MB payload limit',
  'Everything in Free',
  'Priority AI generation',
  'Pro badge',
  '24/7 Priority Support',
]

async function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') return resolve(true)
    const existing = document.getElementById('razorpay-script')
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpgrade = async () => {
    if (!user) return navigate('/login');
    setError(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return navigate('/login');
    }

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setLoading(false);
        return setError('Failed to load Razorpay. Check your internet connection.');
      }

      const orderRes = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.message || `Server error: ${orderRes.status}`);
      }

      const { order } = await orderRes.json();
      if (!order?.id) throw new Error('Invalid order response from server.');

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SIhWJAyxviR8Fy';

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'MockifyAI',
        description: 'Pro Plan – Monthly ₹499',
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            });
            const data = await verifyRes.json();
            if (data.success) {
              alert('🎉 Payment successful! You are now a Pro user!');
              navigate('/dashboard');
              window.location.reload();
            } else {
              setError('Payment verification failed. Contact support.');
            }
          } catch (e) {
            setError('Verification error: ' + e.message);
          }
        },
        prefill: {
          name: user?.username || 'Test User',
          email: user?.email || 'test@example.com',
          contact: '9999999999',
        },
        theme: { color: '#D1FF00' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden text-text transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-acid/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-sky/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Back Link */}
      <Link to="/dashboard" className="absolute top-6 left-6 text-xs font-mono text-muted hover:text-acid flex items-center gap-1.5 transition-colors">
        ← Back to Dashboard
      </Link>

      <div className="text-center mb-16 relative z-10">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-acid border border-acid/30 bg-acid/10 px-4 py-1.5 rounded-full">
          Pick your plan
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-text mt-6 mb-4 leading-tight">
          Simple, Transparent <br className="hidden md:block" /> Scaling
        </h1>
        <p className="text-dim text-lg max-w-xl mx-auto">Start free. Upgrade when you need high-fidelity production endpoints.</p>
      </div>

      {error && (
        <div className="relative z-10 mb-8 bg-danger/10 border border-danger/20 text-danger text-sm px-6 py-4 rounded-xl max-w-lg w-full text-center">
          {error}
        </div>
      )}

      <div className="relative z-10 grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Free Tier */}
        <div className="card p-8 bg-surface border-border flex flex-col hover:border-text/10">
          <div className="mb-8">
            <h2 className="text-xl font-display font-bold text-text mb-2">Basic</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-text">₹0</span>
              <span className="text-muted font-mono">/mo</span>
            </div>
            <p className="text-dim text-sm mt-3">Perfect for side projects and local prototyping.</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {FEATURES_FREE.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-dim">
                <div className="w-5 h-5 rounded-full bg-acid/10 border border-acid/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-acid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost w-full py-3.5 text-text font-bold"
          >
            {user ? 'Continue with Free →' : 'Get Started Free'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className="card bg-panel border-acid/30 p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-acid text-void text-[10px] font-mono font-black uppercase tracking-widest rounded-bl-xl">
            MOST POPULAR
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-display font-bold text-text mb-2">Pro Unlock</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-acid">₹499</span>
              <span className="text-muted font-mono">/mo</span>
            </div>
            <p className="text-dim text-sm mt-3">Built for professional teams needing high throughput.</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {FEATURES_PRO.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-text">
                 <div className="w-5 h-5 rounded-full bg-acid text-void flex items-center justify-center">
                  <svg className="w-3 h-3 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {f}
              </li>
            ))}
          </ul>
          {user?.isPro ? (
            <div className="w-full text-center text-acid font-display font-bold py-4 border border-acid/30 rounded-xl bg-acid/5 backdrop-blur-sm">
              ✨ Subscription Active
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-primary w-full py-4 text-lg shadow-glowLg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-void" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10"/>
                  </svg>
                  Initializing…
                </>
              ) : (
                <>Upgrade to Pro <span className="opacity-70 group-hover:translate-x-1 transition-transform">→</span></>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="text-muted text-xs mt-12 relative z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-acid" /> Secure payment via Razorpay · Cancel anytime
      </p>
    </div>
  )
}
