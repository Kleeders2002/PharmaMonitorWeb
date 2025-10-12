const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'tilt': 'tilt 8s ease-in-out infinite',
        'color-shift': 'colorShift 8s infinite alternate',
        'bounce-horizontal': 'bounceHorizontal 1.2s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'flip': 'flip 1.2s ease-out',
        'line-expand': 'lineExpand 1s ease-out forwards',
        'fade-in-left': 'fadeInLeft 1s ease-out forwards',
        'fade-in-right': 'fadeInRight 1s ease-out forwards',
        'drip': 'drip 1.5s infinite',
        'bounce-vertical': 'bounceVertical 1.2s infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(2deg)' },
          '50%': { transform: 'rotate(-1deg)' }
        },
        colorShift: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' }
        },
        bounceHorizontal: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(8px)' }
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        ping: {
          '75%, 100%': { transform: 'scale(1.2)', opacity: 0 }
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '50%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(5deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' }
        },
        lineExpand: {
          '0%': { width: '0', opacity: 0 },
          '100%': { width: '6rem', opacity: 1 }
        },
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        fadeInRight: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        },
        drip: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '50%': { transform: 'translateY(20px)', opacity: 0.5 },
          '100%': { transform: 'translateY(40px)', opacity: 0 }
        },
        bounceVertical: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.animate-fade-in-up': {
          animation: 'fadeInUp 0.8s ease-out forwards'
        },
        '.animate-float': {
          animation: 'float 6s ease-in-out infinite'
        },
        '.animate-tilt': {
          animation: 'tilt 8s ease-in-out infinite'
        },
        '.animate-color-shift': {
          animation: 'colorShift 8s infinite alternate'
        },
        '.animate-bounce-horizontal': {
          animation: 'bounceHorizontal 1.2s infinite'
        },
        '.animate-spin-slow': {
          animation: 'spin 20s linear infinite'
        },
        '.animate-ping-slow': {
          animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'
        },
        '.animate-wave': {
          animation: 'wave 1.5s ease-in-out infinite'
        },
        '.animate-flip': {
          animation: 'flip 1.2s ease-out'
        },
        '.animate-line-expand': {
          animation: 'lineExpand 1s ease-out forwards'
        },
        '.animate-fade-in-left': {
          animation: 'fadeInLeft 1s ease-out forwards'
        },
        '.animate-fade-in-right': {
          animation: 'fadeInRight 1s ease-out forwards'
        },
        '.animate-drip': {
          animation: 'drip 1.5s infinite'
        },
        '.animate-bounce-vertical': {
          animation: 'bounceVertical 1.2s infinite'
        }
      });
    })
  ]
};