import { useState } from 'react'
import { Play, Terminal, Braces } from 'lucide-react'

export default function APIPlayground() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://mockify.ai/api/demo/users')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    setLoading(true)
    setTimeout(() => {
      setResponse({
        status: 200,
        time: '12ms',
        size: '1.2KB',
        data: [
          { id: 1, name: "Alice", role: "Admin" },
          { id: 2, name: "Bob", role: "User" }
        ]
      })
      setLoading(false)
    }, 600)
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6">
        <h2 className="font-display font-bold text-3xl text-text mb-2 tracking-tight">API Playground</h2>
        <p className="text-dim text-base">Test your mock endpoints in an integrated REST client.</p>
      </div>

      <div className="card flex-1 bg-surface border-border flex flex-col overflow-hidden">
        {/* URL Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center gap-3 bg-panel/50">
          <div className="flex gap-3 flex-1">
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-transparent border border-border text-accent font-mono text-sm font-bold rounded-lg px-3 py-2.5 outline-none focus:border-accent"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL"
              className="flex-1 min-w-0 bg-void border border-border rounded-lg px-4 py-2.5 font-mono text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 py-2.5 px-6 md:w-auto w-full"
          >
            {loading ? <span className="animate-spin text-void border-2 border-void/30 border-t-void rounded-full w-4 h-4" /> : <Play size={16} fill="currentColor" />}
            Send
          </button>
        </div>

        {/* Playground area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Query Params / Body (Left) */}
          <div className="w-1/2 border-r border-border p-4 bg-void hidden md:block">
            <div className="flex gap-4 border-b border-border pb-2 mb-4">
              <button className="text-acid font-semibold text-sm border-b-2 border-acid pb-2 -mb-2.5">Headers</button>
              <button className="text-dim hover:text-text text-sm pb-2">Body</button>
              <button className="text-dim hover:text-text text-sm pb-2">Auth</button>
            </div>
            <div className="font-mono text-xs text-muted flex items-center gap-2 mt-8">
              <Braces size={14} /> Add parameters mapping here...
            </div>
          </div>

          {/* Response (Right) */}
          <div className="flex-1 bg-panel flex flex-col">
            <div className="p-3 border-b border-border bg-surface/30 flex items-center justify-between text-xs font-mono">
              <span className="text-dim">Response</span>
              {response && (
                <div className="flex gap-4">
                  <span className="text-acid">Status: {response.status} OK</span>
                  <span className="text-sky">Time: {response.time}</span>
                  <span className="text-warn">Size: {response.size}</span>
                </div>
              )}
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {!response && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-muted gap-3">
                  <Terminal size={32} className="opacity-50" />
                  <p>Enter a URL and press Send to get a response</p>
                </div>
              )}
              {loading && (
                <div className="animate-pulse flex flex-col gap-2 opacity-50">
                   <div className="h-4 bg-border/50 rounded w-1/4"></div>
                   <div className="h-4 bg-border/50 rounded w-1/2"></div>
                   <div className="h-4 bg-border/50 rounded w-1/3"></div>
                </div>
              )}
              {response && !loading && (
                <pre className="text-acid/80 font-mono text-sm leading-relaxed">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
