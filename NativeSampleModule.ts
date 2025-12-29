import NativeSampleModuleSpec from './specs/NativeSampleModule';

/**
 * JS-friendly wrapper around the native turbo module spec.
 * Prepare or validate inputs here before calling into native code.
 */
const NativeSampleModule = {
  reverseString(value: string) {
    const sanitized = value.trim();
    return NativeSampleModuleSpec.reverseString(sanitized);
  },
  cubicRoot(value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error('Input must be a valid number string');
    }
    return NativeSampleModuleSpec.cubicRoot(value);
  },
};

export default NativeSampleModule;
