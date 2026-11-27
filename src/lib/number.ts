const numberFormat = new Intl.NumberFormat('ko-KR');

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}
