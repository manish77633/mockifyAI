/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        void:    '#080A0F',
        surface: '#0E1117',
        panel:   '#141820',
        border:  '#1E2433',
        subtle:  '#252D3D',
        muted:   '#4A5568',
        dim:     '#8892A4',
        text:    '#E2E8F0',
        bright:  '#F8FAFC',
        acid:    '#00FF88',
        acidDim: '#00CC6A',
        ember:   '#FF6B35',
        sky:     '#38BDF8',
        warn:    '#FBBF24',
        danger:  '#F87171',
      },
      boxShadow: {
        glow:      '0 0 20px rgba(0, 255, 136, 0.15)',
        glowLg:    '0 0 40px rgba(0, 255, 136, 0.2)',
        panel:     '0 4px 24px rgba(0, 0, 0, 0.4)',
        panelHover:'0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'fade-up':     'fadeUp 0.5s ease forwards',
        'fade-in':     'fadeIn 0.3s ease forwards',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
        'slide-in':    'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer':     'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp:     { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: 0 }, to: { opacity: 1 } },
        pulseGlow:  { '0%,100%': { boxShadow: '0 0 20px rgba(0,255,136,0.1)' }, '50%': { boxShadow: '0 0 40px rgba(0,255,136,0.3)' } },
        slideIn:    { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
