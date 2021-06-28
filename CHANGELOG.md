# CHANGELOG

## @UNRELEASED_VERSION@

- refactor toc validation with diff print

## 0.4.4 (12.05.2021)

- validation bugfix: ignore capitalization for link evaluation in toc
- add unit tests to avoid this bug in the future
- npm audit fix (lodash)

## 0.4.3 (04.03.2021)

- change behavior of creating link id for PascalCase words

## 0.4.2 (03.03.2021)

- escape special characters for creating link

## 0.4.1 (02.03.2021)

- add empty line before tocstop placeholder

## 0.4.0 (01.03.2021)

- multiple files support for using husky with lint-staged

## 0.3.0 (25.02.2021)

- support windows carriage return and adding test cases

## 0.2.2 (24.02.2021)

- add keywords, repository and homepage to package.json

## 0.2.1 (24.02.2021)

- reorganize dependencies
- set node shebang in index.ts

## 0.2.0 (24.02.2021)

- add new logo
- format code with prettier
- refactor app and exclude logic in external service
- add maxDepth option to define max parsed heading level
- add `check` command to check if given toc is valid and exists

## 0.1.0 (13.02.2021)

- init project
