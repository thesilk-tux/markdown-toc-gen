import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { Toc } from './toc';
import { ITocService } from './toc.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('toc', () => {
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
      '# Test\n\n' +
      '<!-- toc -->\n' +
      '- [Heading 1](#heading-1)\n' +
      '  - [Subheading](#subheading)\n' +
      '- [Heading 2](#heading-2)\n' +
      '\n' +
      '<!-- tocstop -->\n\n' +
      '## Heading 1\n\n' +
      '### Subheading\n\n' +
      '## Heading 2\n';
    const expectedErrorMessage =
      'Could not find placeholder\n' +
      '<!-- toc -->\n' +
      '<!-- tocstop -->\n' +
      'A toc update or insertion was not possible. Please sure the placeholder are set.';

    beforeEach(() => {
      spyUpdateMd = jest.spyOn((toc as any).mdService, 'updateMarkdown').mockImplementation(() => {
        return;
      });
    });

    it('should add toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-placeholders.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-placeholders.md', expectedContent);
    });

    it('should update toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-outdated-toc.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-outdated-toc.md', expectedContent);
    });

    it('should throw error if placeholder are in one line', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-with-placeholder-in-one-line.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

    it('should throw error if only toc placeholder exists', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-without-stop-placeholder.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

    it('should throw error if only tocstop placeholder exists', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-without-start-placeholder.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });
});
