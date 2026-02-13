import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette
        'cyber-dark': '#0a0a0a',
        'cyber-darker': '#050505',
        'cyber-gray': '#1a1a1a',
        'cyber-light-gray': '#333333',
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff0080',
        'neon-purple': '#8000ff',
        'neon-green': '#00ff80',
        'neon-yellow': '#ffff00',
        'neon-blue': '#0080ff',
        'electric-blue': '#0066cc',
        'matrix-green': '#00ff41',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'cyber': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'scan-line': 'scan-line 2s linear infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '100%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor',
          },
          '50%': {
            opacity: '0.8',
            textShadow: '0 0 2px currentColor, 0 0 5px currentColor, 0 0 10px currentColor',
          },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            textShadow: 'none',
          },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'neon-gradient': 'linear-gradient(45deg, #00ffff 0%, #ff0080 25%, #8000ff 50%, #00ff80 75%, #00ffff 100%)',
        'grid-pattern': 'radial-gradient(circle, #333333 1px, transparent 1px)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
export default config;