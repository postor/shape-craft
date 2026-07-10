/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,html}'],
  // Preflight disabled so Tailwind's reset does not override the app's
  // existing hand-written component styles (buttons, inputs, layout, etc.).
  corePlugins: { preflight: false },
  theme: {
    extend: {
      // Animations + keyframes required by vendored MagicUI components.
      // Source: https://magicui.design (MIT). Kept dependency-free so the
      // components render with only Tailwind + framer-motion.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,html}'],
  // Preflight disabled so Tailwind's reset does not override the app's
  // existing hand-written component styles (buttons, inputs, layout, etc.).
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        panel: '#171a21',
        'panel-2': '#1f232c',
        border: '#2a2f3a',
        text: '#d7dbe2',
        muted: '#8b93a1',
        accent: '#4caf50',
        'accent-2': '#2f8f3a',
        danger: '#e5534b',
      },
      boxShadow: {
        panel: '0 8px 24px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        gradient: {
          to: { backgroundPosition: 'var(--bg-size, 300%) 0' },
        },
        shine: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.35' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'chat-dot': {
          '0%, 80%, 100%': { opacity: '0.25', transform: 'translateY(0)' },
          '40%': { opacity: '1', transform: 'translateY(-3px)' },
        },
        'roam-blink': {
          '50%': { opacity: '0.2' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        'chat-cursor': {
          '50%': { opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'border-beam': 'border-beam calc(var(--duration, 4) * 1s) infinite linear',
        marquee: 'marquee var(--duration, 20s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 20s) linear infinite',
        gradient: 'gradient 8s linear infinite',
        shine: 'shine 4s linear infinite',
        ripple: 'ripple var(--duration, 2s) ease-out',
        'chat-dot': 'chat-dot 1.2s infinite ease-in-out',
        'roam-blink': 'roam-blink 1s step-start infinite',
        spin: 'spin 0.8s linear infinite',
        'chat-cursor': 'chat-cursor 1s step-start infinite',
      },
    },
  },
  plugins: [],
};
