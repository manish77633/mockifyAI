import { useState } from 'react'
import AIModeForm from '../components/AIModeForm'
import ManualModeForm from '../components/ManualModeForm'
import SuccessCard from '../components/SuccessCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code2, Zap } from 'lucide-react'

const TABS = [
  { id: 'ai', label: 'AI Generator', icon: <Sparkles size={18} />, desc: 'Describe your schema, AI generates it.' },
  { id: 'manual', label: 'Manual JSON', icon: <Code2 size={18} />, desc: 'Paste your JSON and host it instantly.' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('ai')
  const [successResult, setSuccessResult] = useState(null)

  const handleSuccess = (result) => {
    setSuccessResult(result)
    setTimeout(() => document.getElementById('success-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">

      {/* Precision Dash Header */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-6"
        >
          <Zap size={12} fill="currentColor" /> Live Engine V2.0
        </motion.div>
        <h2 className="font-display font-black text-5xl md:text-6xl text-text mb-4 tracking-tighter">
          Architect <span className="text-accent">Endpoints.</span>
        </h2>
        <p className="text-dim text-lg font-medium max-w-xl mx-auto">
          Deploy deterministic, high-fidelity mock environments at the edge in seconds.
        </p>
      </div>

      {/* Mode Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
        {TABS.map((tab) => (
          <motion.button
            whileTap={{ scale: 0.98 }}
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSuccessResult(null) }}
            className={`glass glass-hover flex flex-col gap-5 p-8 rounded-[2rem] text-left relative overflow-hidden group ${activeTab === tab.id
                ? 'border-accent shadow-blue-glow bg-accent/5'
                : 'hover:border-accent/40 bg-white/[0.02]'
              }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeTab === tab.id ? 'bg-accent text-white border-accent shadow-glass-inner' : 'bg-surface text-muted border-border group-hover:border-accent/30'
              }`}>
              {tab.icon}
            </div>
            <div>
              <p className={`font-display font-bold text-xl mb-1 tracking-tight ${activeTab === tab.id ? 'text-accent' : 'text-text'}`}>
                {tab.label}
              </p>
              <p className="text-sm text-dim leading-relaxed font-medium">{tab.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Configuration Core */}
      <div className="glass rounded-[2.5rem] p-4 md:p-8 bg-panel border-2 border-border/10 shadow-2xl relative">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/10">
          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-accent border-accent/20">
            {TABS.find(t => t.id === activeTab)?.icon}
          </div>
          <div>
            <h3 className="font-display font-black text-sm text-text uppercase tracking-[0.2em] mb-1">Configuration</h3>
            <p className="text-xs text-dim font-bold">{activeTab === 'ai' ? 'Deterministic Llama 3.1 Synthesis' : 'Stateless Manual Schema Injection'}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'ai' ? <AIModeForm onSuccess={handleSuccess} /> : <ManualModeForm onSuccess={handleSuccess} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Success Output */}
      <div id="success-anchor" className="mt-12">
        <AnimatePresence>
          {successResult && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <SuccessCard result={successResult} onDismiss={() => setSuccessResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metrics Row */}
      <div className="mt-20 pt-12 border-t border-border/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Latency avg.', value: '12ms' },
          { label: 'Cloud Nodes', value: '24+' },
          { label: 'Uptime SLA', value: '100%' },
          { label: 'Auth Layers', value: 'JWT' },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} className="text-center group">
            <p className="font-display font-black text-accent text-3xl tracking-tighter group-hover:scale-105 transition-transform">{stat.value}</p>
            <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
