import { describe, expect, it, vi } from 'vitest';

import { dispatchStorageEvent, setupMemoryStorage } from '@/stores/testStorage';
import type { Book } from '@/types/book';

function makeBook(isbn: string, overrides: Partial<Book> = {}): Book {
  return {
    isbn,
    title: `책 ${isbn}`,
    authors: ['저자'],
    thumbnail: `https://example.com/${isbn}.jpg`,
    price: 10000,
    salePrice: 9000,
    url: `https://example.com/${isbn}`,
    contents: '책 소개',
    ...overrides,
  };
}

async function loadStore() {
  vi.resetModules();
  const { useWishlistStore } = await import('@/stores/wishlistStore');
  return useWishlistStore;
}

function isbnsOf(store: Awaited<ReturnType<typeof loadStore>>) {
  return store.getState().books.map((book) => book.isbn);
}

setupMemoryStorage();

describe('찜 store', () => {
  it('최근 찜한 책을 맨 앞에 넣는다', async () => {
    const store = await loadStore();
    store.getState().toggle(makeBook('a'));
    store.getState().toggle(makeBook('b'));

    expect(isbnsOf(store)).toEqual(['b', 'a']);
  });

  it('이미 찜한 책을 다시 누르면 뺀다', async () => {
    const store = await loadStore();
    store.getState().toggle(makeBook('a'));
    store.getState().toggle(makeBook('b'));
    store.getState().toggle(makeBook('a'));

    expect(isbnsOf(store)).toEqual(['b']);
  });

  it('isbn이 같으면 가격 등 값이 달라져도 같은 책으로 보고 뺀다', async () => {
    const store = await loadStore();
    store.getState().toggle(makeBook('a', { salePrice: 9000 }));
    store.getState().toggle(makeBook('a', { salePrice: null }));

    expect(store.getState().books).toEqual([]);
  });

  it('찜을 풀었다가 다시 찜하면 맨 앞으로 온다', async () => {
    const store = await loadStore();
    store.getState().toggle(makeBook('a'));
    store.getState().toggle(makeBook('b'));
    store.getState().toggle(makeBook('a'));
    store.getState().toggle(makeBook('a'));

    expect(isbnsOf(store)).toEqual(['a', 'b']);
  });

  it('브라우저를 다시 열어도 찜한 시점의 책 정보가 그대로 남아 있다', async () => {
    const book = makeBook('a', { title: '노르웨이의 숲', salePrice: null });
    const before = await loadStore();
    before.getState().toggle(book);

    const after = await loadStore();
    expect(after.getState().books).toEqual([book]);
  });

  it('다른 탭이 바꾼 찜 목록을 받아서, 덮어쓰지 않고 이어서 쌓는다', async () => {
    const tabA = await loadStore();
    const tabB = await loadStore();

    tabA.getState().toggle(makeBook('a'));
    dispatchStorageEvent(tabA.persist.getOptions().name);
    tabB.getState().toggle(makeBook('b'));

    expect(isbnsOf(tabB)).toEqual(['b', 'a']);
    expect(isbnsOf(await loadStore())).toEqual(['b', 'a']);
  });
});
