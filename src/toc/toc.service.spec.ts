import { TocService } from './toc.service';
import { toMarkdown } from '../utils/test-helper';

describe('TocService', () => {
  let toc: TocService;
  beforeAll(() => {
    toc = new TocService();
  });

  describe('#createLink', () => {
    it('should create link which has no duplicate caption', () => {
      expect(toc.createLink('hello world')).toBe('(#hello-world)');
      expect(toc.createLink('"hello world"')).toBe('(#hello-world)');
      expect(toc.createLink('@Input() cdkDragList')).toBe('(#input-cdkdraglist)');
      expect(toc.createLink('hello_world')).toBe('(#hello-world)');
      expect(toc.createLink('#$%&!')).toBe('(#)');
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

      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual(['', ...tocContent.slice(1, 5), ''].join('\n'));
    });

    it('should return empty array in case of an empty toc', () => {
      const tocContent: string[] = [];

      expect(toc.parseToc(toMarkdown(tocContent))).toStrictEqual('');
    });
  });

  describe('#validateToc', () => {
    it('headings should match the toc', () => {
      const tocContent: string[] = [
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
      ];
      const expectedToc: string[] = [
        '- [Heading 1](#heading-1)',
        '  - [Sub-Heading 1](#sub-heading-1)',
        '  - [Sub-Heading 2](#sub-heading-2)',
        '- [Heading 2](#heading-2)',
      ];

      expect(toc.validateToc(toMarkdown(tocContent), toMarkdown(expectedToc))).toBeNull();
    });

    describe('outdated toc', () => {
      it('should detect non exisitng headline entry in toc', () => {
        const tocContent: string[] = [
          '- [Heading 1](#heading-1)',
          '  - [Sub-Heading 1](#sub-heading-1)',
          '  - [Sub-Heading 2](#sub-heading-2)',
        ];
        const expectedToc: string[] = ['- [Heading 1](#heading-1)', '  - [Sub-Heading 1](#sub-heading-1)'];

        expect(toc.validateToc(toMarkdown(tocContent), toMarkdown(expectedToc))).toContain(
          '-   - [Sub-Heading 2](#sub-heading-2)'
        );
      });

      it('should detect missing headline entry in toc', () => {
        const tocContent: string[] = [
          '- [Heading 1](#heading-1)',
          '  - [Sub-Heading 1](#sub-heading-1)',
          '- [Heading 2](#heading-2)',
        ];
        const expectedToc: string[] = [
          '- [Heading 1](#heading-1)',
          '  - [Sub-Heading 1](#sub-heading-1)',
          '  - [Sub-Heading 2](#sub-heading-2)',
          '- [Heading 2](#heading-2)',
        ];

        expect(toc.validateToc(toMarkdown(tocContent), toMarkdown(expectedToc))).toContain(
          '+   - [Sub-Heading 2](#sub-heading-2)'
        );
      });
    });
  });
});
