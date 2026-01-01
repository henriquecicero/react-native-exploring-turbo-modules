export const theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F6F7F9',
    border: '#D0D5DD',
    text: '#101828',
    mutedText: '#667085',
    primary: '#2563EB',
    primaryPressed: '#1D4ED8',
    primaryText: '#FFFFFF',
    danger: '#DC2626',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },
  radius: {
    sm: 10,
    md: 14,
  },
  typography: {
    title: {
      fontSize: 20,
      fontWeight: '700' as const,
      letterSpacing: 0.2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700' as const,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    label: {
      fontSize: 13,
      fontWeight: '600' as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
    },
  },
} as const;

export type Theme = typeof theme;

