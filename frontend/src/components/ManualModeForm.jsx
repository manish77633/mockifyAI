import { useState, useCallback } from 'react'
import { createManualMock } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

const EXAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "inStock": true,
    "category": "Electronics"
  },
  {
    "id": 2,
    "name": "Mechanical Keyboard",
    "price": 129.99,
    "inStock": false,
    "category": "Peripherals"
  }
]`

function validateJSON(str) {
  try {
    const parsed = JSON.parse(str)
    return { valid: true, parsed, error: null }
  } catch (e) {
    return { valid: false, parsed: null, error: e.message }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/**
 * Smart formatter: Tries to coerce messy JS-like syntax into valid JSON.
 * Handles: unquoted keys, trailing commas, leading array indices (0{ 1{)
 */
function smartFormat(input) {
  try {
    // Step 1: try as-is
    return { success: true, result: JSON.stringify(JSON.parse(input), null, 2) }
  } catch {
    // Step 2: Repair common issues
    let s = input.trim()

    // Remove leading array index patterns: "0{" "1 {" at start of lines
    s = s.replace(/^\s*\d+\s*(?=\{)/gm, '')

    // Convert single quotes to double quotes (simple cases)
    s = s.replace(/'/g, '"')

    // Remove trailing commas before } or ]
    s = s.replace(/,\s*(\n?\s*[}\]])/g, '$1')

    // Quote unquoted object keys: word after { or , or [ followed by :
    // handles: {id: 1, [id: 1, , id: 1
    s = s.replace(/([{,\[]\s*)\n?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

    // Remove JavaScript-style comments
    s = s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')

    // If it doesn't start with [ or {, wrap it
    if (!s.startsWith('[') && !s.startsWith('{')) {
      s = `[${s}]`
    }

    try {
      return { success: true, result: JSON.stringify(JSON.parse(s), null, 2) }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }
}

export default function ManualModeForm({ onSuccess }) {
  const { user } = useAuth()
  const [rawJson, setRawJson] = useState('')
  const [endpointName, setEndpointName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [smartFormatMsg, setSmartFormatMsg] = useState(null)

  const validation = rawJson.trim() ? validateJSON(rawJson) : null
  const byteSize = rawJson ? new Blob([rawJson]).size : 0
  const isArray = validation?.valid && Array.isArray(validation.parsed)
  const recordCount = isArray ? validation.parsed.length : null

  const handleFormat = useCallback(() => {
    const { valid, parsed } = validateJSON(rawJson)
    if (valid) setRawJson(JSON.stringify(parsed, null, 2))
  }, [rawJson])

  const handleSmartFormat = useCallback(() => {
    setSmartFormatMsg(null)
    const result = smartFormat(rawJson)
    if (result.success) {
      setRawJson(result.result)
      setSmartFormatMsg({ type: 'success', text: 'Fixed & formatted!' })
    } else {
      setSmartFormatMsg({ type: 'error', text: 'Could not auto-fix. Check your JSON.' })
    }
    setTimeout(() => setSmartFormatMsg(null), 3000)
  }, [rawJson])

  const loadExample = () => setRawJson(EXAMPLE_JSON)

  const handleSubmit = async () => {
    setError(null)
    if (!endpointName.trim()) return setError('Please enter an endpoint name.')
    if (!rawJson.trim())      return setError('Please paste your JSON payload.')

    const { valid, parsed, error: jsonErr } = validateJSON(rawJson)
    if (!valid) return setError(`Invalid JSON: ${jsonErr}`)

    setLoading(true)
    try {
      const res = await createManualMock({
        endpointName: endpointName.trim(),
        payload: parsed,
      })
      onSuccess(res.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Endpoint name */}
      <div>
        <label className="block text-sm font-display font-medium text-text mb-2">
          Endpoint name
        </label>
        <div className="flex items-center">
          <span className="bg-subtle border border-r-0 border-border rounded-l-xl px-3 py-3
                           text-muted text-sm font-mono shrink-0 whitespace-nowrap">
            /api/{user?.username || 'user'}/
          </span>
          <input
            type="text"
            value={endpointName}
            onChange={(e) => setEndpointName(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_/]/g, ''))}
            placeholder="my-endpoint"
            className="input-base rounded-l-none flex-1 font-mono"
          />
        </div>
      </div>

      {/* JSON Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-display font-medium text-text">
            JSON Payload
          </label>
          <div className="flex items-center gap-2">
            {rawJson && validation?.valid && (
              <button onClick={handleFormat} className="btn-ghost text-xs">
                Format
              </button>
            )}
            <button
              onClick={handleSmartFormat}
              title="Fix messy JS-copied objects with unquoted keys"
              className="btn-ghost text-xs text-acid border-acid/30 hover:bg-acid/10"
            >
              ✨ Smart Fix
            </button>
            <button onClick={loadExample} className="btn-ghost text-xs">
              Load example
            </button>
          </div>
        </div>

        {smartFormatMsg && (
          <div className={`mb-2 text-xs px-3 py-1.5 rounded-lg border ${
            smartFormatMsg.type === 'success'
              ? 'bg-acid/10 text-acid border-acid/20'
              : 'bg-danger/10 text-danger border-danger/20'
          }`}>
            {smartFormatMsg.text}
          </div>
        )}

        <div className="relative">
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder={'[\n  { "id": 1, "name": "Item 1" }\n]'}
            rows={10}
            className={`input-base resize-none font-mono text-xs leading-relaxed
              ${validation && !validation.valid ? 'border-danger/50 focus:border-danger focus:ring-danger/20' : ''}
              ${validation?.valid ? 'border-acid/30' : ''}
            `}
          />
          {/* JSON status badge */}
          {rawJson && (
            <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md
              text-xs font-mono border transition-all
              ${validation?.valid
                ? 'bg-acid/10 text-acid border-acid/20'
                : 'bg-danger/10 text-danger border-danger/20'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${validation?.valid ? 'bg-acid' : 'bg-danger'}`} />
              {validation?.valid ? 'Valid JSON' : 'Invalid'}
            </div>
          )}
        </div>

        {/* Metadata row */}
        {rawJson && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted font-mono">
            {recordCount !== null && (
              <span><span className="text-acid">{recordCount}</span> record{recordCount !== 1 ? 's' : ''}</span>
            )}
            <span><span className="text-dim">{formatBytes(byteSize)}</span> / 1 MB free</span>
            {!validation?.valid && (
              <span className="text-danger/80 truncate flex-1">{validation?.error}</span>
            )}
          </div>
        )}
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
        disabled={loading || (rawJson.trim() && !validation?.valid)}
        className="btn-primary w-full flex items-center justify-center gap-2.5 py-3"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 20" strokeLinecap="round"/>
            </svg>
            Saving endpoint…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create Endpoint
          </>
        )}
      </button>
    </div>
  )
}
