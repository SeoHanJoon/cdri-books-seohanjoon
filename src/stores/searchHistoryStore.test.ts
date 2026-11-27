import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

// 모듈을 새로 불러오면 store가 새로 만들어진다. 브라우저를 다시 연 것과 같다.
async function loadStore() {
  vi.resetModules();
  const { useSearchHistoryStore } = await import('@/stores/searchHistoryStore');
  return useSearchHistoryStore;
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createMemoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('검색 기록 store', () => {
  it('최근 검색어를 맨 앞에 넣는다', async () => {
    const store = await loadStore();
    store.getState().add('노르웨이 숲');
    store.getState().add('무라카미 하루키');

    expect(store.getState().keywords).toEqual(['무라카미 하루키', '노르웨이 숲']);
  });

  it('앞뒤 공백을 지우고 넣고, 빈 검색어는 넣지 않는다', async () => {
    const store = await loadStore();
    store.getState().add('  노르웨이 숲  ');
    store.getState().add('   ');

    expect(store.getState().keywords).toEqual(['노르웨이 숲']);
  });

  it('이미 있는 검색어는 하나만 남기고 맨 앞으로 옮긴다', async () => {
    const store = await loadStore();
    store.getState().add('a');
    store.getState().add('b');
    store.getState().add(' a ');

    expect(store.getState().keywords).toEqual(['a', 'b']);
  });

  it('대소문자가 다르면 다른 검색어로 본다', async () => {
    const store = await loadStore();
    store.getState().add('Harry');
    store.getState().add('harry');

    expect(store.getState().keywords).toEqual(['harry', 'Harry']);
  });

  it('8개를 넘으면 가장 오래된 검색어부터 지운다', async () => {
    const store = await loadStore();
    for (let i = 1; i <= 9; i++) store.getState().add(`검색어 ${i}`);

    expect(store.getState().keywords).toEqual([
      '검색어 9',
      '검색어 8',
      '검색어 7',
      '검색어 6',
      '검색어 5',
      '검색어 4',
      '검색어 3',
      '검색어 2',
    ]);
  });

  it('검색어 하나를 지운다', async () => {
    const store = await loadStore();
    store.getState().add('a');
    store.getState().add('b');
    store.getState().remove('a');

    expect(store.getState().keywords).toEqual(['b']);
  });

  it('브라우저를 다시 열어도 기록이 남아 있다', async () => {
    const before = await loadStore();
    before.getState().add('a');
    before.getState().add('b');

    const after = await loadStore();
    expect(after.getState().keywords).toEqual(['b', 'a']);
  });
});
