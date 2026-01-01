import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from 'app/Theme';
import { NativeCounterView } from 'app/specs';
import { AppText } from 'app/ui';

export const CounterView = () => {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <AppText variant="sectionTitle" style={styles.title}>
        Native Counter
      </AppText>
      <NativeCounterView
        style={styles.counter}
        label="Tap to increment"
        count={count}
        onPress={event => {
          setCount(event.nativeEvent.count);
        }}
      />
      <AppText variant="caption" style={styles.caption}>
        JS count: {count}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  counter: {
    width: '100%',
    height: 80,
  },
  caption: {
    marginTop: theme.spacing.md,
  },
});
