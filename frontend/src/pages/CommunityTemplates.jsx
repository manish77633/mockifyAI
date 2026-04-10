import { useState } from 'react'
import { Search, Copy, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const TEMPLATES = [
  { id: 1, title: 'E-Commerce Products', category: 'Store', code: `[\n  {\n    "id": 1,\n    "name": "Wireless Headphones",\n    "price": 99.99,\n    "stock": 45,\n    "category": "Electronics"\n  }\n]` },
  { id: 2, title: 'User Profiles', category: 'Auth', code: `[\n  {\n    "uuid": "u-49f2",\n    "username": "alex_dev",\n    "email": "alex@example.com",\n    "role": "admin",\n    "isActive": true\n  }\n]` },
  { id: 3, title: 'Crypto Ticker', category: 'Finance', code: `[\n  {\n    "symbol": "BTC-USD",\n    "price_24h": 64200.50,\n    "volume": "1.2B",\n    "change_pct": "+2.4%"\n  }\n]` },
  { id: 4, title: 'Blog Posts', category: 'Content', code: `[\n  {\n    "postId": 101,\n    "title": "React 19 Features Explained",\n    "authorId": 42,\n    "published": "2024-05-12"\n  }\n]` },
  { id: 5, title: 'Real Estate Listings', category: 'Marketplace', code: `[\n  {\n    "propertyId": "pid_882",\n    "price": 450000,\n    "bedrooms": 3,\n    "bathrooms": 2,\n    "sqft": 2100\n  }\n]` },
  { id: 6, title: 'SaaS Subscriptions', category: 'Billing', code: `[\n  {\n    "planId": "pro_monthly",\n    "userId": "u_991",\n    "status": "active",\n    "billingCycle": "monthly",\n    "amount": 29.99\n  }\n]` },
]

export default function CommunityTemplates() {
  const [copiedId, setCopiedId] = useState(null)
  const [search, setSearch] = useState('')

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = TEMPLATES.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display font-bold text-3xl text-text mb-2 tracking-tight">Community Templates</h2>
          <p className="text-dim text-base">Kickstart your mock API with these pre-built JSON schemas.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-10 bg-surface border-border focus:border-acid"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            key={tpl.id} 
            className="card bg-panel border-border overflow-hidden flex flex-col group"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
              <h3 className="font-display font-semibold text-text">{tpl.title}</h3>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-acid/10 text-acid rounded border border-acid/20">{tpl.category}</span>
            </div>
            <div className="p-4 flex-1 bg-[#0A0A0A] relative">
              <pre className="text-xs text-slate-300 font-mono leading-relaxed overflow-hidden">
                {tpl.code}
              </pre>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
            </div>
            <div className="p-4 border-t border-border bg-surface flex justify-between items-center">
              <span className="text-xs text-muted">Ready to deploy</span>
              <button 
                onClick={() => handleCopy(tpl.id, tpl.code)}
                className="btn-ghost flex items-center gap-1.5 py-1.5 px-3 text-xs"
              >
                {copiedId === tpl.id ? <><CheckCircle2 size={14} className="text-acid" /> Copied</> : <><Copy size={14} /> Copy Schema</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
         <div className="py-20 text-center text-muted">No templates matching "{search}" found.</div>
      )}
    </div>
  )
}
