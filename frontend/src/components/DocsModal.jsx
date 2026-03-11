import { useState } from 'react'

export default function DocsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-void/60 backdrop-blur-md" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-panel">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-acid/10 text-acid border border-acid/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-bright">Mastering MockifyAI</h2>
              <p className="text-xs text-muted">Complete guide to generating and consuming mock APIs</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-bright hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-16">
          
          {/* Section 1: Creation Modes */}
          <section>
            <h3 className="text-2xl font-display font-bold text-bright mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-acid/10 text-acid border border-acid/20 flex items-center justify-center text-sm">1</span>
              Creating Your API
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Mode Guide */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-panel border border-acid/20 shadow-glow-sm">
                  <h4 className="text-acid font-bold flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI Generator Mode
                  </h4>
                  <p className="text-xs text-dim leading-relaxed">
                    Simply describe what you need in plain English. The AI understands relationships, data types, and realistic mock values.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3 text-muted">
                    <span className="text-acid underline text-xs font-mono">STEP 1</span>
                    <p>Enter a prompt like <span className="text-text">"5 e-commerce products with images and rating"</span>.</p>
                  </div>
                  <div className="flex gap-3 text-muted">
                    <span className="text-acid underline text-xs font-mono">STEP 2</span>
                    <p>Provide an endpoint name (e.g. <span className="text-text">"shop-data"</span>).</p>
                  </div>
                  <div className="flex gap-3 text-muted">
                    <span className="text-acid underline text-xs font-mono">STEP 3</span>
                    <p>Hit "Generate" and your live URL is ready in seconds.</p>
                  </div>
                </div>
              </div>

              {/* Manual Mode Guide */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-panel border border-ember/20">
                  <h4 className="text-ember font-bold flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Manual JSON Mode
                  </h4>
                  <p className="text-xs text-dim leading-relaxed">
                    Paste your own JSON data. Ideal for mimicking existing legacy APIs or using custom hardcoded structures.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3 text-muted">
                    <span className="text-ember underline text-xs font-mono">STEP 1</span>
                    <p>Paste any valid JSON object or array into the editor.</p>
                  </div>
                  <div className="flex gap-3 text-muted">
                    <span className="text-ember underline text-xs font-mono">STEP 2</span>
                    <p>Use the <span className="text-text">"Format"</span> button to clean up the indentation.</p>
                  </div>
                  <div className="flex gap-3 text-muted">
                    <span className="text-ember underline text-xs font-mono">STEP 3</span>
                    <p>Check the byte-size limit to ensure it fits your plan.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Consuming the API */}
          <section>
            <h3 className="text-2xl font-display font-bold text-bright mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-sky/10 text-sky border border-sky/20 flex items-center justify-center text-sm">2</span>
              Integration Examples
            </h3>

            <div className="space-y-8">
              {/* JavaScript Fetch */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-acid/20 to-sky/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-panel border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-acid font-bold">fetch()</span>
                      <span className="text-[10px] text-muted">Standard Native API</span>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`fetch('${window.location.origin}/api/user/endpoint')\n  .then(res => res.json())\n  .then(data => console.log(data));`)}
                      className="text-[10px] font-mono hover:text-acid transition-colors"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="p-6 bg-void/80 overflow-x-auto font-mono text-sm leading-relaxed">
                    <span className="text-muted">// 1. Use standard fetch to get your mock data</span><br/>
                    <span className="text-ember">fetch</span>(<span className="text-sky">'your-live-url-here'</span>)<br/>
                    &nbsp;&nbsp;.<span className="text-acid">then</span>(res =&gt; res.<span className="text-acid">json</span>())<br/>
                    &nbsp;&nbsp;.<span className="text-acid">then</span>(data =&gt; <span className="text-ember">console</span>.<span className="text-acid">log</span>(data));
                  </div>
                </div>
              </div>

              {/* Axios Example */}
              <div className="group relative">
                <div className="relative bg-panel border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-sky font-bold">axios</span>
                      <span className="text-[10px] text-muted">Popular HTTP Client</span>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText("const { data } = await axios.get('your-url');\nconsole.log(data);")}
                      className="text-[10px] font-mono hover:text-sky transition-colors"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="p-6 bg-void/80 overflow-x-auto font-mono text-sm leading-relaxed">
                    <span className="text-muted">// Async/Await with Axios</span><br/>
                    <span className="text-acid">const</span> &#123; data &#125; = <span className="text-acid">await</span> <span className="text-ember">axios</span>.<span className="text-acid">get</span>(<span className="text-sky">'your-live-url'</span>);<br/>
                    <span className="text-ember">console</span>.<span className="text-acid">log</span>(data);
                  </div>
                </div>
              </div>

              {/* React Hook Example */}
              <div className="group relative">
                <div className="relative bg-panel border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-400 font-bold">React useEffect</span>
                      <span className="text-[10px] text-muted">Complete Component Integration</span>
                    </div>
                  </div>
                  <div className="p-6 bg-void/80 overflow-x-auto font-mono text-xs leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
<pre className="text-muted">
{`function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('your-url')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}`}
</pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tips footer */}
          <div className="bg-acid/5 border border-acid/10 rounded-2xl p-6 text-center">
            <h4 className="text-sm font-bold text-acid mb-2 tracking-widest uppercase">Pro Tip</h4>
            <p className="text-xs text-muted leading-relaxed max-w-xl mx-auto">
              MockifyAI endpoints support <span className="text-text">CORS</span> out of the box. You don't need any special headers to fetch data from your localhost during development!
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
