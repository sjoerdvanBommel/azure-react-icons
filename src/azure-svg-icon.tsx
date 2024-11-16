import { svgPathToComponentMap } from "./generated";
import { AzureIconProps } from "./types";

type AzureSvgIconProps = AzureIconProps & {
    svgPath: string;
};

export function AzureSvgIcon({ svgPath, ...rest }: AzureSvgIconProps) {
  // Regex to get the last two sections of the path
  const relativePathMatch = svgPath.match(/(?:.*\/)?([^/]+\/[^/]+)/);
  const [, relativePath] = relativePathMatch || [];
  
  if (!relativePath || !svgPathToComponentMap[relativePath as keyof typeof svgPathToComponentMap]) {
    console.warn('AzureSvgIcon expects a valid SVG path. Passed svgPath:', svgPath);
    return null
  }

  const Component = svgPathToComponentMap[relativePath as keyof typeof svgPathToComponentMap];

  return <Component {...rest} />
}