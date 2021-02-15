import { readFileSync, writeFileSync } from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { IMarkdown } from './markdown.interface';
import { IHeading } from '../models/toc.interface';

const headingsRegEx = '^\\s*(?<level>#{2,6})\\s((?<heading>.*))$';
const codeBlockRegEx = '(```[a-z]*\n[\\s\\S]*?\n\\s*```)';

/**
 * MarkdownService
 * provides method to parse and manipulates markdown files
 */
@injectable()
export class MarkdownService implements IMarkdown {
  public _headingsRegEx: RegExp;
  public _codeBlockRegEx: RegExp;

  constructor() {
    this._headingsRegEx = new RegExp(headingsRegEx);
    this._codeBlockRegEx = new RegExp(codeBlockRegEx, 'g');
  }

  /**
   * parse given markdown file
   */
  public parseMarkdown(filePath: string): string {
    return readFileSync(filePath).toString();
  }

  /**
   * update given markdown file with toc
   * @param content - markdown file content with updated toc
   */
  public updateMarkdown(filePath: string, content: string): void {
    return writeFileSync(filePath, content);
  }

  /*
   * extract headings from given markdown file
   * @returns collection of headings structure
   */
  public parseHeadings(content: string): IHeading[] {
    const headings: IHeading[] = [];

    for (const line of content.split('\n')) {
      const match = this._headingsRegEx.exec(line);

      if (match && match.groups && match.groups.level && match.groups.heading) {
        const heading = match.groups.heading.trim();
        headings.push({
          heading,
          level: match.groups.level.length - 1,
          counter: headings.filter(
            (item: IHeading) =>
              item.heading?.toLowerCase() === heading.toLowerCase()
          ).length,
        });
      }
    }

    return headings;
  }

  /**
   * removes the code blocks of the given markdown
   * this is useful for parse headings and avoid parsing pseudo
   * headings in code blocks
   * @param content - markdown content which should be manipulated
   * @returns cleaned markdown content without code blocks
   */
  public removeCodeBlocks(content: string): string {
    const contentWithoutCodeblocks = content.replace(this._codeBlockRegEx, '');

    return contentWithoutCodeblocks
      .split('\n')
      .map((item: string) => item.trim())
      .join('\n');
  }
}
