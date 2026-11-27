import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { syncAcrossTabs } from '@/stores/syncAcrossTabs';

const MAX_SEARCH_HISTORY = 8;

interface SearchHistoryState {
  keywords: string[];
  add: (keyword: string) => void;
  remove: (keyword: string) => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      keywords: [],
      add: (keyword) => {
        const trimmed = keyword.trim();
        if (trimmed === '') return;
        set(({ keywords }) => ({
          keywords: [trimmed, ...keywords.filter((item) => item !== trimmed)].slice(
            0,
            MAX_SEARCH_HISTORY,
          ),
        }));
      },
      remove: (keyword) =>
        set(({ keywords }) => ({ keywords: keywords.filter((item) => item !== keyword) })),
    }),
    {
      name: 'cdri-books/search-history',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ keywords }) => ({ keywords }),
    },
  ),
);

syncAcrossTabs(useSearchHistoryStore);
