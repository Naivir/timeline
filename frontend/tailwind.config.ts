import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f8f6f1',
        foreground: '#1f2937',
        primary: '#0f766e',
        accent: '#a16207',
        card: '#fffbeb'
      }
    }
  },
  plugins: []
}

export default config
