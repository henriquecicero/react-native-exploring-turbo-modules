import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  type EventSubscription,
} from 'react-native';

import { theme } from 'app/Theme';
import { AppButton, AppDivider, AppText, AppTextInput } from 'app/ui';
import { NativeLocalStorage } from 'app/specs';

const EMPTY = '<empty>';

function LocalStorageView(): React.JSX.Element {
  const [valueLocalStorage, setValueLocalStorage] = React.useState<
    string | null
  >(null);
  const [editingValue, setEditingValue] = React.useState<string | null>(null);
  const [key, setKey] = React.useState<string | null>(null);

  const listenerSubscription = React.useRef<null | EventSubscription>(null);

  React.useEffect(() => {
    listenerSubscription.current = NativeLocalStorage?.onKeyAdded(pair =>
      Alert.alert(`New key added: ${pair.key} with value: ${pair.value}`),
    );

    return () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    };
  }, []);

  function saveValue() {
    if (key == null) {
      Alert.alert('Please enter a key');
      return;
    }
    NativeLocalStorage?.setItem(editingValue ?? EMPTY, key);
    setValueLocalStorage(editingValue);
  }

  function clearAll() {
    NativeLocalStorage?.clear();
    setValueLocalStorage('');
  }

  function deleteValue() {
    if (key == null) {
      Alert.alert('Please enter a key');
      return;
    }
    NativeLocalStorage?.removeItem(key);
    setValueLocalStorage('');
  }

  function retrieveValue() {
    if (key == null) {
      Alert.alert('Please enter a key');
      return;
    }
    const val = NativeLocalStorage?.getItem(key);
    setValueLocalStorage(val);
  }

  return (
    <View>
      <AppText variant="sectionTitle" style={styles.sectionTitle}>
        Native Local Storage
      </AppText>

      <AppText variant="caption" style={styles.caption}>
        Current value: {valueLocalStorage ?? 'No Value'}
      </AppText>

      <AppDivider size={theme.spacing.md} />

      <AppText variant="label" style={styles.label}>
        Key
      </AppText>
      <AppTextInput
        placeholder="Enter the key you want to store"
        onChangeText={setKey}
      />
      <AppText variant="label" style={styles.label}>
        Value
      </AppText>
      <AppTextInput
        placeholder="Enter the text you want to store"
        onChangeText={setEditingValue}
      />

      <View style={styles.buttonSpacing}>
        <AppButton title="Save" onPress={saveValue} />
      </View>
      <View style={styles.buttonSpacing}>
        <AppButton variant="secondary" title="Retrieve" onPress={retrieveValue} />
      </View>
      <View style={styles.buttonSpacing}>
        <AppButton variant="danger" title="Delete" onPress={deleteValue} />
      </View>
      <View style={styles.buttonSpacing}>
        <AppButton variant="secondary" title="Clear All" onPress={clearAll} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  caption: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  buttonSpacing: {
    marginTop: theme.spacing.md,
  },
});

export default LocalStorageView;
