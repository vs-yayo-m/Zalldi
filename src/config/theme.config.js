// src/config/theme.config.js

export const colors = {
  primary: {
    50: '#FFF8F3',
    100: '#FFE8D9',
    200: '#FFD1B3',
    300: '#FFB88C',
    400: '#FF9B71',
    500: '#FF6B35',
    600: '#F7931E',
    700: '#E67E00',
    800: '#CC6E00',
    900: '#995300'
  },
  orange: {
    50: '#FFF8F3',
    100: '#FFE8D9',
    200: '#FFD1B3',
    300: '#FFB88C',
    400: '#FF9B71',
    500: '#FF6B35',
    600: '#F7931E',
    700: '#E67E00',
    800: '#CC6E00',
    900: '#995300'
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#2D2D2D',
    900: '#171717'
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
}

export const gradients = {
  primary: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  primaryHover: 'linear-gradient(135deg, #F7931E 0%, #E67E00 100%)',
  orange: 'linear-gradient(to bottom right, #FF9B71, #FF6B35, #F7931E)',
  sunset: 'linear-gradient(to right, #FF6B35, #FF8C42, #FFB88C)',
  mesh: `
    radial-gradient(at 0% 0%, rgba(255, 107, 53, 0.2) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(247, 147, 30, 0.2) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(255, 107, 53, 0.2) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(247, 147, 30, 0.2) 0px, transparent 50%)
  `
}

export const shadows = {
  card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.12)',
  button: '0 4px 12px rgba(255, 107, 53, 0.3)',
  buttonHover: '0 6px 20px rgba(255, 107, 53, 0.4)',
  glow: '0 0 20px rgba(255, 107, 53, 0.3)',
  glowLarge: '0 0 40px rgba(255, 107, 53, 0.4)',
  dropdown: '0 10px 25px rgba(0, 0, 0, 0.15)',
  modal: '0 20px 50px rgba(0, 0, 0, 0.2)'
}

export const spacing = {
  containerPadding: {
    mobile: '1rem',
    tablet: '2rem',
    desktop: '3rem'
  },
  sectionGap: {
    mobile: '2rem',
    tablet: '3rem',
    desktop: '4rem'
  },
  cardPadding: {
    mobile: '1rem',
    tablet: '1.25rem',
    desktop: '1.5rem'
  }
}

export const borderRadius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  full: '9999px'
}

export const typography = {
  fontFamily: {
    sans: ['Inter', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    display: ['Poppins', 'Inter', 'SF Pro Display', '-apple-system', 'sans-serif'],
    accent: ['Outfit', 'Inter', 'sans-serif']
  },
  fontSize: {
    hero: {
      desktop: '3.5rem',
      tablet: '3rem',
      mobile: '2.25rem'
    },
    display: {
      desktop: '2.625rem',
      tablet: '2.25rem',
      mobile: '1.75rem'
    },
    heading: {
      desktop: '2rem',
      tablet: '1.75rem',
      mobile: '1.5rem'
    },
    title: '1.25rem',
    bodyLarge: '1.125rem',
    body: '1rem',
    bodySmall: '0.875rem',
    caption: '0.75rem'
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.3,
    relaxed: 1.4,
    loose: 1.6
  },
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.015em',
    normal: '0',
    wide: '0.01em'
  }
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080
}

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms'
}

export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}

export const animations = {
  durations: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '1000ms'
  },
  timings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
}

export const layout = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    container: '1280px'
  },
  minHeight: {
    screen: '100vh',
    content: 'calc(100vh - 64px)'
  }
}

export const touchTargets = {
  minimum: '44px',
  comfortable: '48px',
  large: '56px'
}

export const iconSizes = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px'
}

export default {
  colors,
  gradients,
  shadows,
  spacing,
  borderRadius,
  typography,
  breakpoints,
  zIndex,
  transitions,
  easings,
  animations,
  layout,
  touchTargets,
  iconSizes
}