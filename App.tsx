import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NativeSampleModuleSpec from './specs/NativeSampleModule';

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
    const result = NativeSampleModuleSpec.validateAddress(address);
    setIsValidAddress(result);
  };

  const onPress = () => {
    const revString = NativeSampleModuleSpec.reverseString(value);
    setReversedValue(revString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          Welcome to C++ Turbo Native Module Example
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
            setCubicRoot(NativeSampleModuleSpec.cubicRoot(cubicSource))
          }
        />
        <Text>The cubic root is: {cubicRoot}</Text>
        <Text style={styles.title}>
          Welcome to C Turbo Native Module Example
        </Text>
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
          <Text>Your address is {isValidAddress ? 'valid' : 'not valid'}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});

export default App;
