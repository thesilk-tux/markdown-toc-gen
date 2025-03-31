/* eslint-disable no-control-regex */

import { IHeading } from '../models/toc.interface';
import { IMarkdown, MarkdownService } from '../markdown';
import { IToc, ITocService } from './toc.interface';
import { TocService } from './toc.service';

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
export class Toc implements IToc {
  private _isWindows = false;

  private _mdPath = '';
  private _mdString = '';

  private readonly _tocPlaceholder = new RegExp(
    '(?<toc>(<!--\\s?toc\\s?-->\n?(?<tocInline>(?:.*?\n)*?)<!--\\s?tocstop\\s?-->\n))'
  );
  private readonly _tocStart = '<!-- toc -->\n';
  private readonly _tocStop = '<!-- tocstop -->\n';
  private readonly _indentation = '  ';
  private readonly _hyphen = '- ';
  private readonly _carriageReturn = '\r\n';
  private readonly _lineFeed = '\n';

  /** file path of markdown file */
  public get filePath(): string {
    return this._mdPath;
  }

  /** set file path of markdown file */
  public set filePath(path: string) {
    this._mdPath = path;
    const mdString = this.mdService.parseMarkdown(path);
    this._isWindows = mdString.includes(this._carriageReturn);
    this._mdString = mdString.replace(new RegExp(this._carriageReturn, 'g'), this._lineFeed);
  }

  /**
   * set max depth for parsing headings
   */
  public set maxDepth(value: number) {
    this.mdService.setMaxDepth(value);
  }

  /**
   * returns carriage return for windows os and linefeed for unix systems
   */
  private get newLineChar(): string {
    return this._isWindows ? this._carriageReturn : this._lineFeed;
  }

  constructor(
    public mdService: IMarkdown = new MarkdownService(),
    public tocService: ITocService = new TocService()
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
        this._lineFeed;
    });

    return toc;
  }

  /**
   * insert/update toc in given markdown file
   */
  public insertToc(): void {
    const tocMatch = this._tocPlaceholder.exec(this._mdString);
    const placeholderMatch = new RegExp('<!--\\s?(toc|tocstop)\\s?-->').exec(this._mdString);

    if (tocMatch && tocMatch.groups && tocMatch.groups.toc) {
      const mdWithToc = this._mdString.replace(
        tocMatch.groups.toc,
        this._tocStart + '\n' + this.createToc() + '\n' + this._tocStop
      );
      this.mdService.updateMarkdown(
        this.filePath,
        mdWithToc.replace(new RegExp(this._lineFeed, 'g'), this.newLineChar)
      );
      return;
    } else if (placeholderMatch) {
      throw new Error(
        [
          'Could not find placeholder',
          '<!-- toc -->',
          '<!-- tocstop -->',
          'A toc update or insertion was not possible. Please sure the placeholder are set.',
        ].join(this.newLineChar)
      );
    } else {
      const toc: string = this._tocStart + '\n' + this.createToc() + '\n' + this._tocStop + '\n';
      const posFirstSecondHeading = this._mdString.search(new RegExp('\n##\\s'));

      if (posFirstSecondHeading === -1) {
        throw new Error(
          [
            'Could not find placeholder',
            '<!-- toc -->',
            '<!-- tocstop -->',
            'or there is an semantic issue in your heading level.',
            'A toc insertion was not possible. Please sure the placeholders are set or your semantic is correct',
          ].join(this.newLineChar)
        );
      }

      const replacedContent = (
        this._mdString.slice(0, posFirstSecondHeading + 1) +
        toc +
        this._mdString.slice(posFirstSecondHeading + 1)
      ).replace(new RegExp(this._lineFeed, 'g'), this.newLineChar);

      this.mdService.updateMarkdown(this.filePath, replacedContent);
      return;
    }
  }

  /**
   * evaluates if given toc is valid
   * the given toc will be compared with the generated toc
   * @returns is table of content valid
   */
  public isTocValid(): boolean {
    const parsedToc: string = this.tocService.parseToc(this.mdService.removeCodeBlocks(this._mdString));
    const expectedToc: string = this.createToc();

    const tocDiff: string | null = this.tocService.validateToc(parsedToc, expectedToc);

    if (tocDiff) {
      console.log(`validation of ${this.filePath} failed:`);
      console.log(tocDiff);
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
