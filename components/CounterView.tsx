import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NativeCounterView from '../specs/NativeCounterView';

export const CounterView = () => {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native Counter</Text>
      <NativeCounterView
        style={styles.counter}
        label="Tap to increment"
        count={count}
        onPress={event => {
          setCount(event.nativeEvent.count);
        }}
      />
      <Text style={styles.caption}>JS count: {count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  counter: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  caption: {
    marginTop: 8,
  },
});
