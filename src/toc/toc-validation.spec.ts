import { IMarkdown, MarkdownService } from '../markdown';
import { Toc } from './toc';
import { ITocService } from './toc.interface';
import { TocService } from './toc.service';
import { toMarkdown } from '../utils/test-helper';

/* eslint-disable @typescript-eslint/no-empty-function */

describe('toc', () => {
  describe('validation', () => {
    let toc: Toc;
    let mdService: IMarkdown;
    let tocService: ITocService;
    let spyParseMd: jest.SpyInstance;
    let spyLog: jest.SpyInstance;

    beforeEach(() => {
      mdService = new MarkdownService();
      tocService = new TocService();
      toc = new Toc(mdService, tocService);
      spyParseMd = jest.spyOn(mdService, 'parseMarkdown');
      spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should check valid toc', () => {
      const md = [
        '<!-- toc -->\n',
        '- [Heading 1](#heading-1)\n',
        '  - [Sub-Heading 1](#sub-heading-1)\n',
        '    - [Sub-Sub-Heading 1](#sub-sub-heading-1)\n',
        '- [Heading 2](#heading-2)\n',
        '<!-- tocstop -->\n',
        '## Heading 1\n',
        '### Sub-Heading 1\n',
        '#### Sub-Sub-Heading 1\n',
        '## Heading 2\n',
      ];
      spyParseMd.mockImplementation(() => toMarkdown(md));
      toc.filePath = 'test.md';

      expect(toc.isTocValid()).toBeTruthy();
      expect(spyLog).toHaveReturnedTimes(0);
    });

    it('should check valid toc with similar headings', () => {
      const md = [
        '<!-- toc -->\n',
        '- [Heading 1](#heading-1)\n',
        '  - [Class variables](#class-variables)\n',
        '- [Heading 2](#heading-2)\n',
        '  - [class variables](#class-variables-1)\n',
        '<!-- tocstop -->\n',
        '## Heading 1\n',
        '### Class variables\n',
        '## Heading 2\n',
        '### class variables\n',
      ];
      spyParseMd.mockImplementation(() => toMarkdown(md));
      toc.filePath = 'test.md';

      expect(toc.isTocValid()).toBeTruthy();
      expect(spyLog).toHaveReturnedTimes(0);
    });

    it('should check missing toc', () => {
      const md = ['## Heading 1\n', '### Sub-Heading 1\n', '#### Sub-Sub-Heading 1\n', '## Heading 2\n'];
      spyParseMd.mockImplementation(() => toMarkdown(md));
      toc.filePath = 'test.md';

      expect(toc.isTocValid()).toBeFalsy();
      expect(spyLog).toHaveReturnedTimes(2);
    });

    describe('invalid toc', () => {
      describe('outdated', () => {
        it('should detect missing toc entry', () => {
          const md = [
            '<!-- toc -->\n',
            '- [Heading 1](#heading-1)\n',
            '  - [Sub-Heading 1](#sub-heading-1)\n',
            '    - [Sub-Sub-Heading 1](#sub-sub-heading-1)\n',
            '<!-- tocstop -->\n',
            '## Heading 1\n',
            '### Sub-Heading 1\n',
            '#### Sub-Sub-Heading 1\n',
            '## Heading 2\n',
          ];
          spyParseMd.mockImplementation(() => toMarkdown(md));
          toc.filePath = 'test.md';

          expect(toc.isTocValid()).toBeFalsy();
          expect(spyLog).toHaveReturnedTimes(2);
        });

        it('should check deleted section with old toc entry', () => {
          const md = [
            '<!-- toc -->\n',
            '- [Heading 1](#heading-1)\n',
            '  - [Sub-Heading 1](#sub-heading-1)\n',
            '    - [Sub-Sub-Heading 1](#sub-sub-heading-1)\n',
            '- [Heading 2](#heading-2)\n',
            '<!-- tocstop -->\n',
            '## Heading 1\n',
            '### Sub-Heading 1\n',
            '#### Sub-Sub-Heading 1\n',
          ];
          spyParseMd.mockImplementation(() => toMarkdown(md));
          toc.filePath = 'test.md';

          expect(toc.isTocValid()).toBeFalsy();
          expect(spyLog).toHaveReturnedTimes(2);
        });
      });

      describe('invalid format', () => {
        it('should check missing link', () => {
          const md = [
            '<!-- toc -->\n',
            '- [Heading 1](#heading-1)\n',
            '  - [Sub-Heading 1](#sub-heading-1)\n',
            '    - [Sub-Sub-Heading 1]\n',
            '<!-- tocstop -->\n',
            '## Heading 1\n',
            '### Sub-Heading 1\n',
            '#### Sub-Sub-Heading 1\n',
          ];
          spyParseMd.mockImplementation(() => toMarkdown(md));
          toc.filePath = 'test.md';

          expect(toc.isTocValid()).toBeFalsy();
          expect(spyLog).toHaveReturnedTimes(2);
        });

        it('should check wrong indententation', () => {
          const md = [
            '<!-- toc -->\n',
            '- [Heading 1](#heading-1)\n',
            '  - [Sub-Heading 1](#sub-heading-1)\n',
            '      - [Sub-Sub-Heading 1](#sub-sub-heading-1)\n',
            '<!-- tocstop -->\n',
            '## Heading 1\n',
            '### Sub-Heading 1\n',
            '#### Sub-Sub-Heading 1\n',
          ];
          spyParseMd.mockImplementation(() => toMarkdown(md));
          toc.filePath = 'test.md';

          expect(toc.isTocValid()).toBeFalsy();
          expect(spyLog).toHaveReturnedTimes(2);
        });
      });
    });
  });
});
