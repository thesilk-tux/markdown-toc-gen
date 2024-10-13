import 'reflect-metadata';
import { DiContainer } from '../di-container';
import { IMarkdown } from '../markdown/markdown.interface';
import { TYPES } from '../types';
import { Toc } from './toc';
import { ITocService } from './toc.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
/* eslint-disable no-useless-escape */

describe('toc - windows', () => {
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
      '# Test\r\n\r\n' +
      '<!-- toc -->\r\n\r\n' +
      '- [Heading 1](#heading-1)\r\n' +
      '  - [Subheading](#subheading)\r\n' +
      '- [Heading 2](#heading-2)\r\n' +
      '\r\n' +
      '<!-- tocstop -->\r\n\r\n' +
      '## Heading 1\r\n\r\n' +
      '### Subheading\r\n\r\n' +
      '## Heading 2\r\n';
    const expectedErrorMessage =
      'Could not find placeholder\r\n' +
      '<!-- toc -->\r\n' +
      '<!-- tocstop -->\r\n' +
      'A toc update or insertion was not possible. Please sure the placeholder are set.';

    beforeEach(() => {
      spyUpdateMd = jest.spyOn((toc as any).mdService, 'updateMarkdown').mockImplementation(() => {
        return;
      });
    });

    it('should add toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-placeholders.windows.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-placeholders.windows.md', expectedContent);
    });

    it('should update toc in placeholders', () => {
      toc.filePath = 'fixtures/insert-with-outdated-toc.windows.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-outdated-toc.windows.md', expectedContent);
    });

    it('should add toc if no placeholders are available', () => {
      toc.filePath = 'fixtures/insert-without-placeholders.windows.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-without-placeholders.windows.md', expectedContent);
    });

    it('should insert toc with valid links - special characters handling', () => {
      const content =
        '# Insert with special characters\r\n\r\n' +
        '<!-- toc -->\r\n\r\n' +
        '- [@Input](#input)\r\n' +
        '  - [@Input() Subject$](#input-subject)\r\n' +
        '- [@Output](#output)\r\n' +
        '  - [@Output() #twitter](#output-twitter)\r\n' +
        '- [%Properties%](#properties)\r\n' +
        '  - [!prop-a](#prop-a)\r\n' +
        '  - [#prop-b](#prop-b)\r\n' +
        '  - [^prop-c](#prop-c)\r\n' +
        '  - [&prop-d](#prop-d)\r\n' +
        '  - [*prop-e*](#prop-e)\r\n' +
        '  - [prop_f](#prop_f)\r\n' +
        '  - [prop-g+](#prop-g)\r\n' +
        '  - [prop-h=](#prop-h)\r\n' +
        '  - ["prop-i"](#prop-i)\r\n' +
        `  - ['prop-j'](#prop-j)\r\n` +
        '  - [prop-k?](#prop-k)\r\n' +
        '  - [prop-l|](#prop-l)\r\n' +
        '  - [prop-m/](#prop-m)\r\n' +
        '  - [prop-n>](#prop-n)\r\n' +
        '  - [prop-o<](#prop-o)\r\n' +
        '  - [prop-p.,](#prop-p)\r\n' +
        '  - [$%@](#)\r\n' +
        '  - [€%@](#)\r\n' +
        '\r\n' +
        '<!-- tocstop -->\r\n\r\n' +
        '## @Input\r\n\r\n' +
        '### @Input() Subject$\r\n\r\n' +
        '## @Output\r\n\r\n' +
        '### @Output() #twitter\r\n\r\n' +
        '## %Properties%\r\n\r\n' +
        '### !prop-a\r\n\r\n' +
        '### #prop-b\r\n\r\n' +
        '### ^prop-c\r\n\r\n' +
        '### &prop-d\r\n\r\n' +
        '### *prop-e*\r\n\r\n' +
        '### prop_f\r\n\r\n' +
        '### prop-g+\r\n\r\n' +
        '### prop-h=\r\n\r\n' +
        `### \"prop-i\"\r\n\r\n` +
        `### 'prop-j'\r\n\r\n` +
        '### prop-k?\r\n\r\n' +
        '### prop-l|\r\n\r\n' +
        '### prop-m/\r\n\r\n' +
        '### prop-n>\r\n\r\n' +
        '### prop-o<\r\n\r\n' +
        '### prop-p.,\r\n\r\n' +
        '### $%@\r\n\r\n' +
        '### €%@\r\n';

      toc.filePath = 'fixtures/insert-with-special-characters.windows.md';
      toc.insertToc();
      expect(spyUpdateMd).toHaveBeenCalledWith('fixtures/insert-with-special-characters.windows.md', content);
    });

    it('should throw error if placeholder are in one line', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-with-placeholder-in-one-line.windows.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

    it('should throw error if only toc placeholder exists', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-without-stop-placeholder.windows.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });

    it('should throw error if only tocstop placeholder exists', () => {
      let actualErrorMessage = '';
      toc.filePath = 'fixtures/insert-without-start-placeholder.windows.md';
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
      ].join('\r\n');
      toc.filePath = 'fixtures/insert-without-placeholders-sematic-error.windows.md';
      try {
        toc.insertToc();
      } catch (err) {
        actualErrorMessage = err.message;
      }
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });
});
