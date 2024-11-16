import { groupByCategoryName } from "../group-by-category-name";
import { IconPathInfo } from "../types";

export function generateCategoryExports(iconPathInfos: IconPathInfo[]): string {
    return Object.entries(groupByCategoryName(iconPathInfos)).map(([categoryName, iconPathInfosInCategory]) => {
      const exportedNames = new Set<string>();
      const label = iconPathInfosInCategory[0].categoryDisplayName;
      const exports = iconPathInfosInCategory.map(iconPathInfo => {
        exportedNames.add(iconPathInfo.exportAlias);
        
        if (iconPathInfo.categoryExportAlias !== iconPathInfo.exportAlias) {
          return `${iconPathInfo.categoryExportAlias}: ${iconPathInfo.exportAlias}`;
        }
  
        return iconPathInfo.categoryExportAlias;
      });
      
      return `export const ${categoryName}Category = {
  label: '${label}',
  components: {
    ${exports.join(',\n    ')}
  }
} as const;`;
    }).join('\n\n');
  }
  