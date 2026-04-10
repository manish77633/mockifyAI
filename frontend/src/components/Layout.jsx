import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import DocsModal from './DocsModal'
import { LayoutDashboard, Compass, Activity, Terminal, LogOut, Sun, Moon, FileJson, Zap, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeBackground from './ThreeBackground'

const LOGO_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isDocsOpen, setIsDocsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={14} /> },
    { name: 'Analytics', path: '/analytics', icon: <Activity size={14} /> },
    { name: 'Templates', path: '/templates', icon: <Compass size={14} /> },
    { name: 'Playground', path: '/playground', icon: <Terminal size={14} /> },
  ]

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-500 bg-void">

      {/* ── Background Layer (Z-0) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ThreeBackground />
      </div>

      {/* ── Noise Overlay Layer (Z-1) ── */}
      <div className="noise-overlay fixed inset-0 z-[1] pointer-events-none opacity-[0.03]" />

      {/* ── Global Navbar (Z-100) ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-14 glass rounded-full flex items-center px-4 z-[100] shadow-2xl border border-white/5">
        <Link to="/" className="flex items-center gap-2 px-2 shrink-0 hover:opacity-80 transition-all">
          {LOGO_SVG}
          <span className="font-display font-black text-sm tracking-tighter hidden md:block text-text">MockifyAI</span>
        </Link>

        <div className="h-6 w-[1px] bg-border/50 mx-1 md:mx-4" />

        <div className="flex-1 flex justify-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link key={item.name} to={item.path} className="relative px-2 md:px-3 py-1.5 rounded-full transition-all group shrink-0">
                <span className={`relative z-10 font-display font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 ${isActive ? 'text-accent' : 'text-muted hover:text-text'
                  }`}>
                  <span className="md:hidden">{item.icon}</span>
                  <span className="hidden md:inline">{item.name}</span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="pill-nav-active"
                    className="absolute inset-0 bg-accent/5 border border-accent/20 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="h-6 w-[1px] bg-border/50 mx-1 md:mx-4" />

        <div className="flex items-center gap-3 px-2">
          <button onClick={toggleTheme} className="p-2 rounded-full text-muted hover:text-text hover:bg-white/5 transition-all">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-3 p-1 rounded-full border border-border bg-white/5 hover:border-accent/40 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent">
                  {user.username?.[0].toUpperCase()}
                </div>
                <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-60 bg-[#12141c] border border-white/20 p-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-top-right z-[101]"
                  >
                    <div className="px-3.5 py-2 border-b border-white/10">
                      <p className="text-[10px] text-accent uppercase font-black tracking-widest mb-1">Account</p>
                      <p className="text-sm font-bold text-white truncate">{user.username}</p>
                    </div>
                    <div className="py-2">
                      <button onClick={() => { setIsDocsOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <FileJson size={16} className="text-accent/60" /> Documentation
                      </button>
                      <Link to="/pricing" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs text-accent font-bold hover:bg-accent/5 rounded-xl transition-all">
                        <Zap size={16} /> Upgrade Plan
                      </Link>
                      <div className="h-[1px] bg-white/10 my-2 mx-2" />
                      <button onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-6 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] opacity-40">Precision Data Forcing Engine</p>
      </footer>
    </div>
  )
}
