import { MarkdownService } from './markdown.service';
import { toMarkdown } from '../utils/test-helper';
import { IHeading } from '../models/toc.interface';

describe('Markdown', () => {
  let md: MarkdownService;
  let content: string[];

  beforeEach(() => {
    md = new MarkdownService();
    content = [
      '# Example',
      '## Heading 1',
      '```javascript',
      'const foo = 42;',
      '```',
      '## Heading 2',
    ];
  });

  describe('#removeCodeBlocks', () => {
    let expectedContent: string[];

    beforeAll(() => {
      expectedContent = ['# Example', '## Heading 1', '', '## Heading 2'];
    });

    it('should remove gfm code block', () => {
      expect(md.removeCodeBlocks(content.join('\n'))).toBe(
        expectedContent.join('\n')
      );
    });

    it('should remove multiple gfm code block', () => {
      const actualContent = content.concat([
        '```javascript',
        'const foo = 42;',
        '```',
      ]);

      expect(md.removeCodeBlocks(actualContent.join('\n'))).toBe(
        expectedContent.concat('').join('\n')
      );
    });

    it('should remove gfm code block with leading spaces', () => {
      content[2] = '   ```javascript';

      expect(md.removeCodeBlocks(content.join('\n'))).toBe(
        expectedContent.join('\n')
      );
    });

    it('should remove gfm code block which includes empty line', () => {
      content[2] = '```javascript\n';

      expect(md.removeCodeBlocks(content.join('\n'))).toBe(
        expectedContent.join('\n')
      );
    });

    it('should remove gfm code block which includes markdown heading', () => {
      content[2] = '```markdown';
      content[3] = '## header';

      expect(md.removeCodeBlocks(content.join('\n'))).toBe(
        expectedContent.join('\n')
      );
    });
  });

  describe('#parseHeadings', () => {
    const h0Header = '# Example';
    const h1HeaderA = '## Heading A';
    const h2HeaderA = '### Heading 1';
    const h3HeaderA = '#### Heading Sub 1';
    const h1HeaderB = '## Heading B';

    it('should parse headings', () => {
      const expectedHeadings: IHeading[] = [
        {
          heading: 'Heading 1',
          level: 1,
          counter: 0,
        },
        {
          heading: 'Heading 2',
          level: 1,
          counter: 0,
        },
      ];
      expect(md.parseHeadings(toMarkdown(content))).toStrictEqual(
        expectedHeadings
      );
    });

    it('should parse with sub menus', () => {
      const customContent = [h0Header, h1HeaderA, h2HeaderA, h1HeaderB];
      const expectedHeadings: IHeading[] = [
        {
          heading: 'Heading A',
          level: 1,
          counter: 0,
        },
        {
          heading: 'Heading 1',
          level: 2,
          counter: 0,
        },
        {
          heading: 'Heading B',
          level: 1,
          counter: 0,
        },
      ];

      expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
        expectedHeadings
      );
    });

    it('should parse with sub menus and duplications', () => {
      const customContent = [
        h0Header,
        h1HeaderA,
        h2HeaderA,
        h1HeaderB,
        h2HeaderA,
        h3HeaderA,
        h1HeaderA,
      ];
      const expectedHeadings: IHeading[] = [
        {
          heading: 'Heading A',
          level: 1,
          counter: 0,
        },
        {
          heading: 'Heading 1',
          level: 2,
          counter: 0,
        },
        {
          heading: 'Heading B',
          level: 1,
          counter: 0,
        },
        {
          heading: 'Heading 1',
          level: 2,
          counter: 1,
        },
        {
          heading: 'Heading Sub 1',
          level: 3,
          counter: 0,
        },
        {
          heading: 'Heading A',
          level: 1,
          counter: 1,
        },
      ];

      expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
        expectedHeadings
      );
    });

    it('should parse max levels', () => {
      const customContent = [
        '## Heading A',
        '###### Heading 6',
        '####### Heading 7',
      ];
      const expectedHeadings: IHeading[] = [
        {
          heading: 'Heading A',
          level: 1,
          counter: 0,
        },
        {
          heading: 'Heading 6',
          level: 5,
          counter: 0,
        },
      ];

      expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
        expectedHeadings
      );
    });

    describe('maxDepth', () => {
      const customContent = [
        '# Heading 1',
        '## Heading 2',
        '### Heading 3',
        '#### Heading 4',
        '##### Heading 5',
        '###### Heading 6',
        '####### Heading 7',
      ];
      const expectedHeadings: IHeading[] = [
        {
          heading: 'Heading 2',
          level: 1,
          counter: 0,
        },
        {
          heading: 'Heading 3',
          level: 2,
          counter: 0,
        },
        {
          heading: 'Heading 4',
          level: 3,
          counter: 0,
        },
        {
          heading: 'Heading 5',
          level: 4,
          counter: 0,
        },
        {
          heading: 'Heading 6',
          level: 5,
          counter: 0,
        },
      ];

      it('should parse headings with maxDepth=4', () => {
        md.setMaxDepth(4);
        expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
          expectedHeadings.slice(0, 3)
        );
      });

      it('should parse headings with maxDepth=2', () => {
        md.setMaxDepth(2);
        expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
          expectedHeadings.slice(0, 1)
        );
      });

      it('should parse headings with maxDepth=6', () => {
        md.setMaxDepth(6);
        expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
          expectedHeadings
        );
      });

      it('should parse headings with maxDepth=7', () => {
        md.setMaxDepth(7);
        expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
          expectedHeadings
        );
      });

      it('should parse headings with maxDepth=1', () => {
        md.setMaxDepth(1);
        expect(md.parseHeadings(toMarkdown(customContent))).toStrictEqual(
          expectedHeadings
        );
      });
    });
  });
});
