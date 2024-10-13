#!/usr/bin/env node

import { existsSync } from 'fs';
import yargs from 'yargs';
import { Toc } from './src/toc/toc';
import { Color, log } from './src/utils/utils';
import { exit } from 'process';

enum Command {
  INSERT = 'insert',
  DRYRUN = 'dryrun',
  CHECK = 'check',
}

yargs(process.argv.slice(2))
  .scriptName('markdown-toc-gen')
  .usage('Usage: $0 <command> [options]')
  .example('$0 insert README.md', 'insert table of content for README.md')
  .example('$0 insert ./**/README.md', 'insert table of content for given README.md files')
  .example('$0 update README.md', 'update existing table of content for README.md')
  .example('$0 dry-run README.md', 'test toc creation for given README.md')
  .example('$0 dry-run ./**/README.md', 'test toc creation for given README.md files')
  .example('$0 check ./**/README.md', 'validates toc for given README.md files')
  .option('d', {
    alias: 'max-depth',
    describe: 'max depth for header parsing (default: 6)',
    type: 'number',
  })
  .command(['insert [files..]', 'update'], 'insert/update the toc in given markdown file', {}, (argv) =>
    execCommand(Command.INSERT, argv)
  )
  .command(['dry-run [files..]'], 'returns only created markdown toc without changing given file', {}, (argv) =>
    execCommand(Command.DRYRUN, argv)
  )
  .command(['check [files..]'], 'check if toc exists or if toc is outdated', {}, (argv) =>
    execCommand(Command.CHECK, argv)
  )
  .demandCommand()
  .recommendCommands()
  .strict()
  .wrap(120)
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright 2021-2024 by TheSilk')
  .epilog('Released under MIT License')
  .version()
  .help().argv;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function execCommand(cmd: Command, argv: any) {
  const toc: Toc = new Toc();
  let globalValid = true;

  let filePath: string;
  for (filePath of argv.files) {
    if (!filePath.includes('node_modules')) {
      const maxDepth = argv.maxDepth as number;
      if (existsSync(filePath)) {
        if (maxDepth) {
          toc.maxDepth = maxDepth;
        }
        toc.filePath = filePath;
        switch (cmd) {
          case Command.INSERT:
            log(`generating toc for ${filePath}`, Color.BLUE);
            try {
              toc.insertToc();
            } catch (e) {
              log(e.message, Color.YELLOW);
            }
            break;

          case Command.DRYRUN:
            log(`generating toc for ${filePath} without updating/insertion`, Color.BLUE);
            log(toc.createToc());
            break;

          case Command.CHECK: {
            const isValid = toc.isTocValid();
            globalValid = globalValid && isValid;

            isValid
              ? log(`validation of ${filePath} passed`, Color.GREEN)
              : log(`validation of ${filePath} failed`, Color.RED);
            break;
          }
        }
      }
    }
  }

  if (cmd === Command.CHECK) {
    if (globalValid) {
      log('validation passed', Color.GREEN);
      exit(0);
    }
    log('validation failed', Color.RED);
    exit(1);
  }
}
