import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { ensureDirectory } from './ensure-dir';
import optimizeSvg from "../svg-optimizer";
import svgToComponent from "../svg-to-component";
import { IconPathInfo } from "../types";

const componentsDirName = 'components';

export async function writeComponent({ pathCategory, basename, originalSvgPath, componentName }: IconPathInfo, outputDir: string) {
    const componentSubDir = path.join(componentsDirName, pathCategory);
    const tsxPath = path.join(componentSubDir, `${basename}.tsx`);
    const tsxAbsolutePath = path.join(outputDir, tsxPath);
  
    try {
      ensureDirectory(path.join(outputDir, componentSubDir));
      
      const svg = readFileSync(originalSvgPath, 'utf-8');
      const optimizedSvg = await optimizeSvg(svg);
      const componentCode = svgToComponent(componentName, optimizedSvg);
      writeFileSync(tsxAbsolutePath, componentCode, 'utf-8');
    } catch (err) {
      console.error(`Failed to generate component ${name}. Error: ${err}`);
      return null;
    }
  }