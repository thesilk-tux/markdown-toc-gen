import { IMarkdown, MarkdownService } from '../markdown';
import { Toc } from './toc';
import { ITocService } from './toc.interface';
import { TocService } from './toc.service';

describe('toc', () => {
  describe('insertToc', () => {
    let toc: Toc;
    let mdService: IMarkdown;
    let tocService: ITocService;

    beforeEach(() => {
      mdService = new MarkdownService();
      tocService = new TocService();
      toc = new Toc(mdService, tocService);
    });

    let spyUpdateMd: jest.SpyInstance;
    const expectedContent =
      '# Test\n' +
      '\n' +
      '<!-- toc -->\n' +
      '\n' +
      '- [Heading 1](#heading-1)\n' +
      '  - [Subheading](#subheading)\n' +
      '- [Heading 2](#heading-2)\n' +
      '\n' +
      '<!-- tocstop -->\n' +
      '\n' +
      '## Heading 1\n' +
      '\n' +
      '```\n' +
      'To use markdown-toc-gen use need an entry point:\n' +
      '\n' +
      '<!-- toc --><!-- tocstop -->\n' +
      '```\n' +
      '\n' +
      '### Subheading\n' +
      '\n' +
      '## Heading 2\n' +
      '\n';

    beforeEach(() => {
      spyUpdateMd = jest.spyOn(mdService, 'updateMarkdown').mockImplementation(() => {
        return;
      });
    });

    it('should add toc in placeholders', () => {
      toc.filePath = 'fixtures/placeholder-in-code-blocks.md';
      toc.insertToc();

      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/placeholder-in-code-blocks.md', expectedContent);
    });
  });
});
