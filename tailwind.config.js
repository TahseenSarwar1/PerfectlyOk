/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blue:    { soft: '#A7C7E7', dark: '#7aadd4', light: '#d3e7f5' },
        lavender:{ DEFAULT: '#CDB4DB', light: '#e6d9f0', dark: '#b090c6' },
        beige:   { DEFAULT: '#F8F5F2', dark: '#ede8e2' },
        green:   { muted: '#B7E4C7', dark: '#7ecba0', light: '#daf3e5' },
        sage:    { DEFAULT: '#8BAF92' },
        stone:   { warm: '#8C7B6B', muted: '#b3a49a' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:  '0 4px 24px rgba(167,199,231,0.18)',
        card:  '0 2px 16px rgba(167,199,231,0.14)',
        float: '0 8px 40px rgba(167,199,231,0.22)',
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      animation: {
        'fade-up':    'fadeUp 0.6s ease both',
        'fade-in':    'fadeIn 0.4s ease both',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'typing':     'typing 1.2s infinite',
        'slide-in':   'slideIn 0.35s ease both',
        'bounce-in':  'bounceIn 0.5s ease both',
      },
      keyframes: {
        fadeUp:   { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        slideIn:  { '0%': { opacity: 0, transform: 'translateX(16px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
        bounceIn: { '0%': { opacity: 0, transform: 'scale(0.85)' }, '60%': { transform: 'scale(1.04)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        typing:   { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 1 } },
      },
      transitionTimingFunction: { soft: 'cubic-bezier(0.4,0,0.2,1)' },
    },
  },
  plugins: [],
}
