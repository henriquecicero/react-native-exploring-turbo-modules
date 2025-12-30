type Listener = (pair: { key: string; value: string }) => void;

const storage = new Map<string, string>();
const listeners: Listener[] = [];

const NativeLocalStorage = {
  setItem: (value: string, key: string) => {
    storage.set(key, value);
    listeners.forEach(listener => listener({ key, value }));
  },
  getItem: (key: string) => storage.get(key) ?? null,
  removeItem: (key: string) => {
    storage.delete(key);
  },
  clear: () => storage.clear(),
  onKeyAdded: (listener: Listener) => {
    listeners.push(listener);
    return {
      remove: () => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) {
          listeners.splice(idx, 1);
        }
      },
    };
  },
};

export default NativeLocalStorage;
