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
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'border-beam': 'border-beam calc(var(--duration, 4) * 1s) infinite linear',
        marquee: 'marquee var(--duration, 20s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 20s) linear infinite',
        gradient: 'gradient 8s linear infinite',
        shine: 'shine 4s linear infinite',
        ripple: 'ripple var(--duration, 2s) ease-out',
      },
    },
  },
  plugins: [],
};
