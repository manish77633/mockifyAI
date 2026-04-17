import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Zap, ArrowRight, Play, Terminal, Activity, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Stagger, StaggerChild, FadeIn, FloatingElement, TypewriterText } from "../components/Animations";
import AuthGateModal from "../components/AuthGateModal";

// Magnetic Interaction Component
function Magnetic({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartBuilding = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center w-full">
      
      {/* Precision Hero */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-center relative z-10 w-full">
        
        <Stagger>
          {/* Glow Badge */}
          <StaggerChild>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface backdrop-blur-md mb-10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold text-dim uppercase tracking-[0.2em]">v2.0 – Production Edge Data Engine</span>
            </div>
          </StaggerChild>

          {/* High-Impact Typography with ClipHub Gradient */}
          <StaggerChild>
            <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter leading-[1.0] mb-8">
              <span className="text-text">
                <TypewriterText text="Design anything," speed={70} /> <br />
              </span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #5b9bff 0%, #93c5fd 50%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                mock anywhere
              </span>
            </h1>
          </StaggerChild>

          <StaggerChild>
            <p className="text-lg md:text-xl text-dim max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
              The modular mock API platform for modern engineering teams. 
              Generate deterministic JSON schemas at the edge in sub-12ms.
            </p>
          </StaggerChild>

          {/* Global CTAs */}
          <StaggerChild>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
              <Magnetic>
                 <button 
                  onClick={handleStartBuilding}
                  className="btn-primary px-10 py-4 text-lg group shadow-blue-glow/20"
                >
                  Start Building <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Magnetic>
              
              <button 
                onClick={() => navigate('/templates')}
                className="flex items-center gap-3 text-dim hover:text-text font-bold transition-all px-8 py-4 group glass rounded-xl"
              >
                <Play size={16} fill="currentColor" className="text-accent" />
                Explore Blueprints
              </button>
            </div>
          </StaggerChild>

          {/* Auth Gate Modal — triggered from landing CTA */}
          <AuthGateModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

          {/* Social Proof: Trusted by Developers */}
          <StaggerChild>
            <div className="flex flex-col items-center gap-8 mb-32">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Trusted by developers at</p>
              <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                {['Vercel', 'Stripe', 'Supabase', 'Railway', 'Resend'].map((brand) => (
                  <span key={brand} className="font-display font-black text-xl tracking-tighter text-text">{brand}</span>
                ))}
              </div>
            </div>
          </StaggerChild>

          {/* Hero Visual: ClipHub style preview (Static Snippet for Efficiency) wrapped in FloatingElement */}
          <StaggerChild>
            <FloatingElement intensity={10} duration={4}>
              <div className="relative group max-w-4xl mx-auto">
                <div className="absolute -inset-10 bg-accent/10 rounded-[4rem] blur-[100px] opacity-20 pointer-events-none" />
                <div className="relative glass rounded-[2rem] overflow-hidden border border-border shadow-2xl bg-panel/50 backdrop-blur-xl">
                  <div className="flex items-center justify-between px-6 h-14 border-b border-border" style={{ backgroundColor: 'var(--panel-color)' }}>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] font-black">mock_engine_core.py</div>
                    <div className="w-10" />
                  </div>
                  <div className="p-8 text-left" style={{ backgroundColor: 'var(--editor-bg, rgba(0,0,0,0.4))' }}>
                    <pre className="font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
                      <span className="text-accent">@engine.route</span>(<span className="text-sky">"/v1/predict"</span>){"\n"}
                      <span className="text-accent">def</span> <span className="text-text">generate_mock</span>():{"\n"}
                      {"  "}<span className="text-accent">return</span> schema_factory.create({"\n"}
                      {"    "}model=<span className="text-sky">"llama-3.1-70b"</span>,{"\n"}
                      {"    "}latency=<span className="text-sky">"12ms"</span>,{"\n"}
                      {"    "}determinism=<span className="text-sky">True</span>{"\n"}
                      {"  "})
                    </pre>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </StaggerChild>
        </Stagger>
      </section>

      {/* Feature Grid: ClipHub Aesthetic */}
      <section className="w-full max-w-7xl mx-auto py-40 px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="font-display font-black text-4xl md:text-5xl text-text tracking-tighter mb-4">Why MockifyAI?</h2>
          <p className="text-dim font-medium">Built for speed, architected for scale.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Zap size={24} />, 
              title: "Sub-second Latency", 
              desc: "Global edge network delivers mock responses in under 12ms, ensuring zero friction in development." 
            },
            { 
              icon: <Terminal size={24} />, 
              title: "AI Intelligence", 
              desc: "Harness the power of Llama 3.1 to generate deterministic, context-aware datasets on demand." 
            },
            { 
              icon: <Activity size={24} />, 
              title: "Smart Caching", 
              desc: "Local-first caching and optimized prompting reduce token usage and improve subsequent load speeds." 
            }
          ].map((item, idx) => (
            <motion.div 
              key={item.title}
              whileHover={{ y: -8 }}
              className="p-10 rounded-[2.5rem] glass glass-hover border border-border flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-display font-black text-2xl text-text tracking-tighter mb-4">{item.title}</h3>
              <p className="text-sm text-dim leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
