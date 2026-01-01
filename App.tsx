import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CounterView, LocalStorageView, PDFView } from 'app/components';
import { SampleModuleView } from 'app/modules';
import { theme } from 'app/Theme';
import { AppDivider, AppSection, AppText } from 'app/ui';

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

          <AppSection>
            <SampleModuleView />
          </AppSection>

          <AppDivider size={theme.spacing.xl} />

          <AppSection>
            <LocalStorageView />
          </AppSection>

          <AppDivider size={theme.spacing.xl} />

          <AppSection>
            <CounterView />
          </AppSection>

          <AppDivider size={theme.spacing.xl} />

          <AppSection>
            <PDFView />
          </AppSection>
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
