import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  AppText,
  CounterView,
  Divider,
  LocalStorageView,
  PDFView,
  Section,
} from 'app/components';
import { SampleModuleView } from 'app/modules';
import { theme } from 'app/Theme';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <AppText variant="title" style={styles.title}>
            React Native TurboModules + Fabric
          </AppText>

          <Section>
            <SampleModuleView />
          </Section>

          <Divider size={theme.spacing.xl} />

          <Section>
            <LocalStorageView />
          </Section>

          <Divider size={theme.spacing.xl} />

          <Section>
            <CounterView />
          </Section>

          <Divider size={theme.spacing.xl} />

          <Section>
            <PDFView />
          </Section>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});

export default App;
