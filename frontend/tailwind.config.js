/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter Tight"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        body:    ['"Inter"', 'sans-serif'],
      },
      colors: {
        void:    'var(--void)',
        surface: 'var(--surface-color)',
        panel:   'var(--panel-color)',
        border:  'var(--border-color)',
        subtle:  'var(--subtle)',
        muted:   'var(--text-muted)',
        dim:     'var(--text-dim)',
        text:    'var(--text-main)',
        accent:  '#3B82F6', // ClipDotHub Blue
        'accent-soft': 'rgba(59, 130, 246, 0.1)',
      },
      boxShadow: {
        'glass-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255, 255, 255, 0.05)'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
