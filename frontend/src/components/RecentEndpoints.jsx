import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, CheckCircle2, ChevronDown, ChevronUp, Clock, Trash2, Zap, Code2 } from 'lucide-react'
import SuccessCard from './SuccessCard'
import { listEndpoints, deleteEndpoint as deleteEndpointApi, getEndpointDetail } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

// ─── Time formatter ───────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function getLiveUrl(username, endpoint) {
  let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  if (rawApiUrl && !rawApiUrl.endsWith('/api')) {
    if (rawApiUrl.endsWith('/')) rawApiUrl += 'api';
    else rawApiUrl += '/api';
  }
  const base = rawApiUrl.replace(/\/api$/, '')
  return `${base}/api/mock/${username}/${endpoint}`
}

// ─── Single card ─────────────────────────────────────────────────────────────
function EndpointCard({ item, onRemove }) {
  const [copied,   setCopied]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [fullResult, setFullResult] = useState(null)
  const [loadingPayload, setLoadingPayload] = useState(false)

  const liveUrl = item.liveUrl || getLiveUrl(item.username, item.endpoint)

  const handleCopy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(liveUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove(item._id)
  }

  const toggleExpand = async () => {
    if (!expanded) {
      if (!fullResult && !item.payload) {
        setLoadingPayload(true)
        try {
          const res = await getEndpointDetail(item._id)
          setFullResult({
            ...item,
            liveUrl,
            payload: res.data.data.payload
          })
        } catch (err) {
          console.error('Failed to load payload', err)
        } finally {
          setLoadingPayload(false)
        }
      } else if (item.payload && !fullResult) {
        setFullResult({ ...item, liveUrl })
      }
      setExpanded(true)
    } else {
      setExpanded(false)
    }
  }

  const modeLabel   = item.mode === 'ai' ? 'AI' : 'Manual'
  const ModeIcon    = item.mode === 'ai' ? Zap : Code2

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      {/* ── Card Header (always visible) ── */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer group select-none"
        onClick={toggleExpand}
      >
        {/* Mode badge */}
        <span
          className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0
            ${item.mode === 'ai'
              ? 'bg-accent/10 text-accent border-accent/25'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            }`}
        >
          <ModeIcon size={10} />
          {modeLabel}
        </span>

        {/* Endpoint name */}
        <span className="font-mono text-sm text-text font-semibold flex-1 truncate">
          /{item.endpoint}
        </span>

        {/* Time */}
        <span className="flex items-center gap-1 text-[11px] text-muted shrink-0">
          <Clock size={11} />
          {timeAgo(item.createdAt || item.savedAt)}
        </span>

        {/* Copy URL button */}
        <button
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all font-mono border shadow-sm
            ${copied
              ? 'bg-acid/15 text-acid border-acid/30'
              : 'bg-surface text-muted hover:text-accent border-border hover:border-accent/40 hover:bg-accent/5'
            }`}
        >
          {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        {/* Delete */}
        <button
          onClick={handleRemove}
          className="shrink-0 p-1.5 text-muted/70 hover:text-danger transition-all rounded-md hover:bg-danger/10 border border-transparent hover:border-danger/20"
          title="Delete endpoint"
        >
          <Trash2 size={14} />
        </button>

        {/* Expand chevron */}
        <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-subtle text-muted group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {/* ── Expanded SuccessCard details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="border-t px-5 pb-5"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-color, var(--panel-color))' }}
            >
              {loadingPayload ? (
                <div className="py-8 text-center text-muted text-sm flex flex-col items-center gap-3">
                  <svg className="w-5 h-5 animate-spin text-accent" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20" strokeLinecap="round"/>
                  </svg>
                  Loading payload data...
                </div>
              ) : fullResult ? (
                <SuccessCard result={fullResult} />
              ) : (
                <div className="py-8 text-center text-danger text-sm">Failed to load payload</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main exported section ────────────────────────────────────────────────────
export default function RecentEndpoints({ refreshTrigger }) {
  const { user } = useAuth()
  const [endpoints, setEndpoints] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEndpoints = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const res = await listEndpoints(1, 50)
      setEndpoints(res.data.data)
    } catch (err) {
      console.error('Failed to fetch endpoints', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchEndpoints()
  }, [fetchEndpoints, refreshTrigger])

  const handleRemove = async (id) => {
    try {
      await deleteEndpointApi(id)
      setEndpoints(prev => prev.filter(e => e._id !== id))
    } catch (err) {
      console.error('Failed to delete endpoint', err)
    }
  }

  if (loading) {
    return (
      <div className="mt-16 text-center text-muted">
        <svg className="w-5 h-5 animate-spin text-accent mx-auto mb-2" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20" strokeLinecap="round"/>
        </svg>
        <span className="text-sm font-mono">Loading history...</span>
      </div>
    )
  }

  if (!endpoints || endpoints.length === 0) return null

  return (
    <div className="mt-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-acid animate-pulse-glow" />
          <h3 className="font-display font-black text-lg text-text tracking-tight">
            Endpoint History
          </h3>
          <span className="text-xs font-mono text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
            {endpoints.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {endpoints.map(item => (
            <EndpointCard
              key={item._id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
