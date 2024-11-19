import * as resourceTypeToIconPath from '@threeveloper/resource-type-to-icon-path';
import { svgPathToComponentMap } from "./generated";
import type { AzureIconProps } from "./types";

type AzureSvgIconProps = AzureIconProps & (
  { svgPath: string; resourceType?: never } | { resourceType: string; svgPath?: never });

export function AzureSvgIcon({ svgPath, resourceType, ...rest }: AzureSvgIconProps) {
  let iconPath = svgPath;

  if (resourceType) {
    if (!resourceTypeToIconPath) {
      throw new Error('resourceTypeToIconPath is not available. \
        Please pass an SVG path or install the required optional \
        dependency: npm install @threeveloper/resource-type-to-icon-path');
    }

    iconPath = resourceTypeToIconPath.getSvgPath(resourceType);
  }

  if (!iconPath) {
    console.warn('No SVG path found for resourceType:', resourceType);
    return null
  }

  // Regex to get the last two sections of the path
  const relativePathMatch = iconPath.match(/(?:.*\/)?([^/]+\/[^/]+)/);
  const [, relativePath] = relativePathMatch || [];
  
  if (!relativePath || !svgPathToComponentMap[relativePath as keyof typeof svgPathToComponentMap]) {
    console.warn('AzureSvgIcon expects a valid SVG path. Passed svgPath:', svgPath);
    return null
  }

  const Component = svgPathToComponentMap[relativePath as keyof typeof svgPathToComponentMap];

  return <Component {...rest} />
}