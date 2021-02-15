import { Container } from 'inversify';
import { IMarkdown } from './markdown/markdown.interface';
import { MarkdownService } from './markdown/markdown.service';
import { TYPES } from './types';

/**
 * Dependency Injection container
 */
export class DiContainer {
  public diContainer: Container;

  constructor() {
    this.diContainer = new Container();
    this.diContainer
      .bind<IMarkdown>(TYPES.MarkdownService)
      .to(MarkdownService)
      .inSingletonScope();
  }
}
