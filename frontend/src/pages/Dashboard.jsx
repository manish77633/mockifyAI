import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import AIModeForm from '../components/AIModeForm'
import ManualModeForm from '../components/ManualModeForm'
import SuccessCard from '../components/SuccessCard'
import EndpointsList from '../components/EndpointsList'
import DocsModal from '../components/DocsModal'

const LOGO_SVG = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="var(--acid)" fillOpacity="0.12"/>
    <rect x="0.5" y="0.5" width="27" height="27" rx="6.5" stroke="var(--acid)" strokeOpacity="0.3"/>
    <path d="M7 14h4l2-5 3 10 2-5h3" stroke="var(--acid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SUN_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
)

const MOON_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const TABS = [
  {
    id: 'ai',
    label: 'AI Generator',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.05 3.05l2.12 2.12M10.83 10.83l2.12 2.12M10.83 5.17l2.12-2.12M3.05 12.95l2.12-2.12"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    description: 'Describe your data, Gemini generates it.',
  },
  {
    id: 'manual',
    label: 'Manual JSON',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M5 4l-3 4 3 4M11 4l3 4-3 4M9 2l-2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    description: 'Paste your own JSON and host it instantly.',
  },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ai')
  const [successResult, setSuccessResult] = useState(null)
  const [refreshList, setRefreshList] = useState(0)
  const [isDocsOpen, setIsDocsOpen] = useState(false)

  const handleSuccess = (result) => {
    setSuccessResult(result)
    setRefreshList((n) => n + 1)
    // Scroll to result
    setTimeout(() => {
      document.getElementById('success-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-void noise-bg grid-bg relative">
      {/* Gradient radial glow top-left */}
      <div className="fixed top-0 left-0 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(56,189,248,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex min-h-screen">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-border bg-surface/40 backdrop-blur-sm shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            {LOGO_SVG}
            <div>
              <span className="font-display font-bold text-bright text-lg tracking-tight">MockifyAI</span>
              <span className="text-acid text-xs font-mono ml-1.5 align-middle">beta</span>
            </div>
          </div>

          {/* User badge */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3 bg-panel rounded-xl px-3 py-2.5 border border-border">
              <div className="w-8 h-8 rounded-full bg-acid/20 border border-acid/30 flex items-center
                              justify-center font-display font-bold text-acid text-sm shrink-0 uppercase">
                {user?.username?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-semibold text-text truncate">{user?.username}</p>
                <p className="text-xs text-muted">
                  {user?.isPro ? 'Pro plan' : 'Free plan'} · {user?.endpointCount || 0}/{user?.maxEndpoints || 10}
                </p>
              </div>
            </div>
          </div>

          {/* Endpoints list */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted">
                Your endpoints
              </span>
            </div>
            <EndpointsList refresh={refreshList} />
          </div>

          {/* Upgrade CTA */}
          <div className="p-5 border-t border-border">
            <div className="bg-gradient-to-br from-acid/10 to-sky/5 border border-acid/20
                            rounded-xl p-4 text-center">
              <p className="text-sm font-display font-semibold text-text mb-1">Upgrade to Pro</p>
              <p className="text-xs text-dim mb-3">10MB payloads · 100 endpoints</p>
              <button 
                onClick={() => navigate('/pricing')}
                className="w-full bg-acid text-void text-sm font-display font-bold
                                   py-2 rounded-lg hover:bg-acidDim transition-colors"
              >
                Go Pro →
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {/* Top nav */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10 py-4
                             border-b border-border bg-void/80 backdrop-blur-md">
            <div className="flex items-center gap-3 lg:hidden">
              {LOGO_SVG}
              <span className="font-display font-bold text-bright">MockifyAI</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="font-display font-bold text-xl text-bright">Dashboard</h1>
              <p className="text-xs text-muted mt-0.5">Build mock APIs in seconds</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <button 
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg text-dim hover:text-acid hover:bg-acid/10 transition-all border border-transparent hover:border-acid/20"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? SUN_SVG : MOON_SVG}
              </button>
              <button 
                onClick={() => setIsDocsOpen(true)}
                className="btn-ghost flex items-center gap-1.5 px-1.5 sm:px-3"
                title="Docs"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h12M2 8h8M2 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="hidden sm:inline">Docs</span>
              </button>
              <Link to="/pricing"
                className="btn-ghost flex items-center gap-1.5 text-warn/80 border-warn/20 hover:border-warn/40 hover:text-warn px-1.5 sm:px-3"
                title="Upgrade"
              >
                ⚡ <span className="hidden sm:inline">{user?.isPro ? 'Pro ✓' : 'Upgrade'}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-xs font-medium text-dim hover:text-danger hover:bg-danger/10 px-2 sm:px-3 py-2 rounded-lg transition-all border border-transparent hover:border-danger/20"
                title="Sign Out"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden text-[10px] uppercase">Exit</span>
              </button>
            </div>
          </header>

          <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

          {/* Content */}
          <div className="max-w-2xl mx-auto px-5 lg:px-8 py-8">

            {/* Page heading */}
            <div className="mb-8 animate-fade-up">
              <h2 className="font-display font-bold text-3xl text-bright mb-2">
                Create a mock endpoint
              </h2>
              <p className="text-dim text-base">
                Choose a mode, configure your data, and get a live REST URL instantly.
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-7 animate-fade-up" style={{ animationDelay: '0.05s', animationFillMode: 'both', opacity: 0 }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSuccessResult(null) }}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left
                    transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-acid/8 border-acid/35 shadow-glow'
                      : 'bg-panel border-border hover:border-subtle'
                    }`}
                >
                  <span className={`mt-0.5 p-2 rounded-lg border transition-colors
                    ${activeTab === tab.id
                      ? 'bg-acid/15 text-acid border-acid/25'
                      : 'bg-surface text-muted border-border'
                    }`}>
                    {tab.icon}
                  </span>
                  <div>
                    <p className={`font-display font-semibold text-sm mb-0.5 transition-colors
                      ${activeTab === tab.id ? 'text-acid' : 'text-text'}`}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-muted leading-relaxed">{tab.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Form Card */}
            <div
              className="card p-6 animate-fade-up"
              style={{ animationDelay: '0.1s', animationFillMode: 'both', opacity: 0 }}
            >
              {/* Card header */}
              <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-border">
                <div className={`p-1.5 rounded-lg border
                  ${activeTab === 'ai'
                    ? 'bg-acid/15 text-acid border-acid/25'
                    : 'bg-ember/15 text-ember border-ember/25'
                  }`}>
                  {TABS.find(t => t.id === activeTab)?.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-text text-sm">
                    {activeTab === 'ai' ? 'AI Generator' : 'Manual JSON Upload'}
                  </h3>
                  <p className="text-xs text-muted">
                    {activeTab === 'ai'
                      ? 'Powered by Google Gemini 1.5 Flash'
                      : 'Paste any valid JSON array or object'}
                  </p>
                </div>
              </div>

              {activeTab === 'ai'
                ? <AIModeForm onSuccess={handleSuccess} />
                : <ManualModeForm onSuccess={handleSuccess} />
              }
            </div>

            {/* Success card */}
            <div id="success-anchor">
              {successResult && (
                <SuccessCard
                  result={successResult}
                  onDismiss={() => setSuccessResult(null)}
                />
              )}
            </div>

            {/* Info strip */}
            <div className="mt-8 grid grid-cols-3 gap-3 animate-fade-up"
              style={{ animationDelay: '0.15s', animationFillMode: 'both', opacity: 0 }}>
              {[
                { label: 'Avg response', value: '<10ms' },
                { label: 'Free endpoints', value: '10' },
                { label: 'Rate limit', value: '60/min' },
              ].map((stat) => (
                <div key={stat.label} className="card px-4 py-3 text-center">
                  <p className="font-display font-bold text-acid text-lg">{stat.value}</p>
                  <p className="text-xs text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
