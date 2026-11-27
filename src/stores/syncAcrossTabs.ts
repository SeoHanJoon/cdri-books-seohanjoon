interface PersistedStore {
  persist: {
    getOptions: () => { name?: string };
    rehydrate: () => Promise<void>;
  };
}

// persist는 자기 탭의 state 전체를 저장하므로, 맞추지 않으면 마지막에 저장한 탭이 다른 탭의 변경을 덮어쓴다.
export function syncAcrossTabs(store: PersistedStore) {
  window.addEventListener('storage', (event) => {
    if (event.key === store.persist.getOptions().name) void store.persist.rehydrate();
  });
}
