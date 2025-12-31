import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export const BubblingEvent = () => {
  return (
    <View
      id="grandParent"
      style={styles.container}
      onTouchStart={e => {
        const targetId = e.target.id;

        if (targetId === 'child') {
          console.log('grandParent: event came from CHILD');
        } else if (targetId === 'sibling') {
          console.log('grandParent: event came from SIBLING');
        } else {
          console.log('grandParent: event came from something else:', targetId);
        }

        Alert.alert('bubbling event', `targetId: ${String(targetId)}`);
      }}
    >
      <View
        id="parent"
        style={styles.childContainer}
        onTouchStart={() => {
          console.log('parent: received from a child');
        }}
      >
        <View
          id="sibling"
          style={[styles.item, styles.itemGreen]}
          onTouchStart={() => console.log("sibling: I'm emitting")}
        />
        <View
          id="child"
          style={[styles.item, styles.itemViolet]}
          onTouchStart={() => console.log("child: I'm emitting")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
  },
  childContainer: {
    width: '80%',
    backgroundColor: 'lightblue',
  },
  item: {
    height: 50,
    width: '80%',
  },
  itemGreen: {
    backgroundColor: 'lightgreen',
  },
  itemViolet: {
    backgroundColor: 'violet',
  },
});
