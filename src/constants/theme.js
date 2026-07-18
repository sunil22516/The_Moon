// ─── Moon Design System ──────────────────────────────────────────────────────

export const COLORS = {
  // Backgrounds
  background: '#0A0A0A',
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  border: '#222222',
  borderLight: '#333333',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#999999',
  textTertiary: '#666666',

  // Accent
  accent: '#8B5CF6',
  accentLight: '#A78BFA',
  accentDark: '#7C3AED',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  cyan: '#06B6D4',

  // Glass
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassHeavy: 'rgba(255, 255, 255, 0.12)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayHeavy: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Semantic
  like: '#EC4899',
  likeActive: '#F472B6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const GRADIENTS = {
  accent: ['#8B5CF6', '#EC4899'],
  accentVertical: ['#7C3AED', '#DB2777'],
  dark: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)'],
  darkReverse: ['rgba(0,0,0,0.85)', 'rgba(0,0,0,0)'],
  darkFull: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)'],
  glass: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.02)'],
};

export const TYPOGRAPHY = {
  hero: { fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  captionBold: { fontSize: 13, fontWeight: '600' },
  tiny: { fontSize: 11, fontWeight: '500' },
  micro: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pill: 999,
};

export const SHADOWS = {
  glow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  glowPink: {
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
};
