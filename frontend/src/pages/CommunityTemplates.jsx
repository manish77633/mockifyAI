import { useState } from 'react'
import { Search, Copy, CheckCircle2, ArrowUpRight, Box } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const TEMPLATES = [
  { id: 1, title: 'E-Commerce Products', category: 'Store', code: `[\n  {\n    "id": 1,\n    "name": "Wireless Headphones",\n    "price": 99.99,\n    "stock": 45,\n    "category": "Electronics"\n  }\n]` },
  { id: 2, title: 'User Profiles', category: 'Auth', code: `[\n  {\n    "uuid": "u-49f2",\n    "username": "alex_dev",\n    "email": "alex@example.com",\n    "role": "admin",\n    "isActive": true\n  }\n]` },
  { id: 3, title: 'Crypto Ticker', category: 'Finance', code: `[\n  {\n    "symbol": "BTC-USD",\n    "price_24h": 64200.50,\n    "volume": "1.2B",\n    "change_pct": "+2.4%"\n  }\n]` },
  { id: 4, title: 'Blog Posts', category: 'Content', code: `[\n  {\n    "postId": 101,\n    "title": "React 19 Features Explained",\n    "authorId": 42,\n    "published": "2024-05-12"\n  }\n]` },
  { id: 5, title: 'Real Estate Listings', category: 'Marketplace', code: `[\n  {\n    "propertyId": "pid_882",\n    "price": 450000,\n    "bedrooms": 3,\n    "bathrooms": 2,\n    "sqft": 2100\n  }\n]` },
  { id: 6, title: 'SaaS Subscriptions', category: 'Billing', code: `[\n  {\n    "planId": "pro_monthly",\n    "userId": "u_991",\n    "status": "active",\n    "billingCycle": "monthly",\n    "amount": 29.99\n  }\n]` },
]

export default function CommunityTemplates() {
  const { user } = useAuth()
  const [copiedId, setCopiedId] = useState(null)
  const [search, setSearch] = useState('')

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = TEMPLATES.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto py-12">
      
      {/* Precision Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 px-4">
        <div className="max-w-2xl px-2">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-accent mb-4"
          >
            <Box size={18} fill="currentColor" className="opacity-40" />
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em]">Resource Blueprints</span>
          </motion.div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-text tracking-tighter mb-6 leading-[0.9]">
            Industrial <span className="text-accent">Schemas.</span>
          </h2>
          <p className="text-dim text-lg font-medium leading-relaxed max-w-xl">
            Pre-built JSON architectures for high-frequency load testing and reliable frontend integration.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-12 h-12 bg-white/5 border-border focus:border-accent shadow-xl font-bold"
          />
        </div>
      </div>

      {/* Glass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-2 md:px-4">
        {filtered.map((tpl, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05, duration: 0.5 }}
            key={tpl.id} 
            className="glass glass-hover p-1 rounded-[2rem] flex flex-col group h-full"
          >
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  {tpl.category}
                </span>
                <ArrowUpRight size={18} className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="font-display font-black text-2xl text-text tracking-tighter leading-snug">
                {tpl.title}
              </h3>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="grow rounded-2xl bg-panel border border-border/10 p-5 relative overflow-hidden group-hover:border-accent/10 transition-colors">
                <pre className="text-[11px] text-dim font-mono leading-relaxed overflow-hidden group-hover:text-text transition-colors">
                  {tpl.code}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-void/10 to-transparent pointer-events-none opacity-40" />
              </div>
            </div>

            <div className="p-6 pt-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-muted">Edge Ready</span>
              <button 
                onClick={() => handleCopy(tpl.id, tpl.code)}
                className={`flex items-center gap-2 py-2 px-5 rounded-xl font-bold transition-all duration-300
                  ${copiedId === tpl.id 
                    ? 'bg-accent text-white shadow-blue-glow' 
                    : 'bg-white/5 border border-border text-muted hover:text-text hover:border-accent/40 hover:bg-white/10'
                  }`}
              >
                {copiedId === tpl.id ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy Source</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-40 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-border flex items-center justify-center mx-auto mb-6">
            <Search className="text-muted" size={24} />
          </div>
          <p className="text-xl font-display font-black text-text tracking-tighter mb-2">No results found</p>
          <p className="text-muted text-sm font-medium">Try different blueprint keywords.</p>
        </div>
      )}
    </div>
  )
}
