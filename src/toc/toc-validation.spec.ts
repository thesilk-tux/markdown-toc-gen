import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { toMarkdown } from '../utils/test-helper';
import { Toc } from './toc';
import { ITocService } from './toc.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

describe('toc', () => {
  describe('validation', () => {
    let toc: Toc;
    let mdService: IMarkdown;
    let tocService: ITocService;
    let spyParseMd: jest.SpyInstance;
    let spyLog: jest.SpyInstance;

    beforeEach(() => {
      mdService = new DiContainer().diContainer.get(TYPES.MarkdownService);
      tocService = new DiContainer().diContainer.get(TYPES.TocService);
      toc = new Toc(mdService, tocService);
      spyParseMd = jest.spyOn(toc.mdService, 'parseMarkdown');
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

    it('should check missing toc', () => {
      const md = ['## Heading 1\n', '### Sub-Heading 1\n', '#### Sub-Sub-Heading 1\n', '## Heading 2\n'];
      spyParseMd.mockImplementation(() => toMarkdown(md));
      toc.filePath = 'test.md';
      expect(toc.isTocValid()).toBeFalsy();
      expect(spyLog).toHaveReturnedTimes(1);
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
          expect(spyLog).toHaveReturnedTimes(1);
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
          expect(spyLog).toHaveReturnedTimes(1);
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
          expect(spyLog).toHaveReturnedTimes(1);
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
          expect(spyLog).toHaveReturnedTimes(1);
        });
      });
    });
  });
});
