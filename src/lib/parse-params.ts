import { Command } from 'commander';

interface BuildParams {
  outputDir: string;
  monochrome: boolean;
}

const program = new Command();

program
  .arguments('<output-dir>')
  .option('--monochrome', 'Strip colors from the SVG')
  .parse(process.argv);

export const parseParams = (): BuildParams => {
  return {
    outputDir: program.args[0],
    monochrome: Boolean(program.opts().monochrome),
  };
}; 