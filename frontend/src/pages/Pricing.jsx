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

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ReplaceWithYourKeyId';

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
          email: 'test.user@mockifyai.com', // Generic test email
          contact: '9999999999', // Dummy number
        },
        readonly: {
          contact: true,
          email: true,
        },
        theme: { color: '#00FF88' },
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
    <div className="min-h-screen bg-[#080A0F] relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-acid/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-sky/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to dashboard */}
      <Link to="/dashboard" className="absolute top-6 left-6 text-xs font-mono text-muted hover:text-dim flex items-center gap-1.5 transition-colors">
        ← Dashboard
      </Link>

      <div className="text-center mb-12 relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-acid border border-acid/20 bg-acid/5 px-3 py-1 rounded-full">Pricing</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-bright mt-4 mb-3">
          Simple, Transparent Pricing
        </h1>
        <p className="text-dim text-lg max-w-xl mx-auto">Start free. Upgrade when you need more power.</p>
      </div>

      {error && (
        <div className="relative z-10 mb-6 bg-danger/10 border border-danger/30 text-danger text-sm px-5 py-3 rounded-xl max-w-lg w-full text-center">
          {error}
        </div>
      )}

      <div className="relative z-10 grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Free Tier */}
        <div className="bg-[#141820] border border-[#1E2433] rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-bright mb-1">Free</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-bright">₹0</span>
              <span className="text-muted font-mono">/mo</span>
            </div>
            <p className="text-dim text-sm mt-2">Perfect for side projects and prototyping.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {FEATURES_FREE.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-dim">
                <svg className="w-4 h-4 text-acid shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full border border-[#1E2433] text-dim hover:text-text hover:border-[#252D3D] py-3 rounded-xl font-display font-semibold transition-all"
          >
            {user ? 'Go to Dashboard →' : 'Get Started Free'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className="relative bg-gradient-to-b from-[#1a1f2e] to-[#141820] border border-acid/30 rounded-2xl p-8 flex flex-col shadow-[0_0_40px_rgba(0,255,136,0.1)]">
          <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest bg-acid text-void px-2.5 py-1 rounded-full font-bold">
            POPULAR
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-bright mb-1">Pro</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-acid">₹499</span>
              <span className="text-muted font-mono">/mo</span>
            </div>
            <p className="text-dim text-sm mt-2">For developers who need unlimited power.</p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {FEATURES_PRO.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-text">
                <svg className="w-4 h-4 text-acid shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          {user?.isPro ? (
            <div className="w-full text-center text-acid font-display font-bold py-3 border border-acid/30 rounded-xl bg-acid/5">
              ✓ You are already Pro!
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-acid text-void font-display font-bold py-3.5 rounded-xl hover:bg-[#00CC6A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20"/>
                  </svg>
                  Opening Razorpay…
                </>
              ) : 'Upgrade to Pro →'}
            </button>
          )}
        </div>
      </div>

      <p className="text-muted text-xs mt-10 relative z-10">
        Payments handled securely by Razorpay · Cancel anytime
      </p>
    </div>
  )
}
