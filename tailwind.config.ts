import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0a0a0a',
        charcoal: '#121212',
        'charcoal-light': '#1a1a1a',
        gold: {
          DEFAULT: '#d4af37',
          glow: 'rgba(212, 175, 55, 0.15)',
          bright: '#f3e5ab',
          dark: '#aa7c11',
        },
        eclipse: {
          bg: '#f5f5f7',
          card: '#e5e5ea',
          hover: '#d1d1d6',
          text: '#1c1c1e',
          muted: '#636366',
          accent: '#8c6239',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        hero: ['var(--font-syne)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '28px',
      },
      animation: {
        'orb-float-1': 'orbFloat1 20s ease-in-out infinite',
        'orb-float-2': 'orbFloat2 25s ease-in-out infinite',
        'orb-float-3': 'orbFloat3 18s ease-in-out infinite',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        orbFloat1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-60px, 40px) scale(1.1)' },
          '66%': { transform: 'translate(40px, -30px) scale(0.95)' },
        },
        orbFloat2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(50px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-30px, 60px) scale(0.9)' },
        },
        orbFloat3: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.5' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
