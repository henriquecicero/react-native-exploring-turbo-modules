import { Alert, StyleSheet, View } from 'react-native';
import NativeWebView from 'app/specs/NativeWebView';
import { theme } from 'app/Theme';

export const WebView = () => {
  return (
    <View style={styles.container}>
      <NativeWebView
        sourceURL="https://react.dev/"
        style={styles.webview}
        onScriptLoaded={() => {
          Alert.alert('Page Loaded');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
  webview: {
    width: '100%',
    height: 360,
  },
});
