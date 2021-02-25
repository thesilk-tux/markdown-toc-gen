# Relase Notes

## 0.3.0 (25.02.2021)

Add windows support so `markdown-toc-gen` can handle carriage return. Added new fixtures to
test these behavior.

## 0.2.2 (24.02.2021)

add keywords, repository and homepage to package.json

## 0.2.1 (24.02.2021)

Reorganize dependencies (inversify, reflect-metadata)
Set node shebang in index.ts

## 0.2.0 (24.02.2021)

### Changes

Refactor the app and exclude logic in external service.
Performance improvements.

### MaxDepth for heading level parsing

Now it's possible the set max depth level for parsing headings. The default value is 6. You can
set it between 2 and 6. This option is useful to keep the toc small.

### Check command

Add a `check` command to check if a given markdown file has a toc and if the toc is valid. This
command can be useful to integrate this in git hooks or in the CI to prevent pushing Markdown
files with outdated or no table of content.

## 0.1.0 (13.02.2021)

- init project
