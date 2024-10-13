import { Diff, diffLinesRaw, diffLinesUnified } from 'jest-diff';

import { ITocService } from './toc.interface';

/**
 * TocService
 * provides method to parse and validate toc
 */
export class TocService implements ITocService {
  private readonly _tocPlaceholder = new RegExp('<!--\\s?toc\\s?-->(?<toc>(?:.*\\r?\\n)+)<!--\\s?tocstop\\s?-->');

  /**
   * creates unique id link
   * @param caption - heading title
   * @param counter - amount of repetition of given caption (optional)
   * @returns - unique id link
   */
  public createLink(caption: string, counter?: number): string {
    if (counter) {
      return `(#${this.toLinkId(caption)}-${counter})`;
    }
    return `(#${this.toLinkId(caption)})`;
  }

  /**
   * parses and validates toc in given markdown file and evaluates given toc with generated toc
   * @return toc validation
   */
  public validateToc(parsedToc: string, expectedToc: string): string | null {
    const diffHeadings: string | null = this.getDiffHeadings(
      parsedToc.split('\n').filter((item) => item),
      expectedToc.split('\n').filter((item) => item)
    );

    if (diffHeadings) {
      return diffHeadings;
    }

    return null;
  }

  /**
   * finds and parses table of content in given markdown file
   * @returns parsed table of content
   */
  public parseToc(content: string): string {
    const match = this._tocPlaceholder.exec(content);

    if (match && match.groups && match.groups.toc) {
      return match.groups.toc;
    }
    return '';
  }

  /**
   * get diff for the headings between the parsed table of contend and the parsed headings
   * @param parsedTOCHeadings - parsed existing table of content
   * @param parsedHeadings - table of contents which is created out of the parsed headings
   * @returns diff for existing and created table of content
   */
  private getDiffHeadings(parsedTOCHeadings: string[], parsedHeadings: string[]): string | null {
    const diffHeadings: Diff[] = diffLinesRaw(parsedTOCHeadings, parsedHeadings);

    if (diffHeadings.filter((val: Diff) => val['0'] !== 0).length > 0) {
      return diffLinesUnified(parsedTOCHeadings, parsedHeadings);
    }

    return null;
  }

  /**
   * transform given string to gfm link id
   * @param str - given string which should be transformed
   * @returns - transformed string
   */
  private toLinkId(str: string): string {
    return str
      .replace(/[\s]+/g, '-')
      .replace(/[^a-zA-Z0-9-_]*/g, '')
      .toLowerCase();
  }
}
