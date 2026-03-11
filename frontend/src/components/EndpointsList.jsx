import { useState, useEffect } from 'react'
import { listEndpoints, deleteEndpoint } from '../utils/api'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function EndpointsList({ refresh }) {
  const [endpoints, setEndpoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const load = async () => {
    try {
      const res = await listEndpoints()
      setEndpoints(res.data.data || [])
    } catch (err) { console.error('Endpoints List Error:', err); }
    setLoading(false)
  }

  useEffect(() => { load() }, [refresh])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this endpoint?')) return
    setDeletingId(id)
    try {
      await deleteEndpoint(id)
      setEndpoints((prev) => prev.filter((ep) => ep._id !== id))
    } catch (err) { alert(err.message) }
    setDeletingId(null)
  }

  if (loading) return (
    <div className="space-y-2 mt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 rounded-xl bg-panel border border-border animate-pulse" />
      ))}
    </div>
  )

  if (!endpoints.length) return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3">
        <svg className="w-5 h-5 text-muted" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-dim text-sm">No endpoints yet.</p>
      <p className="text-muted text-xs mt-1">Create your first mock above.</p>
    </div>
  )

  return (
    <div className="space-y-2 mt-1">
      {endpoints.map((ep) => {
        const baseOrigin = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin
        const liveUrl = `${baseOrigin}/api/${ep.username}/${ep.endpoint}`
        return (
        <div
          key={ep._id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border
                     hover:border-subtle transition-all duration-150 group cursor-pointer"
          onClick={() => window.open(liveUrl, '_blank')}
        >
          {/* Mode badge */}
          <span className={`shrink-0 text-xs font-mono px-2 py-0.5 rounded border
            ${ep.mode === 'ai'
              ? 'bg-sky/10 text-sky border-sky/20'
              : 'bg-ember/10 text-ember border-ember/20'}`}
          >
            {ep.mode === 'ai' ? 'AI' : 'MN'}
          </span>

          {/* Slug & meta */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono text-text truncate">/{ep.endpoint}</p>
            <p className="text-xs text-muted">{timeAgo(ep.createdAt)} · {ep.hitCount ?? 0} hits</p>
          </div>

          {/* Copy URL */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(liveUrl)
            }}
            title="Copy URL"
            className="shrink-0 opacity-0 group-hover:opacity-100 text-muted hover:text-acid
                       transition-all duration-150 p-1.5 rounded-lg hover:bg-acid/10"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={(e) => handleDelete(ep._id, e)}
            disabled={deletingId === ep._id}
            className="shrink-0 opacity-0 group-hover:opacity-100 text-muted hover:text-danger
                       transition-all duration-150 p-1.5 rounded-lg hover:bg-danger/10"
          >
            {deletingId === ep._id ? (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
        )
      })}
    </div>
  )
}
