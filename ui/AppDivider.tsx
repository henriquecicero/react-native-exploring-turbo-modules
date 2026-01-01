import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type DividerProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function AppDivider({
  size = 16,
  style,
}: DividerProps): React.JSX.Element {
  return <View style={[styles.divider, { height: size }, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    flexShrink: 0,
  },
});

