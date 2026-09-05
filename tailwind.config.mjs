/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        headerNavy: '#112649',
        corpBlack: '#000000',
        corpText: '#111827',
        corpGrey: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
        },
        corpGreen: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
        }
      },
      fontFamily: {
        sans: ['Calibri', 'Carlito', 'Candara', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};