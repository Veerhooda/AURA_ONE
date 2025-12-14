/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        colors: {
            // Deep Space Palette v2
            background: "#030712", // Richer Slate 950
            surface: "rgba(15, 23, 42, 0.4)", // Translucent Slate 900
            
            primary: {
                DEFAULT: "#00f2ff", // Cyan Neon
                glow: "rgba(0, 242, 255, 0.5)",
                dim: "#00a0a8"
            },
            secondary: {
                DEFAULT: "#10B981", // Emerald 500
                glow: "rgba(16, 185, 129, 0.5)",
                dim: "#059669" // Emerald 600
            },
            accent: {
                DEFAULT: "#8b5cf6", // Violet 500
                glow: "rgba(139, 92, 246, 0.5)"
            },
            alert: {
                DEFAULT: "#EF4444", // Red 500
                glow: "rgba(239, 68, 68, 0.5)"
            }
        },
        boxShadow: {
            'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
            'neon-blue': '0 0 20px rgba(0, 242, 255, 0.2), 0 0 5px rgba(0, 242, 255, 0.4)',
            'neon-green': '0 0 20px rgba(16, 185, 129, 0.2), 0 0 5px rgba(16, 185, 129, 0.4)',
            'neon-purple': '0 0 20px rgba(139, 92, 246, 0.2), 0 0 5px rgba(139, 92, 246, 0.4)',
        },
        animation: {
            'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'float': 'float 6s ease-in-out infinite',
            'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            'fade-in': 'fadeIn 0.5s ease-out',
            'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        },
        keyframes: {
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            },
            slideUp: {
                '0%': { transform: 'translateY(20px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            slideDown: {
                '0%': { transform: 'translateY(-20px)', opacity: '0' },
                '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
            glowPulse: {
                '0%, 100%': { boxShadow: '0 0 5px rgba(0, 242, 255, 0.2)' },
                '50%': { boxShadow: '0 0 20px rgba(0, 242, 255, 0.6)' },
            },
        }
      },
    },
    plugins: [],
  }
