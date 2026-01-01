import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { theme } from 'app/Theme';

export type SectionProps = ViewProps;

export default function Section({ style, ...props }: SectionProps) {
  return <View style={[styles.container, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
});
