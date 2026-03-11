import { useState } from 'react'

const CHECK_SVG = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const COPY_SVG = (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const LINK_SVG = (
  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
    <path d="M6 10L10 6M10 6H7M10 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13V3h10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function buildFetchSnippet(liveUrl) {
  return `// MockifyAI — generated endpoint
const response = await fetch("${liveUrl}", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
});
const data = await response.json();
console.log(data);`
}

function buildAxiosSnippet(liveUrl) {
  return `// Using axios
import axios from "axios";
const { data } = await axios.get("${liveUrl}");
console.log(data);`
}

function buildCurlSnippet(liveUrl) {
  return `# cURL
curl -X GET "${liveUrl}" \\
  -H "Content-Type: application/json"`
}

const TABS = [
  { id: 'fetch', label: 'fetch()' },
  { id: 'axios', label: 'axios'   },
  { id: 'curl',  label: 'cURL'    },
]

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md
        transition-all duration-200 font-mono font-medium
        ${copied
          ? 'bg-acid/20 text-acid border border-acid/30'
          : 'bg-subtle/60 text-dim hover:text-text border border-border hover:border-subtle'
        }`}
    >
      <span className="transition-all duration-200">{copied ? CHECK_SVG : COPY_SVG}</span>
      {copied ? 'Copied!' : label}
    </button>
  )
}

function TokenisedCode({ code }) {
  const lines = code.split('\n')
  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        const highlighted = line
          .replace(/(\/\/.*|#.*)/g, '<span class="text-muted">$1</span>')
          .replace(/(\"(?:[^\"\\]|\\.)*\")/g, '<span class="text-sky">$1</span>')
          .replace(/\b(const|import|from|await|async|method|headers)\b/g, '<span class="text-acid/80">$1</span>')
          .replace(/\b(fetch|axios|get|console|log|response|data)\b/g, '<span class="text-ember/90">$1</span>')
          .replace(/(curl|GET|Content-Type)/g, '<span class="text-warn/90">$1</span>')
        return (
          <div key={i} className="flex">
            <span className="select-none text-muted/40 w-8 shrink-0 text-right mr-4 tabular-nums text-xs pt-0.5">
              {i + 1}
            </span>
            <span className="text-text/90 flex-1" dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        )
      })}
    </div>
  )
}

// Full-screen JSON viewer modal
function FullScreenModal({ json, onClose }) {
  const text = JSON.stringify(json, null, 2)
  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-void/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="text-sm font-mono text-acid">Full JSON Payload</span>
        <div className="flex items-center gap-3">
          <CopyButton text={text} label="Copy All" />
          <button onClick={onClose} className="text-dim hover:text-bright p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <pre className="font-mono text-xs text-text/80 leading-relaxed whitespace-pre-wrap">{text}</pre>
      </div>
    </div>
  )
}

export default function SuccessCard({ result, onDismiss }) {
  const [activeTab, setActiveTab] = useState('fetch')
  const [urlCopied, setUrlCopied] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)

  if (!result) return null

  const { liveUrl, endpoint, payload } = result
  const snippets = {
    fetch: buildFetchSnippet(liveUrl),
    axios: buildAxiosSnippet(liveUrl),
    curl:  buildCurlSnippet(liveUrl),
  }
  const activeSnippet = snippets[activeTab]

  const copyUrl = async () => {
    await navigator.clipboard.writeText(liveUrl).catch(() => {})
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), 2000)
  }

  const recordCount = Array.isArray(payload) ? payload.length : null
  const jsonText = JSON.stringify(payload, null, 2)

  return (
    <>
      {fullScreen && <FullScreenModal json={payload} onClose={() => setFullScreen(false)} />}

      <div className="animate-slide-in mt-6">
        {/* ── Status Banner ── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-acid/10 border border-acid/25 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-acid animate-pulse-glow" />
            <span className="text-acid text-xs font-mono font-medium tracking-wide">LIVE</span>
          </div>
          <span className="text-dim text-sm">
            Endpoint created
            {recordCount !== null && (
              <span className="text-text/70"> · <span className="text-acid">{recordCount}</span> records</span>
            )}
          </span>
          {onDismiss && (
            <button onClick={onDismiss} className="ml-auto text-muted hover:text-dim transition-colors text-xs btn-ghost">
              Clear
            </button>
          )}
        </div>

        {/* ── Live URL Card ── */}
        <div className="card p-4 mb-3 group hover:shadow-panelHover transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted font-mono tracking-wider uppercase">Live Endpoint</span>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-sky hover:text-sky/80 transition-colors">
              Open {LINK_SVG}
            </a>
          </div>
          <div className="flex items-center gap-3 bg-surface rounded-lg px-4 py-3 border border-border group-hover:border-subtle transition-colors">
            <span className="text-xs font-mono bg-acid/10 text-acid px-2 py-0.5 rounded border border-acid/20">GET</span>
            <span className="font-mono text-sm text-text flex-1 truncate">{liveUrl}</span>
            <button
              onClick={copyUrl}
              className={`shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all duration-200 font-mono
                ${urlCopied ? 'bg-acid/20 text-acid border border-acid/30' : 'bg-subtle text-dim hover:text-text border border-border'}`}
            >
              {urlCopied ? CHECK_SVG : COPY_SVG}
              <span>{urlCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* ── Code Snippets ── */}
        <div className="card overflow-hidden mb-3">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-muted" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h8M2 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xs font-display font-semibold text-dim uppercase tracking-widest">How to Use</span>
            </div>
            <div className="flex items-center gap-1">
              {TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-mono px-3 py-1 rounded-md transition-all duration-150
                    ${activeTab === tab.id ? 'bg-acid/15 text-acid border border-acid/25' : 'text-muted hover:text-dim'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <CopyButton text={activeSnippet} />
            </div>
            <div className="p-5 pt-4 overflow-x-auto bg-void/50">
              <TokenisedCode code={activeSnippet} />
            </div>
          </div>
        </div>

        {/* ── Full JSON Preview ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <span className="text-xs font-mono text-muted uppercase tracking-wider">JSON Payload</span>
            <div className="flex items-center gap-2">
              <CopyButton text={jsonText} label="Copy JSON" />
              <button
                onClick={() => setFullScreen(true)}
                className="text-xs font-mono text-dim hover:text-bright px-3 py-1.5 rounded-md border border-border hover:border-subtle transition-all"
              >
                ⛶ Full Screen
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto p-5 bg-void/50">
            <pre className="font-mono text-xs text-text/60 leading-relaxed whitespace-pre-wrap">
              {jsonText}
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}
