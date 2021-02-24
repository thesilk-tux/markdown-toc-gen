import { IHeading, IHeadingValidation, IValidation } from '../models/toc.interface';

/**
 * interface for Toc class
 */
export interface IToc {
  createToc(): string;
  insertToc(): void;
  setMaxDepth(maxDepth: number): void;
}

/**
 * interface for Toc service
 */
export interface ITocService {
  createLink(caption: string, counter: number): string;
  validateToc(content: string, headings: IHeading[]): IValidation;
  parseToc(content: string): IHeadingValidation[];
}
