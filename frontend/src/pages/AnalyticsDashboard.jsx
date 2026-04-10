import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Activity, Clock, Zap, Target } from 'lucide-react'

const data = [
  { name: 'Mon', hits: 4000, latency: 24 },
  { name: 'Tue', hits: 3000, latency: 18 },
  { name: 'Wed', hits: 2000, latency: 29 },
  { name: 'Thu', hits: 2780, latency: 20 },
  { name: 'Fri', hits: 1890, latency: 15 },
  { name: 'Sat', hits: 2390, latency: 19 },
  { name: 'Sun', hits: 3490, latency: 22 },
]

export default function AnalyticsDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-text mb-2 tracking-tight">API Analytics</h2>
        <p className="text-dim text-base">Monitor your endpoint performance and request latency in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Requests', value: '1,204', icon: <Activity size={20} />, change: '+12.5%' },
          { label: 'Avg Latency', value: '23ms', icon: <Clock size={20} />, change: '-2.4ms' },
          { label: 'Cache Hits', value: '89.2%', icon: <Zap size={20} />, change: '+4.1%' },
          { label: 'Error Rate', value: '0.01%', icon: <Target size={20} />, change: '-0.05%' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 bg-surface border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-acid/10 text-acid rounded-lg border border-acid/20">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-acid/10 text-acid' : 'bg-acid/10 text-acid'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-muted mb-1">{stat.label}</p>
            <h3 className="font-display font-bold text-2xl text-text">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 bg-surface">
          <h3 className="font-display font-semibold text-text mb-6">Traffic Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--acid)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--acid)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--acid)' }}
                />
                <Area type="monotone" dataKey="hits" stroke="var(--acid)" strokeWidth={2} fillOpacity={1} fill="url(#colorHits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 bg-surface">
          <h3 className="font-display font-semibold text-text mb-6">Endpoint Latency</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: '#38BDF8' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#38BDF8" strokeWidth={3} dot={{ fill: '#38BDF8', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
