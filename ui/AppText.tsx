import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { theme } from 'app/Theme';

export type AppTextVariant =
  | 'title'
  | 'sectionTitle'
  | 'body'
  | 'label'
  | 'caption'
  | 'muted';

export type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

function variantStyle(variant: AppTextVariant): TextStyle {
  switch (variant) {
    case 'title':
      return { ...theme.typography.title, color: theme.colors.text };
    case 'sectionTitle':
      return { ...theme.typography.sectionTitle, color: theme.colors.text };
    case 'label':
      return { ...theme.typography.label, color: theme.colors.text };
    case 'caption':
      return { ...theme.typography.caption, color: theme.colors.mutedText };
    case 'muted':
      return { ...theme.typography.body, color: theme.colors.mutedText };
    case 'body':
    default:
      return { ...theme.typography.body, color: theme.colors.text };
  }
}

export default function AppText({
  variant = 'body',
  style,
  ...props
}: AppTextProps): React.JSX.Element {
  return <Text style={[styles.base, variantStyle(variant), style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

