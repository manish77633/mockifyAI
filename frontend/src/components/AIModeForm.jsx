import { useState } from 'react'
import { generateAIMock } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const PROMPT_SUGGESTIONS = [
  'Give me 5 e-commerce products with price, rating, and category',
  'Generate 8 users with name, email, avatar URL, and role',
  'Create 6 blog posts with title, author, tags, and published date',
  'Give me 10 transactions with amount, currency, status, and timestamp',
]

const SPARKLE_SVG = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.05 3.05l2.12 2.12M10.83 10.83l2.12 2.12M10.83 5.17l2.12-2.12M3.05 12.95l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export default function AIModeForm({ onSuccess }) {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [endpointName, setEndpointName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setError(null)
    if (!prompt.trim())       return setError('Please enter a prompt.')
    if (!endpointName.trim()) return setError('Please enter an endpoint name.')

    setLoading(true)
    try {
      const res = await generateAIMock({
        prompt: prompt.trim(),
        endpointName: endpointName.trim(),
      })
      onSuccess(res.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const useSuggestion = (s) => {
    setPrompt(s)
    if (!endpointName) {
      // auto-derive a slug from the suggestion
      const slug = s.split(' ').slice(2, 5).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '')
      setEndpointName(slug)
    }
  }

  return (
    <div className="space-y-5">
      {/* Prompt suggestions */}
      <div>
        <p className="text-xs text-muted font-mono uppercase tracking-wider mb-2">
          Try a suggestion
        </p>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => useSuggestion(s)}
              className="text-xs bg-surface hover:bg-subtle border border-border hover:border-acid/40
                         text-dim hover:text-acid px-3 py-1.5 rounded-full transition-all duration-150 font-body"
            >
              {s.length > 40 ? s.slice(0, 40) + '…' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt textarea */}
      <div>
        <label className="block text-sm font-display font-medium text-text mb-2">
          Describe your data
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Give me 5 products with name, price, and rating"
          rows={4}
          className="input-base resize-none font-body"
        />
        <p className="text-xs text-muted mt-1.5">
          Be specific — field names, data types, and count help Gemini produce better results.
        </p>
      </div>

      {/* Endpoint name */}
      <div>
        <label className="block text-sm font-display font-medium text-text mb-2">
          Endpoint name
        </label>
        <div className="flex items-center gap-0">
          <span className="bg-subtle border border-r-0 border-border rounded-l-xl px-3 py-3
                           text-muted text-sm font-mono shrink-0 whitespace-nowrap">
            /api/{user?.username || 'user'}/
          </span>
          <input
            type="text"
            value={endpointName}
            onChange={(e) => setEndpointName(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_/]/g, ''))}
            placeholder="products"
            className="input-base rounded-l-none flex-1 font-mono"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-danger/10 border border-danger/25 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-danger mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-danger text-sm">{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2.5 py-3"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20" strokeLinecap="round"/>
            </svg>
            Generating with Gemini…
          </>
        ) : (
          <>
            {SPARKLE_SVG}
            Generate Mock API
          </>
        )}
      </button>
    </div>
  )
}
