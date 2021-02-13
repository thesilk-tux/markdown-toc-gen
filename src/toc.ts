/* eslint-disable no-control-regex */

import { readFileSync, writeFileSync } from 'fs';
import { IHeading } from './toc.interface';
import { toKebabCase } from './utils';

/**
 * Toc
 *
 * class to parse and insert/update markdown files with
 * a generated table of content
 *
 * To create a toc it is necessary that the markdown file
 * has the following placeholder
 *
 * <!-- toc -->
 * <!-- tocstop -->
 */
export class Toc {
  private _mdPath: string;
  private _mdString: string;

  private readonly _headingsRegEx = new RegExp('^(#{2,6})(.*)$');
  // TODO: extract this functionality to code-blocks.ts
  private readonly _codeblockRegEx = new RegExp(
    '(```[a-z]*\n[\\s\\S]*?\n```)',
    'g'
  );
  private readonly _tocPlaceholder = new RegExp(
    '<!--\\s?toc\\s?-->\n?(?<toc>(?:.*\n)+)<!--\\s?tocstop\\s?-->\n'
  );
  private readonly _tocStart = '<!-- toc -->\n';
  private readonly _tocStop = '<!-- tocstop -->\n';
  private readonly _indentation = '  ';
  private readonly _hyphen = '- ';

  constructor(mdPath: string) {
    this._mdPath = mdPath;
    this._mdString = this.parseMarkdown();
  }

  /**
   * create table of content
   * @returns table of content
   */
  public createToc(): string {
    let toc = '';
    this.extractHeadings().forEach((heading: IHeading) => {
      toc +=
        this._indentation.repeat(heading.level - 2) +
        this._hyphen +
        this.createTocEntry(heading.caption, heading.counter) +
        '\n';
    });

    return toc;
  }

  /**
   * insert/update toc in given markdown file
   */
  public insertToc(): void {
    const tocMatch = this._tocPlaceholder.exec(this._mdString);
    if (tocMatch && tocMatch[0]) {
      const mdWithToc = this._mdString.replace(
        tocMatch[0],
        this._tocStart + this.createToc() + this._tocStop
      );
      this.updateMarkdown(mdWithToc);
      return;
    }
    throw new Error(
      'Could not find placeholder\n' +
        '<!-- toc -->\n' +
        '<!-- tocstop -->\n' +
        'A toc update or insertion was not possible. Please sure the placeholder are set.\n'
    );
  }

  /**
   * parse given markdown file
   */
  private parseMarkdown(): string {
    return readFileSync(this._mdPath).toString();
  }

  /**
   * update given markdown file with toc
   * @param content - markdown file content with updated toc
   */
  private updateMarkdown(content: string): void {
    return writeFileSync(this._mdPath, content);
  }

  /*
   * extract headings from given markdown file
   * @returns collection of headings structure
   */
  private extractHeadings(): IHeading[] {
    const headings: IHeading[] = [];

    // clean code blocks which may contain markdown headings
    const cleanedMd = this._mdString.replace(this._codeblockRegEx, '');

    cleanedMd.split('\n').forEach((line: string) => {
      const match = this._headingsRegEx.exec(line);
      if (match !== null) {
        const caption = match[2]?.trim() || '';
        headings.push({
          level: match[1]?.length || 0,
          caption,
          counter: headings.filter(
            (item: IHeading) =>
              item.caption.toLowerCase() === caption.toLowerCase()
          ).length,
        });
      }
    });
    return headings;
  }

  /**
   * create table of content entry with creating unique id
   * @param caption - headline which is a toc entry
   * @param counter - counts the amount of a given headline to create an unique id
   * @returns toc entry
   */
  private createTocEntry(caption: string, counter: number): string {
    if (counter) {
      return `[${caption}](#${toKebabCase(caption)}-${counter})`;
    }
    return `[${caption}](#${toKebabCase(caption)})`;
  }
}
