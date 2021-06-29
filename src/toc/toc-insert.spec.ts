import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { Toc } from './toc';
import { ITocService } from './toc.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
/* eslint-disable no-useless-escape */

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
      '<!-- toc -->\n\n' +
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

    it('should add toc if no placeholders are available', () => {
      toc.filePath = 'fixtures/insert-without-placeholders.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-without-placeholders.md', expectedContent);
    });

    it('should update toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-outdated-toc.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-outdated-toc.md', expectedContent);
    });

    it('should insert toc with valid links - special characters handling', () => {
      const content =
        '# Insert with special characters\n\n' +
        '<!-- toc -->\n\n' +
        '- [@Input](#input)\n' +
        '  - [@Input() Subject$](#input-subject)\n' +
        '- [@Output](#output)\n' +
        '  - [@Output() #twitter](#output-twitter)\n' +
        '- [%Properties%](#properties)\n' +
        '  - [!prop-a](#prop-a)\n' +
        '  - [#prop-b](#prop-b)\n' +
        '  - [^prop-c](#prop-c)\n' +
        '  - [&prop-d](#prop-d)\n' +
        '  - [*prop-e*](#prop-e)\n' +
        '  - [prop_f](#prop-f)\n' +
        '  - [prop-g+](#prop-g)\n' +
        '  - [prop-h=](#prop-h)\n' +
        '  - ["prop-i"](#prop-i)\n' +
        `  - ['prop-j'](#prop-j)\n` +
        '  - [prop-k?](#prop-k)\n' +
        '  - [prop-l|](#prop-l)\n' +
        '  - [prop-m/](#prop-m)\n' +
        '  - [prop-n>](#prop-n)\n' +
        '  - [prop-o<](#prop-o)\n' +
        '  - [prop-p.,](#prop-p)\n' +
        '  - [$%@](#)\n' +
        '  - [€%@](#)\n' +
        '\n' +
        '<!-- tocstop -->\n\n' +
        '## @Input\n\n' +
        '### @Input() Subject$\n\n' +
        '## @Output\n\n' +
        '### @Output() #twitter\n\n' +
        '## %Properties%\n\n' +
        '### !prop-a\n\n' +
        '### #prop-b\n\n' +
        '### ^prop-c\n\n' +
        '### &prop-d\n\n' +
        '### *prop-e*\n\n' +
        '### prop_f\n\n' +
        '### prop-g+\n\n' +
        '### prop-h=\n\n' +
        `### \"prop-i\"\n\n` +
        `### 'prop-j'\n\n` +
        '### prop-k?\n\n' +
        '### prop-l|\n\n' +
        '### prop-m/\n\n' +
        '### prop-n>\n\n' +
        '### prop-o<\n\n' +
        '### prop-p.,\n\n' +
        '### $%@\n\n' +
        '### €%@\n';

      toc.filePath = 'fixtures/insert-with-special-characters.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-special-characters.md', content);
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

    it('should add toc if no placeholders are available with semantic error', () => {
      let actualErrorMessage = '';
      const expectedErrorMessage = [
        'Could not find placeholder',
        '<!-- toc -->',
        '<!-- tocstop -->',
        'or there is an semantic issue in your heading level.',
        'A toc insertion was not possible. Please sure the placeholders are set or your semantic is correct',
      ].join('\n');
      toc.filePath = 'fixtures/insert-without-placeholders-sematic-error.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });
});
