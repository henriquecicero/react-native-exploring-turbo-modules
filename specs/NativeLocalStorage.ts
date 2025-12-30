import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Stores a string value for the given key.
   * Equivalent to localStorage.setItem(key, value).
   */
  setItem(value: string, key: string): void;

  /**
   * Retrieves the string value for the given key.
   * Returns null if the key does not exist.
   * Equivalent to localStorage.getItem(key).
   */
  getItem(key: string): string | null;

  /**
   * Removes the value for the given key.
   * Equivalent to localStorage.removeItem(key).
   */
  removeItem(key: string): void;

  /**
   * Clears all stored key-value pairs.
   * Equivalent to localStorage.clear().
   */
  clear(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocalStorage');
