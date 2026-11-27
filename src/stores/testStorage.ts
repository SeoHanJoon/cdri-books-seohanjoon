import { afterEach, beforeEach, vi } from 'vitest';

function createMemoryStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => items.delete(key),
    setItem: (key, value) => items.set(key, String(value)),
  };
}

// Vitest는 Node 환경이고, Node의 localStorage는 --localstorage-file 없이는 쓸 수 없다.
export function setupMemoryStorage() {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    vi.stubGlobal('window', new EventTarget());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
}

export function dispatchStorageEvent(key: string | undefined) {
  window.dispatchEvent(Object.assign(new Event('storage'), { key }));
}
