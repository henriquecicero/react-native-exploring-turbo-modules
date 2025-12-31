import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  CounterView,
  Divider,
  LocalStorageView,
  PDFView,
  SampleModuleView,
} from './components';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.title}>
            Welcome to Turbo Native Modules Example
          </Text>
          <SampleModuleView />
          <Divider size={24} />
          <LocalStorageView />
          <Divider size={24} />
          <CounterView />
          <Divider size={24} />
          <PDFView />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default App;
