import React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { theme } from 'app/Theme';

export type AppTextInputProps = TextInputProps;

export default function AppTextInput({
  style,
  placeholderTextColor = theme.colors.mutedText,
  ...props
}: AppTextInputProps): React.JSX.Element {
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
});
