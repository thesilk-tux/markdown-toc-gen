# Relase Notes

## 1.0.1 (20.09.2021)

- remove OS restriction, windows should also be supported

## 1.0.0 (29.06.2021)

### Validation

Refactor validation and using external lib to show the diff if the table of content is outdated

### Insertion

Insert the TOC if no placeholders are available. If only a part of the placeholder is available
an error will be thrown. If the heading semantic is not correct an error will be thrown if no
placeholders are there.

## 0.4.4 (12.05.2021)

### Bugfix

Fixed a validaton error if there are duplicate headings with different capitalization.

Example which produced the validation bug and is working now:

```
## Heading 1
### Classes
## Heading 2
### classes
```

## 0.4.3 (04.03.2021)

### Bugfix

Fix the link id in toc entry. PascalCase words are now only in lowercase and not kebapcase anymore.

## 0.4.2 (03.03.2021)

### Bugfix

Special characters in the id will be removed. This prevents validation errors. It's only a quick fix so it
could be possible to rework on this topic so the links are still working.

## 0.4.1 (02.03.2021)

### Bugfix

Add empty line between generated table of content and the `tocstop` placeholder. This is needed in combination
with prettier and a headline level bigger than 2 as latest toc entry. In this case prettier add an indentation
before the `tocstop` placeholder and `markdown-toc-gen` won't detect the placeholder correctly.

## 0.4.0 (01.03.2021)

### Multiple files support

It's possible to treat multiple files at once. You have to use the `./**/README.md` syntax. Please notice that the
`node_modules` directory will be ignored. In future versions it will also be possible to exclude given directories.

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
