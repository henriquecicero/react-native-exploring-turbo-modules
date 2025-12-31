import React from 'react';
import {
  Alert,
  Button,
  EventSubscription,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CounterView } from './CounterView';
import Divider from './Divider';
import NativeLocalStorage from './specs/NativeLocalStorage';
import NativePDFView from './specs/NativePDFView';
import NativeSampleModule from './specs/NativeSampleModule';

const EMPTY = '<empty>';

function App(): React.JSX.Element {
  const [value, setValue] = React.useState('');
  const [reversedValue, setReversedValue] = React.useState('');
  const [cubicSource, setCubicSource] = React.useState('');
  const [cubicRoot, setCubicRoot] = React.useState(0);
  const [street, setStreet] = React.useState('');
  const [num, setNum] = React.useState('');
  const [isValidAddress, setIsValidAddress] = React.useState<boolean | null>(
    null,
  );
  const [valueLocalStorage, setValueLocalStorage] = React.useState<
    string | null
  >(null);
  const [editingValue, setEditingValue] = React.useState<string | null>(null);
  const [key, setKey] = React.useState<string | null>(null);
  const [pdfPage, setPdfPage] = React.useState(0);
  const [pdfPageCount, setPdfPageCount] = React.useState(0);
  const listenerSubscription = React.useRef<null | EventSubscription>(null);
  const pdfSource = 'https://www.irs.gov/pub/irs-pdf/fw4.pdf';

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

  const onPressValidateAddress = () => {
    let houseNum = parseInt(num, 10);
    if (isNaN(houseNum)) {
      houseNum = -1;
    }
    const address = {
      street,
      num: houseNum,
      isInUS: false,
    };
    const result = NativeSampleModule.validateAddress(address);
    setIsValidAddress(result);
  };

  const onPress = () => {
    const revString = NativeSampleModule.reverseString(value);
    setReversedValue(revString);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <Text style={styles.title}>
              Welcome to Turbo Native Modules Example
            </Text>
            <Text>Write down here the text you want to reverse</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your text here"
              onChangeText={setValue}
              value={value}
            />
            <Button title="Reverse" onPress={onPress} />
            <Text>Reversed text: {reversedValue}</Text>
            <Divider size={24} />
            <Text>For which number do you want to compute the Cubic Root?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your text here"
              onChangeText={setCubicSource}
              value={cubicSource}
            />
            <Button
              title="Get Cubic Root"
              onPress={() =>
                setCubicRoot(NativeSampleModule.cubicRoot(cubicSource))
              }
            />
            <Text>The cubic root is: {cubicRoot}</Text>
            <Divider size={24} />
            <Text>Address:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your address here"
              onChangeText={setStreet}
              value={street}
            />
            <Text>Number:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your address here"
              onChangeText={setNum}
              value={num}
            />
            <Button title="Validate" onPress={onPressValidateAddress} />
            {isValidAddress != null && (
              <Text>
                Your address is {isValidAddress ? 'valid' : 'not valid'}
              </Text>
            )}
          </View>
          <Divider size={24} />
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
          <Divider size={24} />
          <CounterView />
          <Divider size={24} />
          <View>
            <Text style={styles.sectionTitle}>Native PDF</Text>
            <Text style={styles.caption}>
              Page: {pdfPage + 1} / {pdfPageCount || '...'}
            </Text>
            <View style={styles.pdfControls}>
              <Button
                title="Prev"
                onPress={() => setPdfPage(Math.max(0, pdfPage - 1))}
              />
              <Button
                title="Next"
                onPress={() =>
                  setPdfPage(
                    pdfPageCount > 0
                      ? Math.min(pdfPageCount - 1, pdfPage + 1)
                      : pdfPage + 1,
                  )
                }
              />
            </View>
            <NativePDFView
              style={styles.pdfView}
              sourceURL={pdfSource}
              page={pdfPage}
              pagingEnabled={true}
              onLoad={event => {
                setPdfPageCount(event.nativeEvent.pageCount);
                setPdfPage(event.nativeEvent.page);
              }}
              onPageChanged={event => {
                setPdfPage(event.nativeEvent.page);
              }}
              onError={event => {
                Alert.alert('PDF Error', event.nativeEvent.message);
              }}
            />
          </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    marginTop: 6,
    marginBottom: 8,
  },
  pdfControls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pdfView: {
    width: '100%',
    height: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
  },
});

export default App;
