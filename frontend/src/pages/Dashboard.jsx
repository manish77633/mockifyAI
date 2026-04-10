import { useState } from 'react'
import AIModeForm from '../components/AIModeForm'
import ManualModeForm from '../components/ManualModeForm'
import SuccessCard from '../components/SuccessCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code2 } from 'lucide-react'

const TABS = [
  { id: 'ai', label: 'AI Generator', icon: <Sparkles size={18} />, desc: 'Describe your data, AI generates it.' },
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-text mb-2 tracking-tight">Create a mock endpoint</h2>
        <p className="text-dim text-base">Choose a mode, configure your payload, and get a live REST URL instantly.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {TABS.map((tab) => (
          <motion.button
            whileTap={{ scale: 0.98 }}
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSuccessResult(null) }}
            className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-acid/10 border-acid/40 shadow-glow'
                : 'bg-surface border-border hover:border-acid/20 hover:bg-subtle'
            }`}
          >
            <span className={`p-2 rounded-lg border transition-colors ${
              activeTab === tab.id ? 'bg-acid/20 text-acid border-acid/30' : 'bg-void text-muted border-border'
            }`}>
              {tab.icon}
            </span>
            <div>
              <p className={`font-display font-semibold text-sm mb-1 ${activeTab === tab.id ? 'text-acid' : 'text-text'}`}>
                {tab.label}
              </p>
              <p className="text-xs text-muted leading-relaxed">{tab.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="card p-6 border-border bg-surface shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
          <div className="p-2 rounded-lg border bg-acid/10 text-acid border-acid/20">
            {TABS.find(t => t.id === activeTab)?.icon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-text">{activeTab === 'ai' ? 'AI Auto-Generation' : 'Manual Upload'}</h3>
            <p className="text-xs text-muted">{activeTab === 'ai' ? 'Powered by Meta Llama 3.1 70B' : 'Standard JSON Schema via body insertion'}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'ai' ? <AIModeForm onSuccess={handleSuccess} /> : <ManualModeForm onSuccess={handleSuccess} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div id="success-anchor" className="mt-8">
        <AnimatePresence>
          {successResult && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <SuccessCard result={successResult} onDismiss={() => setSuccessResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4">
        {[
          { label: 'Avg response time', value: '<15ms' },
          { label: 'Global Edge nodes', value: '14' },
          { label: 'Uptime SLA', value: '99.9%' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="card px-5 py-4 text-center border border-border/50 bg-subtle/30">
            <p className="font-display font-bold text-acid text-xl">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
