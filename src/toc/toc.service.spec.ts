import { TocService } from './toc.service';
import { toMarkdown } from '../utils/test-helper';
import { IHeading, IHeadingValidation, IValidation } from '../models/toc.interface';

describe('TocService', () => {
  let toc: TocService;
  beforeAll(() => {
    toc = new TocService();
  });

  describe('#createLink', () => {
    it('should create link which has no duplicate caption', () => {
      expect(toc.createLink('hello world')).toBe('(#hello-world)');
    });

    it('should create link which has a duplicate caption', () => {
      expect(toc.createLink('hello world', 3)).toBe('(#hello-world-3)');
    });
  });

  describe('#parseToc', () => {
    it('should create toc headings which has no duplicate caption', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should return empty array in case of an empty toc', () => {
      const tocContent: string[] = [];
      const expectedHeadingValidation: IHeadingValidation[] = [];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should create toc headings which has duplicate caption', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
        '  - [Sub-Heading 1](#sub-heading-1-1)',
        '  - [Sub-Heading 2](#sub-heading-2-1)',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true },
        { counter: 1, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true },
        { counter: 1, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should create toc headings which has a missing link', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2]',
        '- [Heading 2](#heading-2)',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: false, validLevel: true },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should create toc headings which has an invalid link', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading)',
        '- [Heading 2](#heading-2)',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: false, validLevel: true },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should create toc headings with deep link', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- [Heading 1](#heading-1)',
        '            - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 1', level: 7, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should create toc headings with invalid link level', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        ' - [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '   - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1.5, validLink: true, validLevel: false },
        { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2.5, validLink: true, validLevel: false },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });

    it('should create toc headings with empty heading', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- Heading 1(#heading-1)',
        '  - (#sub-heading-1)',
        '  - [](#sub-heading-2)',
        '- ',
        ' ',
        '<!-- tocstop -->',
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: '', level: 2, validLink: false, validLevel: true },
      ];
      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(expectedHeadingValidation);
    });
  });
  describe('#validateToc', () => {
    it('headings should match the toc', () => {
      const tocContent: string[] = [
        '<!-- toc -->',
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
        '<!-- tocstop -->',
      ];
      const headings: IHeading[] = [
        { counter: 0, heading: 'Heading 1', level: 1 },
        { counter: 0, heading: 'Sub-Heading 1', level: 2 },
        { counter: 0, heading: 'Sub-Heading 2', level: 2 },
        { counter: 0, heading: 'Heading 2', level: 1 },
      ];
      const expectedHeadingValidation: IHeadingValidation[] = [
        { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true, validCaption: true },
        { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true, validCaption: true },
        { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true, validCaption: true },
        { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true, validCaption: true },
      ];
      const expectedValidation: IValidation = {
        existingHeadingsValidation: expectedHeadingValidation,
        missingHeadingToc: [],
      };

      expect(toc.validateToc(toMarkdown(tocContent), headings)).toStrictEqual(expectedValidation);
    });

    describe('outdated toc', () => {
      it('should detect missing headline entry in toc', () => {
        const tocContent: string[] = [
          '<!-- toc -->',
          '- [Heading 1](#heading-1)',
          '  - [Sub-Heading 1](#sub-heading-1)',
          '  - [Sub-Heading 2](#sub-heading-2)',
          '<!-- tocstop -->',
        ];
        const headings: IHeading[] = [
          { counter: 0, heading: 'Heading 1', level: 1 },
          { counter: 0, heading: 'Sub-Heading 1', level: 2 },
          { counter: 0, heading: 'Sub-Heading 2', level: 2 },
          { counter: 0, heading: 'Heading 2', level: 1 },
        ];
        const expectedHeadingValidation: IHeadingValidation[] = [
          { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true, validCaption: true },
          { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true, validCaption: true },
          { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true, validCaption: true },
        ];
        const expectedMissingContent: string[] = ['Heading 2'];
        const expectedValidation: IValidation = {
          existingHeadingsValidation: expectedHeadingValidation,
          missingHeadingToc: expectedMissingContent,
        };

        expect(toc.validateToc(toMarkdown(tocContent), headings)).toStrictEqual(expectedValidation);
      });

      it('should detect non exisitng headline entry in toc', () => {
        const tocContent: string[] = [
          '<!-- toc -->',
          '- [Heading 1](#heading-1)',
          '  - [Sub-Heading 1](#sub-heading-1)',
          '  - [Sub-Heading 2](#sub-heading-2)',
          '- [Heading 2](#heading-2)',
          '<!-- tocstop -->',
        ];
        const headings: IHeading[] = [
          { counter: 0, heading: 'Heading 1', level: 1 },
          { counter: 0, heading: 'Sub-Heading 1', level: 2 },
          { counter: 0, heading: 'Sub-Heading 2', level: 2 },
        ];
        const expectedHeadingValidation: IHeadingValidation[] = [
          { counter: 0, heading: 'Heading 1', level: 1, validLink: true, validLevel: true, validCaption: true },
          { counter: 0, heading: 'Sub-Heading 1', level: 2, validLink: true, validLevel: true, validCaption: true },
          { counter: 0, heading: 'Sub-Heading 2', level: 2, validLink: true, validLevel: true, validCaption: true },
          { counter: 0, heading: 'Heading 2', level: 1, validLink: true, validLevel: true, validCaption: false },
        ];
        const expectedValidation: IValidation = {
          existingHeadingsValidation: expectedHeadingValidation,
          missingHeadingToc: [],
        };

        expect(toc.validateToc(toMarkdown(tocContent), headings)).toStrictEqual(expectedValidation);
      });
    });
  });
});
