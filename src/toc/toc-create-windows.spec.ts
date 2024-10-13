import { IMarkdown, MarkdownService } from '../markdown';
import { Toc } from './toc';
import { ITocService } from './toc.interface';
import { TocService } from './toc.service';

describe('toc - windows', () => {
  describe('create list', () => {
    let toc: Toc;
    let mdService: IMarkdown;
    let tocService: ITocService;

    beforeEach(() => {
      mdService = new MarkdownService();
      tocService = new TocService();
      toc = new Toc(mdService, tocService);
    });

    it('should parse basic.windows.md', () => {
      const expectedToc = '- [AAA](#aaa)\n' + '- [BBB](#bbb)\n' + '- [CCC](#ccc)\n' + '- [DDD](#ddd)\n';
      toc.filePath = './fixtures/basic.windows.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should ignore wrong levels -> wrong-levels.windows.md', () => {
      const expectedToc = '- [Caption 2](#caption-2)\n' + '- [Caption 3](#caption-3)\n';
      toc.filePath = './fixtures/wrong-levels.windows.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should handle duplicate headings -> repeated-headings.windows.md', () => {
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

      toc.filePath = './fixtures/repeated-headings.windows.md';
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

      toc.filePath = './fixtures/heading-levels.windows.md';
      expect(toc.createToc()).toBe(expectedToc);
    });

    it('should parse markdown with markdown in code block', () => {
      const expectedToc =
        '- [Heading 1](#heading-1)\n' + '  - [Subheading](#subheading)\n' + '- [Heading 2](#heading-2)\n';
      toc.filePath = './fixtures/headings-with-code-block.windows.md';
      expect(toc.createToc()).toBe(expectedToc);
    });
  });
});
