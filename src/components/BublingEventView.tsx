import { theme } from 'app/Theme';
import AppText from 'app/ui/AppText';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export const BubblingEventView = () => {
  return (
    <>
      <AppText variant="sectionTitle" style={styles.title}>
        Bubbling Event
      </AppText>
      <View
        id="GRAND_PARENT"
        style={styles.container}
        onTouchStart={e => {
          const targetId = e.target.id;

          if (targetId === 'CHILD') {
            console.log('GRAND_PARENT: event came from CHILD');
          } else if (targetId === 'SIBLING') {
            console.log('GRAND_PARENT: event came from SIBLING');
          } else {
            console.log(
              'GRAND_PARENT: event came from something else:',
              targetId,
            );
          }

          Alert.alert('bubbling event', `targetId: ${String(targetId)}`);
        }}
      >
        <View
          id="PARENT"
          style={styles.childContainer}
          onTouchStart={() => {
            console.log('PARENT: received from a CHILD');
          }}
        >
          <View
            id="SIBLING"
            style={[styles.item, styles.itemGreen]}
            onTouchStart={() => console.log("SIBLING: I'm emitting")}
          />
          <View
            id="CHILD"
            style={[styles.item, styles.itemViolet]}
            onTouchStart={() => console.log("CHILD: I'm emitting")}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.border,
    borderWidth: 1,
    flexDirection: 'column',
    padding: theme.spacing.sm,
  },
  childContainer: {
    width: '80%',
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.sm,
  },
  item: {
    height: 50,
    width: '70%',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  itemGreen: {
    backgroundColor: 'lightgreen',
  },
  itemViolet: {
    backgroundColor: 'violet',
  },
  title: {
    marginBottom: theme.spacing.md,
  },
});
