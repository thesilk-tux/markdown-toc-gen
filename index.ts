import 'reflect-metadata';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { DiContainer } from './src/di-container';
import { Toc } from './src/toc/toc';

enum Command {
  INSERT = 'insert',
  DRYRUN = 'dryrun',
}

yargs(process.argv.slice(2))
  .scriptName('markdown-toc-gen')
  .usage('Usage: $0 <command> [options]')
  .example('$0 insert README.md', 'insert table of content for README.md')
  .example(
    '$0 update README.md',
    'update existing table of content for README.md'
  )
  .example('$0 dry-run README.md', 'test toc creation for given README.md')
  .option('d', {
    alias: 'max-depth',
    describe: 'max depth for header parsing (default: 6)',
    type: 'number',
  })
  .command(
    ['insert [file]', 'update'],
    'insert/update the toc in given markdown file',
    {},
    (argv) => execCommand(Command.INSERT, argv)
  )
  .command(
    ['dry-run [file]'],
    'returns only created markdown toc without changing given file',
    {},
    (argv) => execCommand(Command.DRYRUN, argv)
  )
  .demandCommand()
  .recommendCommands()
  .strict()
  .wrap(120)
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright 2021 by TheSilk')
  .epilog('Released under MIT License')
  .version()
  .help().argv;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function execCommand(cmd: Command, argv: any) {
  const toc: Toc = new DiContainer().diContainer.resolve(Toc);
  const filePath = argv.file as string;
  const maxDepth = argv.maxDepth as number;
  if (existsSync(filePath)) {
    if (maxDepth) {
      toc.setMaxDepth(maxDepth);
    }
    toc.filePath = filePath;
    switch (cmd) {
      case Command.INSERT:
        return toc.insertToc();

      case Command.DRYRUN:
        console.log(toc.createToc());
        return;
    }
  }
  throw new Error(`${argv.file} doesn't exist`);
}
