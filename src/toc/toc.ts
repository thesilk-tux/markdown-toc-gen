/* eslint-disable no-control-regex */

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IHeading } from '../models/toc.interface';
import { toKebabCase } from '../utils/utils';
import { IMarkdown } from '../markdown/markdown.interface';
import { IToc } from './toc.interface';
import { TYPES } from '../types';

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
@injectable()
export class Toc implements IToc {
  private _mdPath = '';
  private _mdString = '';

  private readonly _tocPlaceholder = new RegExp(
    '<!--\\s?toc\\s?-->\n?(?<toc>(?:.*\n)+)<!--\\s?tocstop\\s?-->\n'
  );
  private readonly _tocStart = '<!-- toc -->\n';
  private readonly _tocStop = '<!-- tocstop -->\n';
  private readonly _indentation = '  ';
  private readonly _hyphen = '- ';

  public get filePath(): string {
    return this._mdPath;
  }

  public set filePath(path: string) {
    this._mdPath = path;
    this._mdString = this._mdService.parseMarkdown(path);
  }

  constructor(@inject(TYPES.MarkdownService) private _mdService: IMarkdown) {}

  /**
   * create table of content
   * @returns table of content
   */
  public createToc(): string {
    let toc = '';
    const cleandedContent = this._mdService.removeCodeBlocks(this._mdString);

    this._mdService
      .parseHeadings(cleandedContent)
      .forEach((heading: IHeading) => {
        toc +=
          this._indentation.repeat(heading.level - 1) +
          this._hyphen +
          this.createTocEntry(heading.heading, heading.counter) +
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
      this._mdService.updateMarkdown(this.filePath, mdWithToc);
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
