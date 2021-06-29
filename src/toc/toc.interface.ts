/**
 * interface for Toc class
 */
export interface IToc {
  createToc(): string;
  insertToc(): void;
}

/**
 * interface for Toc service
 */
export interface ITocService {
  createLink(caption: string, counter: number): string;
  validateToc(content: string, expectedToc: string): string | null;
  parseToc(content: string): string;
}
