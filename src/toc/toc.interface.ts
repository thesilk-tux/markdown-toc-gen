/**
 * interface for Toc class
 */
export interface IToc {
  createToc(): string;
  insertToc(): void;
  setMaxDepth(maxDepth: number): void;
}
