import { TurboModule, TurboModuleRegistry } from 'react-native';

export type Address = {
  street: string;
  num: number;
  isInUS: boolean;
};

export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string;
  readonly cubicRoot: (input: string) => number;
  readonly validateAddress: (input: Address) => boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeSampleModule');
