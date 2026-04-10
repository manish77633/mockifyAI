import { motion } from 'framer-motion'

export default function BackgroundParticles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* ── Enhanced Background Effects (Glows) ── */}
      
      {/* Central Glow (Breathing Pulse) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      
      {/* Side Glows for Depth */}
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -right-32 w-[350px] h-[350px] bg-blue-800/10 rounded-full blur-[100px]" />

      {/* Animated Grid Overlay (Token-Efficient Dot Grid) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* ── Floating Particles (The Signature Look) ── */}
      
      {/* Particle 1 */}
      <motion.div 
        className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full blur-[1px]"
        animate={{ 
          y: [0, -40, 0],
          x: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particle 2 */}
      <motion.div 
        className="absolute top-40 right-32 w-1 h-1 bg-blue-300/40 rounded-full blur-[1px]"
        animate={{ 
          y: [0, 50, 0],
          x: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Particle 3 */}
      <motion.div 
        className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-500/20 rounded-full blur-[1px]"
        animate={{ 
          y: [0, -60, 0],
          x: [0, 40, 0],
          opacity: [0.1, 0.4, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Extra Subtle Drift Dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/5 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
