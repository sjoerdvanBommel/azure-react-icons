import { writeFileSync } from "fs";
import path from "path";
import { generateIndexContent } from "../code-generators/generate-index";
import { IconPathInfo } from "../types";

export function writeIndex(components: IconPathInfo[], outputDir: string): void {
    const code = generateIndexContent(components);
    writeFileSync(path.join(outputDir, 'index.ts'), code, 'utf-8');
  }