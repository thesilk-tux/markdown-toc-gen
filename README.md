# Markdown-toc-gen

```
                           |         |                                 |
   __ `__ \    _` |   __|  |  /   _` |   _ \ \ \  \   /  __ \          __|   _ \    __|        _` |   _ \  __ \
   |   |   |  (   |  |       <   (   |  (   | \ \  \ /   |   | _____|  |    (   |  (  _____|  (   |   __/  |   |
  _|  _|  _| \__,_| _|    _|\_\ \__,_| \___/   \_/\_/   _|  _|        \__| \___/  \___|      \__, | \___| _|  _|
                                                                                              |___/
```


<!-- toc -->
- [Install](#install)
- [Description](#description)
- [Usage](#usage)
  - [Insert toc](#insert-toc)
  - [Update toc](#update-toc)
  - [Test toc creation](#test-toc-creation)
  - [Toc lint](#toc-lint)
  - [Recommendation for library development](#recommendation-for-library-development)
- [Attention](#attention)
- [Outlook](#outlook)
- [Author](#author)
<!-- tocstop -->

## Install

Install with npm:

```bash
npm install markdown-toc-gen
```

## Description

`markdown-toc-gen` is a lightweight tool to create and update table of contents in Markdown files. The navigation of
the created toc works with [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) and
[pandoc](https://pandoc.org/). The focus was on conformity with [prettier](https://prettier.io).
So only hyphens are allowed as bullet list.

This tool can also handle duplicate headings in a Markdown file without breaking the navigation. Code blocks will be
ignored so there are no issues with code comments or Markdown in code blocks.

To use this tool you have to add the following lines in your markdown files which are separated with one or more newlines:

```markdown
<-- toc -->
<-- tocstop -->
```

The default configuration only allows to create the toc from headings with a level from 2 (`##`) to 6 (`######`). The level 1
should only used for the markdown title which shouldn't be a part of the toc. If level 1 headings are used in your markdown
`markdown-toc-gen` will ignore it for creating the toc. It's possible to define the maxDepth for parsing headings in the
range [2,6].

## Usage

```bash
Usage: markdown-toc-gen <command> [options]

Commands:
  markdown-toc-gen insert [file]   insert/update the toc in given markdown file                        [aliases: update]
  markdown-toc-gen dry-run [file]  returns only created markdown toc without changing given file

Options:
  -d, --max-depth  max depth for header parsing (default: 6)                                                    [number]
      --version  Show version number                                                                           [boolean]
      --help     Show help                                                                                     [boolean]

Examples:
  markdown-toc-gen insert README.md   insert table of content for README.md
  markdown-toc-gen update README.md   update given table of content for README.md
  markdown-toc-gen dry-run README.md  test toc creation for given README.md
  markdown-toc-gen check README.md    check if toc exists or it toc is outdated

copyright 2021 by TheSilk
Released under MIT License
```

### Insert toc

After adding the placeholders in your markdown file you can add the generated toc with

```bash
markdown-toc-gen insert README.md
```

### Update toc

Updating an existing toc is also no issue. With the following command the existing toc will be updated.

```bash
markdown-toc-gen insert README.md
```

### Test toc creation

It is also possible to test the toc creation with a `dry-run` mode. In this mode the headings will be parsed and printed
to STDOUT. There are no modifications on the given file.

```bash
markdown-toc-gen dry-run README.md
```

### Toc lint

It is possible to check if a given Markdown file has a table of content or if the toc is outdated. Use cases could
be a CI integration to avoid pushing Markdown files with outdated tocs.

```bash
markdown-toc-gen check README.md
```

### Recommendation for library development

If you develop on a library with many components inside and each have an own README.md I can recommend to use
`markdown-toc` in combination with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/typicode/husky).
With these tools you can create a pre-commit hook which updates or inserts a toc to each staged markdown file.
This can prevent to push an outdated table of content. An example `package.json` configuration could be:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "linters": {
      "**/README.md": "markdown-toc-gen insert"
    }
  }
}
```

## Attention

Please be aware of manipulation your markdown file with this tool should work in the most cases. There are many tests
which are cover many edge cases. But sometimes it is not possible to handle all of them. So I recommend to use this tool
only with files in VCS environment or in local copies. The use of this tool is at your sole risk, so I can not accept any
liability for any misconduct and damaged files.

`markdown-toc-gen` is tested with a Linux operating system. MacOS should also work. It's not tested with Windows. A
carriage return can cause some issues. The next version `0.3` will take care about that.

## Outlook

- add html tags to the headings to support other markdown parsers
- should also work with stdin content
- add comment in markdown that the toc is autogenerated
- insertion (not updating) should also work with only the beginning placeholder
- differentiate between warnings and errors for validationg markdown tocs

## Author

Copyright 2021 by TheSilk. Released under MIT License
