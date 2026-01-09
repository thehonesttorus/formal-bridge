/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'midnight': '#0a0e1a',
                'navy': {
                    900: '#0d1321', // Slightly lighter background
                    800: '#141c2f', // Card background
                    700: '#1e293b', // Borders
                    600: '#2d3a52', // Active borders/dividers
                },
                'teal': {
                    DEFAULT: '#00d4aa',
                    glow: 'rgba(0, 212, 170, 0.4)',
                    dim: 'rgba(0, 212, 170, 0.1)',
                },
                'amber': {
                    DEFAULT: '#f59e0b',
                },
                'slate': {
                    300: '#cbd5e1', // High contrast text
                    400: '#94a3b8', // Body text
                    500: '#64748b', // Muted text
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px)",
                'radial-glow': "radial-gradient(circle, rgba(0,212,170,0.15) 0%, transparent 70%)",
                'card-gradient': "linear-gradient(180deg, rgba(20,28,47,0.6) 0%, rgba(20,28,47,0.8) 100%)",
            },
            animation: {
                'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
                'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
                'border-beam': 'borderBeam 2s linear infinite',
                'draw-line': 'drawLine 1.5s ease-out forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                pulseSlow: {
                    '0%, 100%': { opacity: 0.4 },
                    '50%': { opacity: 1 },
                },
                drawLine: {
                    '0%': { strokeDashoffset: 1000 },
                    '100%': { strokeDashoffset: 0 },
                },
            }
        },
    },
    plugins: [],
}
