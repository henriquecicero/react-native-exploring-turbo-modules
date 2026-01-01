import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from 'app/Theme';
import AppText from './AppText';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger';

export type AppButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: AppButtonVariant;
  style?: StyleProp<ViewStyle>;
};

function colorsFor(variant: AppButtonVariant, pressed: boolean) {
  if (variant === 'secondary') {
    return {
      container: {
        backgroundColor: pressed ? '#EEF2FF' : theme.colors.surface,
        borderColor: theme.colors.border,
      },
      textColor: theme.colors.text,
    };
  }
  if (variant === 'danger') {
    return {
      container: {
        backgroundColor: pressed ? '#B91C1C' : theme.colors.danger,
        borderColor: 'transparent',
      },
      textColor: theme.colors.primaryText,
    };
  }
  return {
    container: {
      backgroundColor: pressed ? theme.colors.primaryPressed : theme.colors.primary,
      borderColor: 'transparent',
    },
    textColor: theme.colors.primaryText,
  };
}

export default function AppButton({
  title,
  variant = 'primary',
  disabled,
  style,
  ...props
}: AppButtonProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          opacity: disabled ? 0.55 : 1,
          ...colorsFor(variant, pressed && !disabled).container,
        },
        style,
      ]}
      {...props}
    >
      {({ pressed }) => {
        const { textColor } = colorsFor(variant, pressed && !disabled);
        return (
          <View style={styles.content}>
            <AppText variant="label" style={[styles.title, { color: textColor }]}>
              {title}
            </AppText>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 44,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    lineHeight: 18,
  },
});
