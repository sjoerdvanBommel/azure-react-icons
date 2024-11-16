import { IconPathInfo } from "../types";

export function generateSvgPathToComponentMap(iconPathInfos: IconPathInfo[]): string {
  const map = iconPathInfos
    .map(({ relativeSvgPath, exportAlias }) => `  "${relativeSvgPath}": ${exportAlias},`)
    .join('\n');

  return `export const svgPathToComponentMap = {\n${map}\n};`;
}