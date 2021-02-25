import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { Toc } from './toc';
import { ITocService } from './toc.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('toc - windows', () => {
  describe('insertToc', () => {
    let toc: Toc;
    let mdService: IMarkdown;
    let tocService: ITocService;

    beforeEach(() => {
      mdService = new DiContainer().diContainer.get(TYPES.MarkdownService);
      tocService = new DiContainer().diContainer.get(TYPES.TocService);
      toc = new Toc(mdService, tocService);
    });

    let spyUpdateMd: jest.SpyInstance;
    const expectedContent =
      '# Test\r\n\r\n' +
      '<!-- toc -->\r\n' +
      '- [Heading 1](#heading-1)\r\n' +
      '  - [Subheading](#subheading)\r\n' +
      '- [Heading 2](#heading-2)\r\n' +
      '<!-- tocstop -->\r\n\r\n' +
      '## Heading 1\r\n\r\n' +
      '### Subheading\r\n\r\n' +
      '## Heading 2\r\n';
    const expectedErrorMessage =
      'Could not find placeholder\r\n' +
      '<!-- toc -->\r\n' +
      '<!-- tocstop -->\r\n' +
      'A toc update or insertion was not possible. Please sure the placeholder are set.';

    beforeEach(() => {
      spyUpdateMd = jest.spyOn((toc as any).mdService, 'updateMarkdown').mockImplementation(() => {
        return;
      });
    });

    it('should add toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-placeholders.windows.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-placeholders.windows.md', expectedContent);
    });

    it('should update toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-outdated-toc.windows.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-outdated-toc.windows.md', expectedContent);
    });

    it('should throw error if placeholder are in one line', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-with-placeholder-in-one-line.windows.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

    it('should throw error if only toc placeholder exists', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-without-stop-placeholder.windows.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

    it('should throw error if only tocstop placeholder exists', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-without-start-placeholder.windows.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });
});
