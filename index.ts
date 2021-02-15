import 'reflect-metadata';
import { existsSync } from 'fs';
import yargs from 'yargs';
import { DiContainer } from './src/di-container';
import { Toc } from './src/toc/toc';

const toc: Toc = new DiContainer().diContainer.resolve(Toc);

yargs(process.argv.slice(2))
  .scriptName('markdown-toc-gen')
  .usage('Usage: $0 <command> [options]')
  .example('$0 insert README.md', 'insert table of content for README.md')
  .example(
    '$0 update README.md',
    'update existing table of content for README.md'
  )
  .example('$0 dry-run README.md', 'test toc creation for given README.md')
  .command(
    ['insert [file]', 'update'],
    'insert/update the toc in given markdown file',
    {},
    (argv) => {
      const filePath = argv.file as string;
      if (existsSync(filePath)) {
        toc.filePath = filePath;
        return toc.insertToc();
      }
      throw new Error(`${argv.file} doesn't exist`);
    }
  )
  .command(
    ['dry-run [file]'],
    'returns only created markdown toc without changing given file',
    {},
    (argv) => {
      const filePath = argv.file as string;
      if (existsSync(filePath)) {
        toc.filePath = filePath;
        console.log(toc.createToc());
        return;
      }
      throw new Error(`${argv.file} doesn't exist`);
    }
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
