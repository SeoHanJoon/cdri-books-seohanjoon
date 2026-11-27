interface PersistedStore {
  persist: {
    getOptions: () => { name?: string };
    rehydrate: () => Promise<void>;
  };
}

export function syncAcrossTabs(store: PersistedStore) {
  window.addEventListener('storage', (event) => {
    if (event.key === store.persist.getOptions().name) void store.persist.rehydrate();
  });
}
