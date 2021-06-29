import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { Toc } from './toc';
import { ITocService } from './toc.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('toc', () => {
  let toc: Toc;
  let mdService: IMarkdown;
  let tocService: ITocService;

  beforeEach(() => {
    mdService = new DiContainer().diContainer.get(TYPES.MarkdownService);
    tocService = new DiContainer().diContainer.get(TYPES.TocService);
    toc = new Toc(mdService, tocService);
  });

  it('should have working getter and setter method to handle filePath', () => {
    const file = './basic.md';
    const spyParseMarkdown = jest.spyOn((toc as any).mdService, 'parseMarkdown').mockImplementation(() => {
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
