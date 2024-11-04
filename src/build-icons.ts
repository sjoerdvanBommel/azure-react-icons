import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import optimizeSvg from './lib/svg-optimizer';
import svgToComponent from './lib/svg-to-component';
import { getAllSvgFiles, ensureDirectory, cleanDirectory } from './lib/file-utils';
import { generateIndexContent } from './lib/index-generator';
import { ComponentInfo } from './lib/component-utils';

const componentsDirName = 'components';

interface BuildOptions {
  inputDir: string;
  outputDir: string;
}

interface ProcessOptions {
  inputDir: string;
}

export const buildIcons = ({inputDir, outputDir}: BuildOptions): Promise<void> => {
  if (!inputDir || !outputDir) {
    throw new Error('Input and output dirs not specified');
  }
  const icons = getAllSvgFiles(inputDir);
  return processIcons(icons, outputDir, {inputDir});
};

async function processIcons(filenames: string[], outputDir: string, options: ProcessOptions): Promise<void> {
  cleanDirectory(outputDir);
  ensureDirectory(join(outputDir, componentsDirName));

  const components = await Promise.all(
    filenames.map(icon => processIcon(icon, outputDir, options))
  ).then(icons => icons.filter((icon): icon is ComponentInfo => !!icon));

  createIndexFile(components, outputDir);
  createTypesFile(outputDir);
}

async function processIcon(svgPath: string, outputDir: string, options: ProcessOptions) {
  const name = path.basename(svgPath, '.svg');
  const filename = name + '.tsx';
  
  const relativeDirFromInput = path.relative(options.inputDir, path.dirname(svgPath));
  const componentSubDir = path.join(componentsDirName, relativeDirFromInput);
  const relativePath = path.join(componentSubDir, filename);
  const absolutePath = path.join(outputDir, relativePath);

  try {
    ensureDirectory(path.join(outputDir, componentSubDir));
    
    const svg = readFileSync(svgPath, 'utf-8');
    const optimizedSvg = await optimizeSvg(svg);
    const { code: componentCode, name: componentName } = svgToComponent(name, optimizedSvg);
    writeFileSync(absolutePath, componentCode, 'utf-8');

    const category = path.relative(options.inputDir, path.dirname(svgPath))
      .split(path.sep)[0]
      .replace(/^\w/, c => c.toUpperCase());

    return { name: componentName, path: relativePath, category };
  } catch (err) {
    console.error(`Failed to generate component ${name}. Error: ${err}`);
    return null;
  }
}

function createIndexFile(components: ComponentInfo[], outputDir: string): void {
  const code = generateIndexContent(components);
  writeFileSync(path.join(outputDir, 'index.ts'), code, 'utf-8');
}

function createTypesFile(outputDir: string): void {
  const code = `import { SVGAttributes } from 'react';
    
export interface AzureIconProps extends SVGAttributes<SVGElement> {
  size?: string;
}`;

  writeFileSync(path.join(outputDir, 'types.ts'), code, 'utf-8');
}