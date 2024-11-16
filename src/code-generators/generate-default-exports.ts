import { groupByCategoryName } from "../group-by-category-name";
import { IconPathInfo } from "../types";

export function generateDefaultExport(components: IconPathInfo[]): string {
    const categoryNames = Object.keys(groupByCategoryName(components))
    return `export default {
  ${categoryNames.map(x => `${x}Category`).join(',\n  ')}
} as const;`;
  } 