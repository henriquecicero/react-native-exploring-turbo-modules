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
};

export default NativeSampleModule;
