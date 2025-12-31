import { Alert, StyleSheet, View } from 'react-native';
import NativeWebView from '../specs/NativeWebView';

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
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});
