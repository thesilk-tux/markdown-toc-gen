import { injectable } from 'inversify';
import 'reflect-metadata';

import { IHeading, IHeadingValidation, IValidation } from '../models/toc.interface';
import { ITocService } from './toc.interface';

/* eslint-disable-next-line no-control-regex */

/**
 * TocService
 * provides method to parse and validate toc
 */
@injectable()
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
  public validateToc(content: string, headings: IHeading[]): IValidation {
    const parsedHeadings: IHeadingValidation[] = this.parseToc(content);
    let missingHeadingToc: string[] = headings.map((item) => item.heading);

    for (const idx in parsedHeadings) {
      const heading: IHeadingValidation | undefined = parsedHeadings[idx];
      if (heading) {
        const validCaption = !!headings.find(
          (item) => item.level === heading.level && item.heading === heading.heading && item.counter === heading.counter
        );

        parsedHeadings[idx] = {
          ...heading,
          validCaption: validCaption,
        } as IHeadingValidation;

        missingHeadingToc = missingHeadingToc.filter((item) => item !== heading.heading);
      }
    }

    return {
      existingHeadingsValidation: parsedHeadings,
      missingHeadingToc,
    };
  }

  /**
   * finds and parses table of content in given markdown file
   * @returns parsed heading validation array
   */
  public parseToc(content: string): IHeadingValidation[] {
    const headings: IHeadingValidation[] = [];
    const match = this._tocPlaceholder.exec(content);

    if (match && match.groups && match.groups.toc) {
      return this.tocToHeadings(match.groups.toc);
    }
    return headings;
  }

  /**
   * parses given toc string and checks if each toc entry is valid
   * this means a check if the generated id is valid and if the
   * heading level is correct
   * @param toc - table of content
   * @returns parsed heading validation array
   */
  private tocToHeadings(toc: string): IHeadingValidation[] {
    const headings: IHeadingValidation[] = [];
    const tocEntryRegEx = new RegExp('(?<level>\\s*)- \\[(?<heading>.*)](\\((?<link>.*)\\))?');
    const lines = toc.split('\n');

    for (const line of lines) {
      const tocEntry = tocEntryRegEx.exec(line);

      if (tocEntry && tocEntry.groups) {
        const heading = tocEntry.groups.heading || '';
        const level = ((tocEntry.groups.level?.length || 0) as number) / 2 + 1;
        const counter = headings.filter((item: IHeadingValidation) => item.heading === heading).length;
        const link = tocEntry.groups.link;
        const validLink: boolean = `(${link})` === this.createLink(heading, counter);
        const validLevel: boolean = Number.isInteger(level);

        headings.push({
          heading,
          level,
          counter,
          validLink,
          validLevel,
        });
      }
    }

    return headings;
  }
  /**
   * transform given string to gfm link id
   * @param str - given string which should be transformed
   * @returns - transformed string
   */
  private toLinkId(str: string): string {
    return str
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-zA-Z0-9-]*/g, '')
      .toLowerCase();
  }
}
