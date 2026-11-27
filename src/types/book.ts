export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  thumbnail: string;
  price: number;
  salePrice: number | null;
  url: string;
  contents: string;
}
