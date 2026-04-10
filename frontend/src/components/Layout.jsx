import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import DocsModal from './DocsModal'
import { LayoutDashboard, Compass, Activity, Terminal, LogOut, Sun, Moon, FileJson, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const LOGO_SVG = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="var(--acid)" fillOpacity="0.12"/>
    <rect x="0.5" y="0.5" width="27" height="27" rx="6.5" stroke="var(--acid)" strokeOpacity="0.3"/>
    <path d="M7 14h4l2-5 3 10 2-5h3" stroke="var(--acid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDocsOpen, setIsDocsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'API Playground', path: '/playground', icon: <Terminal size={18} /> },
    { name: 'Analytics', path: '/analytics', icon: <Activity size={18} /> },
    { name: 'Templates', path: '/templates', icon: <Compass size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-void noise-bg grid-bg relative text-text">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(209,255,0,0.06) 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(56,189,248,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-border bg-panel/40 backdrop-blur-md shrink-0 transition-colors">
          <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b border-border hover:opacity-80 transition-opacity">
            {LOGO_SVG}
            <div>
              <span className="font-display font-bold text-text text-lg tracking-tight">MockifyAI</span>
              <span className="text-acid text-xs font-mono ml-1.5 align-middle">PRO</span>
            </div>
          </Link>

          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2.5 border border-border shadow-sm">
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

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              return (
                <Link key={item.name} to={item.path} className="block w-full">
                  <motion.div
                    whileHover={{ scale: 0.98, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-acid/10 text-acid border border-acid/20 shadow-[0_0_15px_rgba(209,255,0,0.05)]' 
                        : 'text-dim hover:text-text hover:bg-surface border border-transparent'
                    }`}
                  >
                    <span className={isActive ? 'text-acid' : 'text-muted'}>{item.icon}</span>
                    <span className="font-display font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <motion.div layoutId="sidebar-active-indicator" className="absolute left-0 w-1 h-8 bg-acid rounded-r-lg" />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="p-5 border-t border-border">
            {!user?.isPro && (
              <div className="bg-gradient-to-br from-acid/10 to-sky/5 border border-acid/20 rounded-xl p-4 text-center mb-4">
                <p className="text-sm font-display font-semibold text-text mb-1">Upgrade to Pro</p>
                <p className="text-xs text-dim mb-3">Unlimited requests & models</p>
                <button onClick={() => navigate('/pricing')} className="w-full bg-acid text-void text-sm font-display font-bold py-2 rounded-lg hover:bg-acidDim shadow-glow transition-all">Go Pro →</button>
              </div>
            )}
            <button onClick={logout} className="flex items-center gap-2 text-dim hover:text-danger w-full px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-danger/10">
              <LogOut size={16} /> Ensure Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10 py-5 border-b border-border bg-panel/80 backdrop-blur-xl text-text">
            <Link to="/" className="flex items-center gap-3 lg:hidden hover:opacity-80 transition-opacity">
              {LOGO_SVG}
              <span className="font-display font-bold text-text">MockifyAI</span>
            </Link>
            <div className="hidden lg:block">
              <h1 className="font-display font-bold text-xl text-text capitalize">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-xl text-dim hover:text-acid hover:bg-acid/10 transition-all border border-transparent hover:border-acid/20">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsDocsOpen(true)} className="btn-ghost flex items-center gap-2 px-3">
                <FileJson size={16} /> <span className="hidden sm:inline">Docs</span>
              </button>
              <Link to="/pricing" className="btn-ghost flex items-center gap-2 text-warn border-warn/20 hover:border-warn/50 hover:bg-warn/10">
                <Zap size={16} /> <span className="hidden sm:inline">{user?.isPro ? 'Pro Active' : 'Upgrade'}</span>
              </Link>
            </div>
          </header>

          <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

          <div className="w-full max-w-7xl mx-auto px-4 lg:px-10 py-8 relative">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
