import path from 'path';
import { IconPathInfo } from "./types";
import { generateCategoryName } from './generate-category-name';

export function generateIconPathInfosMap(originalSvgPaths: string[]) {
  const iconPathInfosMap = new Map<string, IconPathInfo>();
  const duplicatesMap = new Map<string, IconPathInfo[]>();
  originalSvgPaths.map(svgFilename => generateIconPathInfo(svgFilename, iconPathInfosMap, duplicatesMap))
  return {
    uniqueMap: iconPathInfosMap,
    duplicatesMap: duplicatesMap,
  }
}

function generateIconPathInfo(originalSvgPath: string, uniqueMap: Map<string, IconPathInfo>, duplicatesMap: Map<string, IconPathInfo[]>) {
    const basename = path.basename(originalSvgPath, '.svg');
    
    const pathMatch = originalSvgPath.match(/\/Icons\/(.*)\.svg$/);
    const nameMatch = originalSvgPath.match(/icon-service-(.*?)\.svg$/);
    if (!nameMatch || !pathMatch) {
      throw new Error(`Invalid SVG path: ${originalSvgPath}`);
    }
    const pathName = pathMatch[1]
    const [pathCategory] = pathName.split('/')
    const categoryName = generateCategoryName(pathCategory)
    const categoryDisplayName = pathCategory.replace(/^\w/, c => c.toUpperCase())
      .replace(/^\d+[-\s]*/, '')
      .split(/\s*\+\s*/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' + ')
    const relativeSvgPath = `${pathName}.svg`
    // Convert the name to PascalCase and remove brackets
    const componentName = nameMatch[1]
        .replace(/[+]/g, '_Plus_') // Use underscores to still pascal case the word later on
        .split(/[^a-zA-Z0-9]+/)
        .map((word: string) =>  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')
        .replace(/[^a-zA-Z0-9]/g, '');
    const id = basename.substring(0, 5)
        
    const exportAlias = componentName;
    const categoryExportAlias = componentName;

    const iconPathInfo: IconPathInfo = {
      basename,
      componentName,
      pathName,
      pathCategory,
      categoryDisplayName,
      categoryName,
      originalSvgPath,
      relativeSvgPath,
      exportAlias,
      id,
      categoryExportAlias,
    }

    const existingInfos = [
      uniqueMap.get(componentName)!,
      ...(duplicatesMap.get(componentName) ?? [])
    ].filter(Boolean);

    if (!existingInfos?.length) {
      uniqueMap.set(componentName, iconPathInfo)
      return
    }

    // If there's already an icon with the same name in the category
    const existingInfoInCategory = existingInfos.find(x => x.pathCategory === pathCategory)
    if (existingInfoInCategory) {
      existingInfoInCategory.exportAlias = `${existingInfoInCategory.componentName}${existingInfoInCategory.categoryName}${existingInfoInCategory.id}`;
      existingInfoInCategory.categoryExportAlias = `${existingInfoInCategory.componentName}${existingInfoInCategory.id}`;
      iconPathInfo.exportAlias = `${componentName}${categoryName}${id}`;
      iconPathInfo.categoryExportAlias = `${componentName}${id}`;
    }

    // If there's an icon with the same name in another category
    const existingInfoInOtherCategory = existingInfos.find(x => x.pathCategory !== pathCategory)
    if (existingInfoInOtherCategory) {
      existingInfoInOtherCategory.exportAlias = `${existingInfoInOtherCategory.componentName}${existingInfoInOtherCategory.categoryName}`;
      iconPathInfo.exportAlias = `${componentName}${categoryName}`;
    }

    existingInfos.push(iconPathInfo)

    // Make sure duplicates are only in duplicatesMap
    uniqueMap.delete(componentName)
    duplicatesMap.set(componentName, existingInfos)
  }