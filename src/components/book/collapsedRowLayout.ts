// 접힌 책 행과 스켈레톤 행이 같이 쓴다. 한쪽만 고치면 불러오는 동안과 결과의 행 모양이 어긋난다.
export const COLLAPSED_ROW = {
  row: 'grid grid-cols-2 gap-x-2 gap-y-3 border-b border-divider py-4 lg:flex lg:h-25 lg:items-center lg:gap-0 lg:py-0 lg:pr-4 lg:pl-12',
  main: 'col-span-2 flex min-w-0 gap-x-4 lg:flex-1 lg:items-center lg:gap-0',
  cover: 'h-17 w-12 shrink-0 lg:mr-12',
  info: 'flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-0',
  titleAuthor: 'flex min-w-0 flex-col gap-1 lg:flex-1 lg:flex-row lg:items-center lg:gap-4',
  price: 'shrink-0 lg:ml-5.5 lg:w-33',
  buyButton: 'lg:w-28.75',
  detailButton: 'order-last lg:ml-2 lg:w-28.75',
} as const;
