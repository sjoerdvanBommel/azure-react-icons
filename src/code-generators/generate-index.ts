import { generateCategoryExports } from './generate-category-exports';
import { generateDefaultExport } from './generate-default-exports';
import { generateIconExports } from './generate-icon-exports';
import { generateIconImports } from './generate-icon-imports';
import { IconPathInfo } from "../types";
import { generateSvgPathToComponentMap } from './generate-svg-path-to-component-map';

export function generateIndexContent(iconPathInfos: IconPathInfo[]): string {
  const iconImports = generateIconImports(iconPathInfos)
  const iconExports = generateIconExports(iconPathInfos)
  const categoryExports = generateCategoryExports(iconPathInfos);
  const defaultExport = generateDefaultExport(iconPathInfos);
  const svgPathToComponentMap = generateSvgPathToComponentMap(iconPathInfos);

  return `${iconImports}\n\n${iconExports}\n\n${categoryExports}\n\n${defaultExport}\n\n${svgPathToComponentMap}`;
}
