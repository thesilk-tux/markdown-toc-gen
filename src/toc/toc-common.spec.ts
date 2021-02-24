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
    const spyParseMarkdown = jest.spyOn((toc as any).mdService, 'parseMarkdown').mockImplementation(() => {
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
});
