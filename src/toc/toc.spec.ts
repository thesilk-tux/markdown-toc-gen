import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { Toc } from './toc';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('toc', () => {
  let toc: Toc;
  let service: IMarkdown;

  beforeEach(() => {
    service = new DiContainer().diContainer.get(TYPES.MarkdownService);
    toc = new Toc(service);
  });

  it('should have working getter and setter method to handle filePath', () => {
    const file = './basic.md';
    const spyParseMarkdown = jest
      .spyOn((toc as any)._mdService, 'parseMarkdown')
      .mockImplementation(() => {
        return;
      });
    toc.filePath = file;
    expect(spyParseMarkdown).toHaveBeenCalledWith(file);
    expect(toc.filePath).toBe(file);
  });

  it('set max depth', () => {
    const spyMaxDepth = jest.spyOn(toc, 'setMaxDepth');
    toc.setMaxDepth(5);
    expect(spyMaxDepth).toHaveBeenCalledWith(5);
  });

  describe('create list', () => {
    it('should parse basic.md', () => {
      const expectedToc =
        '- [AAA](#aaa)\n' +
        '- [BBB](#bbb)\n' +
        '- [CCC](#ccc)\n' +
        '- [DDD](#ddd)\n';
      toc.filePath = './fixtures/basic.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should ignore wrong levels -> wrong-levels.md', () => {
      const expectedToc =
        '- [Caption 2](#caption-2)\n' + '- [Caption 3](#caption-3)\n';
      toc.filePath = './fixtures/wrong-levels.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should handle duplicate headings -> repeated-headings.md', () => {
      const expectedToc =
        '- [Heading](#heading)\n' +
        '  - [Sub-heading](#sub-heading)\n' +
        '    - [Sub-sub-heading](#sub-sub-heading)\n' +
        '- [Heading](#heading-1)\n' +
        '  - [Sub-heading](#sub-heading-1)\n' +
        '    - [Sub-sub-heading](#sub-sub-heading-1)\n' +
        '- [Heading](#heading-2)\n' +
        '  - [Sub-heading](#sub-heading-2)\n' +
        '    - [Sub-sub-heading](#sub-sub-heading-2)\n';

      toc.filePath = './fixtures/repeated-headings.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should parse different heading levels', () => {
      const expectedToc =
        '- [AAA](#aaa)\n' +
        '  - [aaa](#aaa-1)\n' +
        '    - [bbb](#bbb)\n' +
        '- [BBB](#bbb-1)\n' +
        '  - [aaa](#aaa-2)\n' +
        '    - [bbb](#bbb-2)\n' +
        '- [CCC](#ccc)\n' +
        '  - [aaa](#aaa-3)\n' +
        '    - [bbb](#bbb-3)\n';

      toc.filePath = './fixtures/heading-levels.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should parse markdown with markdown in code block', () => {
      const expectedToc =
        '- [Heading 1](#heading-1)\n' +
        '  - [Subheading](#subheading)\n' +
        '- [Heading 2](#heading-2)\n';
      toc.filePath = './fixtures/headings-with-code-block.md';
      expect(toc.createToc()).toBe(expectedToc);
    });
  });

  describe('insertToc', () => {
    let spyUpdateMd: jest.SpyInstance;
    const expectedContent =
      '# Test\n' +
      '\n' +
      '<!-- toc -->\n' +
      '- [Heading 1](#heading-1)\n' +
      '  - [Subheading](#subheading)\n' +
      '- [Heading 2](#heading-2)\n' +
      '<!-- tocstop -->\n' +
      '\n' +
      '## Heading 1\n' +
      '\n' +
      '### Subheading\n' +
      '\n' +
      '## Heading 2\n';
    const expectedErrorMessage =
      'Could not find placeholder\n' +
      '<!-- toc -->\n' +
      '<!-- tocstop -->\n' +
      'A toc update or insertion was not possible. Please sure the placeholder are set.\n';

    beforeEach(() => {
      spyUpdateMd = jest
        .spyOn((toc as any)._mdService, 'updateMarkdown')
        .mockImplementation(() => {
          return;
        });
    });

    it('should add toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-placeholders.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith(
        'fixtures/insert-with-placeholders.md',
        expectedContent
      );
    });

    it('should update toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-outdated-toc.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith(
        'fixtures/insert-with-outdated-toc.md',
        expectedContent
      );
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
