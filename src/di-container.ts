import { Container } from 'inversify';
import { IMarkdown } from './markdown/markdown.interface';
import { MarkdownService } from './markdown/markdown.service';
import { ITocService } from './toc/toc.interface';
import { TocService } from './toc/toc.service';
import { TYPES } from './types';

/**
 * Dependency Injection container
 */
export class DiContainer {
  public diContainer: Container;

  constructor() {
    this.diContainer = new Container();
    this.diContainer.bind<IMarkdown>(TYPES.MarkdownService).to(MarkdownService).inSingletonScope();
    this.diContainer.bind<ITocService>(TYPES.TocService).to(TocService).inSingletonScope();
  }
}
