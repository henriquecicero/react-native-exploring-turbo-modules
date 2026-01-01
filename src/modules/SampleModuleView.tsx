import React from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from 'app/Theme';
import { NativeSampleModule } from 'app/specs';
import { AppButton, AppDivider, AppText, AppTextInput } from 'app/ui';

function SampleModuleView(): React.JSX.Element {
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
    const result = NativeSampleModule.validateAddress(address);
    setIsValidAddress(result);
  };

  const onPressReverse = () => {
    const revString = NativeSampleModule.reverseString(value);
    setReversedValue(revString);
  };

  return (
    <View>
      <AppText variant="sectionTitle" style={styles.sectionTitle}>
        Sample TurboModule
      </AppText>

      <AppText variant="label" style={styles.label}>
        Text to reverse
      </AppText>
      <AppTextInput
        placeholder="Write your text here"
        onChangeText={setValue}
        value={value}
      />
      <View style={styles.buttonRow}>
        <AppButton title="Reverse" onPress={onPressReverse} />
      </View>
      <AppText variant="caption">Reversed: {reversedValue || '—'}</AppText>

      <AppDivider size={theme.spacing.xl} />

      <AppText variant="label" style={styles.label}>
        Cubic root
      </AppText>
      <AppTextInput
        placeholder="Enter a number"
        onChangeText={setCubicSource}
        value={cubicSource}
      />
      <View style={styles.buttonRow}>
        <AppButton
          title="Get Cubic Root"
          onPress={() =>
            setCubicRoot(NativeSampleModule.cubicRoot(cubicSource))
          }
        />
      </View>
      <AppText variant="caption">Result: {String(cubicRoot)}</AppText>

      <AppDivider size={theme.spacing.xl} />

      <AppText variant="label" style={styles.label}>
        Address street
      </AppText>
      <AppTextInput
        placeholder="Street"
        onChangeText={setStreet}
        value={street}
      />
      <AppText variant="label" style={styles.label}>
        Address number
      </AppText>
      <AppTextInput placeholder="Number" onChangeText={setNum} value={num} />
      <View style={styles.buttonRow}>
        <AppButton title="Validate" onPress={onPressValidateAddress} />
      </View>
      {isValidAddress != null && (
        <AppText variant="caption">
          Your address is {isValidAddress ? 'valid' : 'not valid'}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  buttonRow: {
    marginTop: theme.spacing.md,
  },
});

export default SampleModuleView;
