import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0F6B3E',
        accent: '#F5A623',
      },
      fontFamily: {
        sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
        mono: 'var(--font-geist-mono), monospace',
        'bruno-ace': ['"Bruno Ace"', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config
