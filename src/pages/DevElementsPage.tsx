import { type ReactNode, useState } from 'react';

import { BookListItem } from '@/components/BookListItem';
import { Button } from '@/components/Button';
import { NoData } from '@/components/NoData';
import { SearchBox } from '@/components/SearchBox';
import { SearchCountText } from '@/components/SearchCountText';
import type { Book } from '@/types/book';

function coverImage(top: string, bottom: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="174"><rect width="120" height="174" fill="${top}"/><rect y="87" width="120" height="87" fill="${bottom}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const CONTENTS =
  '“나를 언제까지나 잊지 마, 내가 여기 있었다는 걸 기억해 줘.”\n\n하루키 월드의 빛나는 다이아몬드\n무라카미 하루키를 만나기 위해 가장 먼저 읽어야 할 책!\n\n페이지를 처음 펼치는 오늘의 젊음들에게, 그리고 오랜 기억 속에 책의 한 구절을 간직하고 있는 어제의 젊음들에게, 한결같은 울림으로 예민하고 섬세한 청춘의 감성을 전하며 영원한 필독서로 사랑받고 있는 무라카미 하루키의 대표작 『노르웨이의 숲』.';

const BOOKS: Book[] = [
  {
    isbn: 'sale',
    title: '고양이를 버리다',
    authors: ['무라카미 하루키'],
    thumbnail: coverImage('#f3e9c6', '#8fa36b'),
    price: 16000,
    salePrice: 13500,
    url: 'https://example.com/sale',
    contents: CONTENTS,
  },
  {
    isbn: 'no-sale',
    title: '노르웨이의 숲',
    authors: ['무라카미 하루키'],
    thumbnail: coverImage('#2e8b57', '#c0392b'),
    price: 13300,
    salePrice: null,
    url: 'https://example.com/no-sale',
    contents: CONTENTS,
  },
  {
    isbn: 'no-cover',
    title: '표지가 없는 책',
    authors: ['저자 A', '저자 B'],
    thumbnail: '',
    price: 9000,
    salePrice: 8100,
    url: 'https://example.com/no-cover',
    contents: '책 소개',
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 border-t border-divider pt-6">
      <p className="text-body2 text-text-subtitle">{title}</p>
      {children}
    </section>
  );
}

function toggleInSet(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function DevElementsPage() {
  const [query, setQuery] = useState('');
  const [searches, setSearches] = useState<string[]>([]);
  const [detailSearchClicks, setDetailSearchClicks] = useState(0);
  const [likedIsbns, setLikedIsbns] = useState(() => new Set(['sale']));
  const [expandedIsbns, setExpandedIsbns] = useState(() => new Set(['sale']));

  const toggleLike = (isbn: string) => setLikedIsbns((prev) => toggleInSet(prev, isbn));
  const toggleDetail = (isbn: string) => setExpandedIsbns((prev) => toggleInSet(prev, isbn));

  return (
    <div className="flex flex-col gap-10 py-10">
      <Section title="SearchBox">
        <SearchBox
          value={query}
          onValueChange={setQuery}
          onSubmit={() => setSearches((prev) => [...prev, query])}
          onDetailSearchClick={() => setDetailSearchClicks((count) => count + 1)}
        />
        <p data-testid="search-log" className="text-body2 text-text-secondary">
          검색 {searches.length}회: {searches.join(', ')} / 상세검색 {detailSearchClicks}회
        </p>
      </Section>

      <Section title="SearchCountText">
        <SearchCountText label="도서 검색 결과" count={21} />
        <SearchCountText label="찜한 책" count={1234} />
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" className="w-28.75">
            구매하기
          </Button>
          <Button variant="secondary" className="w-28.75">
            상세보기
          </Button>
          <Button variant="outline" className="w-18">
            상세검색
          </Button>
        </div>
      </Section>

      <Section title="BookListItem">
        <div>
          {BOOKS.map((book) => (
            <BookListItem
              key={book.isbn}
              book={book}
              liked={likedIsbns.has(book.isbn)}
              expanded={expandedIsbns.has(book.isbn)}
              onToggleLike={() => toggleLike(book.isbn)}
              onToggleDetail={() => toggleDetail(book.isbn)}
            />
          ))}
        </div>
      </Section>

      <Section title="NoData">
        <NoData message="검색된 결과가 없습니다." />
        <NoData message="찜한 책이 없습니다." />
      </Section>
    </div>
  );
}
