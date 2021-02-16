import { IHeading } from '../models/toc.interface';

/**
 * interface for MarkdownService
 */
export interface IMarkdown {
  parseHeadings(content: string): IHeading[];
  removeCodeBlocks(content: string): string;
  parseMarkdown(filePath: string): string;
  updateMarkdown(filePath: string, content: string): void;
  setMaxDepth(maxDepth: number): void;
}
