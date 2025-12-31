import React from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  type EventSubscription,
} from 'react-native';

import NativeLocalStorage from '../specs/NativeLocalStorage';

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
    <>
      <Text style={styles.text}>
        Current stored value is: {valueLocalStorage ?? 'No Value'}
      </Text>
      <Text>Key:</Text>
      <TextInput
        placeholder="Enter the key you want to store"
        style={styles.textInput}
        onChangeText={setKey}
      />
      <Text>Value:</Text>
      <TextInput
        placeholder="Enter the text you want to store"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="Save" onPress={saveValue} />
      <Button title="Retrieve" onPress={retrieveValue} />
      <Button title="Delete" onPress={deleteValue} />
      <Button title="Clear" onPress={clearAll} />
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
  },
});

export default LocalStorageView;
