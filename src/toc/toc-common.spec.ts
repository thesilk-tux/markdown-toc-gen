import { IMarkdown, MarkdownService } from '../markdown';
import { Toc } from './toc';
import { ITocService } from './toc.interface';
import { TocService } from './toc.service';

describe('toc', () => {
  let toc: Toc;
  let mdService: IMarkdown;
  let tocService: ITocService;

  beforeEach(() => {
    mdService = new MarkdownService();
    tocService = new TocService();
    toc = new Toc(mdService, tocService);
  });

  it('should have working getter and setter method to handle filePath', () => {
    const file = './basic.md';
    const spyParseMarkdown = jest.spyOn(mdService, 'parseMarkdown').mockImplementation(() => {
      return '\n';
    });
    const spyStringIncludes = jest.spyOn(String.prototype, 'includes').mockImplementation(() => {
      return false;
    });

    toc.filePath = file;

    expect(spyParseMarkdown).toHaveBeenCalledWith(file);
    expect(spyStringIncludes).toHaveBeenCalledWith('\r\n');
    expect(toc.filePath).toBe(file);
  });

  it('set max depth', () => {
    const spyMaxDepth = jest.spyOn(toc.mdService, 'setMaxDepth');

    toc.maxDepth = 5;

    expect(spyMaxDepth).toHaveBeenCalledWith(5);
  });
});
