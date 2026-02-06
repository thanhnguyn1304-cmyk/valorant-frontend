/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Tracker.gg Inspired Color Palette
      colors: {
        // Background layers
        surface: {
          DEFAULT: '#0E1015',
          100: '#151A21',
          200: '#1C2127',
          300: '#232A31',
          400: '#2A323A',
        },
        // Valorant Red - Primary accent
        val: {
          DEFAULT: '#FF4655',
          50: '#FFF0F1',
          100: '#FFD6D9',
          200: '#FFB3B9',
          300: '#FF8A94',
          400: '#FF6874',
          500: '#FF4655',
          600: '#E63E4C',
          700: '#CC3644',
          800: '#B32F3B',
          900: '#992833',
        },
        // Success/Win green
        success: {
          DEFAULT: '#28C76F',
          dark: '#1F9D57',
        },
        // Loss red (different from accent)
        loss: {
          DEFAULT: '#EA5455',
          dark: '#C74344',
        },
        // Text hierarchy
        text: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          tertiary: '#64748B',
          muted: '#475569',
        },
        // Rank colors
        rank: {
          iron: '#3E3E3E',
          bronze: '#A5715A',
          silver: '#B4C3C8',
          gold: '#E9B54C',
          platinum: '#49B4B4',
          diamond: '#D664E0',
          ascendant: '#2ADB84',
          immortal: '#BF4E5E',
          radiant: '#FFFBA3',
        },
      },
      // Typography
      fontFamily: {
        display: ['Tungsten', 'Impact', 'sans-serif'],
        body: ['DIN Next', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Font sizes
      fontSize: {
        'stat': ['2rem', { lineHeight: '1', fontWeight: '700' }],
        'stat-sm': ['1.25rem', { lineHeight: '1', fontWeight: '600' }],
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      // Box shadows
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        'glow-val': '0 0 20px rgba(255, 70, 85, 0.3)',
        'glow-success': '0 0 20px rgba(40, 199, 111, 0.3)',
      },
      // Border radius
      borderRadius: {
        'card': '0.5rem',
      },
      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}