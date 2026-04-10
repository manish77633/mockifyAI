import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Terminal, Layers, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const DUMMY_JSON = [
  '{',
  '  "id": "e30f1-b92...",',
  '  "method": "GET",',
  '  "status": 200,',
  '  "payload": {',
  '    "user": "alex_neo",',
  '    "token": "sys_993...",',
  '    "active": true',
  '  }',
  '}',
]

export default function LandingPage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, -100])
  const y2 = useTransform(scrollY, [0, 1000], [0, -250])
  const [terminalLines, setTerminalLines] = useState([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < DUMMY_JSON.length) {
        setTerminalLines(prev => [...prev, DUMMY_JSON[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-void text-text overflow-hidden noise-bg relative">
      {/* Mesh and Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-acid/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-sky/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-40 mix-blend-overlay pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="var(--acid)" fillOpacity="0.12"/>
            <rect x="0.5" y="0.5" width="27" height="27" rx="6.5" stroke="var(--acid)" strokeOpacity="0.3"/>
            <path d="M7 14h4l2-5 3 10 2-5h3" stroke="var(--acid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-display font-bold text-xl text-text">MockifyAI</span>
        </Link>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="font-medium text-dim hover:text-text transition-colors text-sm">Login</Link>
              <Link to="/signup" className="btn-primary flex items-center gap-2">
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn-primary flex items-center gap-2">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 text-center max-w-7xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-acid/30 bg-acid/5 mb-8">
            <Zap size={14} className="text-acid" />
            <span className="text-xs font-mono text-acid font-medium uppercase tracking-wider">Powered by Nvidia NIM Llama 3</span>
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-6 shadow-glow">
            Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-acid to-acidDim">Mock APIs</span><br />
            in nanoseconds.
          </h1>

          <p className="text-dim text-lg md:text-xl max-w-2xl mb-10 font-body">
            Describe your necessary data shape and our AI models will generate production-ready REST endpoints instantly. High performance edge delivery completely free.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/signup" className="btn-primary shadow-glowLg flex items-center gap-2 px-8 py-4 text-lg">
              Start Building <ArrowRight size={18} />
            </Link>
            <Link to="/docs" className="btn-ghost flex items-center gap-2 px-8 py-4 text-lg backdrop-blur-md">
              <Terminal size={18} /> Read Docs
            </Link>
          </div>
        </motion.div>

        {/* 3D Dashboard Mockup Presentation */}
        <div className="w-full mt-24 relative perspective-1000">
          <motion.div 
            style={{ y: y1, rotateX: 15 }}
            className="w-full max-w-5xl mx-auto rounded-xl border border-border bg-surface shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="h-12 w-full bg-panel border-b border-border flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-danger/80" />
              <div className="w-3 h-3 rounded-full bg-warn/80" />
              <div className="w-3 h-3 rounded-full bg-acid/80" />
            </div>
            <div className="flex h-[400px]">
              <div className="w-64 border-r border-border bg-panel p-4">
                 <div className="w-full h-8 bg-subtle rounded-md mb-2" />
                 <div className="w-3/4 h-8 bg-subtle rounded-md" />
              </div>
              <div className="flex-1 bg-void p-6 font-mono text-sm text-acid/80 leading-relaxed overflow-hidden">
                <span className="text-dim mb-4 block">// Generation initializing via edge runtime...</span>
                {terminalLines.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{line}</motion.div>
                ))}
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block w-2 h-4 bg-acid ml-2 align-middle" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
