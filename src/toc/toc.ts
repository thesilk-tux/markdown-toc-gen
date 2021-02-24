/* eslint-disable no-control-regex */

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IHeading, IValidation } from '../models/toc.interface';
import { Color, log } from '../utils/utils';
import { IMarkdown } from '../markdown/markdown.interface';
import { IToc, ITocService } from './toc.interface';
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

  private readonly _tocPlaceholder = new RegExp('<!--\\s?toc\\s?-->\n?(?<toc>(?:.*\n)+)<!--\\s?tocstop\\s?-->\n');
  private readonly _tocStart = '<!-- toc -->\n';
  private readonly _tocStop = '<!-- tocstop -->\n';
  private readonly _indentation = '  ';
  private readonly _hyphen = '- ';

  /** file path of markdown file */
  public get filePath(): string {
    return this._mdPath;
  }

  /** set file path of markdown file */
  public set filePath(path: string) {
    this._mdPath = path;
    this._mdString = this.mdService.parseMarkdown(path);
  }

  constructor(
    @inject(TYPES.MarkdownService) public mdService: IMarkdown,
    @inject(TYPES.TocService) public tocService: ITocService
  ) {}

  /**
   * create table of content
   * @returns table of content
   */
  public createToc(): string {
    let toc = '';
    const cleandedContent = this.mdService.removeCodeBlocks(this._mdString);

    this.mdService.parseHeadings(cleandedContent).forEach((heading: IHeading) => {
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
      const mdWithToc = this._mdString.replace(tocMatch[0], this._tocStart + this.createToc() + this._tocStop);
      this.mdService.updateMarkdown(this.filePath, mdWithToc);
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
   * set max depth for parsing headings
   */
  public setMaxDepth(maxDepth: number): void {
    this.mdService.setMaxDepth(maxDepth);
  }

  /**
   * evaluates if given toc is valid
   * the given toc will be compared with the generated toc
   * @returns is table of content valid
   */
  public isTocValid(): boolean {
    const cleandedContent = this.mdService.removeCodeBlocks(this._mdString);
    const headings: IHeading[] = this.mdService.parseHeadings(cleandedContent);
    const headingValidation: IValidation = this.tocService.validateToc(cleandedContent, headings);

    if (headingValidation.existingHeadingsValidation.length === 0) {
      log(`[ERR] Couldn't find a table of content (${this._mdPath})`, Color.RED);
      return false;
    }

    if (
      headingValidation.existingHeadingsValidation.filter(
        (item) => !item.validCaption || !item.validLevel || !item.validLink
      ).length ||
      headingValidation.missingHeadingToc.length
    ) {
      log(`[ERR] table of content is outdated (${this._mdPath})`, Color.RED);
      return false;
    }

    return true;
  }

  /**
   * create table of content entry with creating unique id
   * @param caption - headline which is a toc entry
   * @param counter - counts the amount of a given headline to create an unique id
   * @returns toc entry
   */
  private createTocEntry(caption: string, counter: number): string {
    return `[${caption}]${this.tocService.createLink(caption, counter)}`;
  }
}
