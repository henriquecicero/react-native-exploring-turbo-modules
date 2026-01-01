import type { CodegenTypes, HostComponent, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type CounterPressEvent = {
  count: CodegenTypes.Double;
};

export interface NativeProps extends ViewProps {
  label?: string;
  count?: CodegenTypes.Double;
  onPress?: CodegenTypes.BubblingEventHandler<CounterPressEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'NativeCounterView',
) as HostComponent<NativeProps>;
