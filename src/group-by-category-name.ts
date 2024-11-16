import { IconPathInfo } from "./types";

export function groupByCategoryName(components: IconPathInfo[]): Record<string, IconPathInfo[]> {
  return components.reduce((acc, component) => {
    if (!acc[component.categoryName]) {
      acc[component.categoryName] = [];
    }
    acc[component.categoryName].push(component);
    return acc;
  }, {} as Record<string, IconPathInfo[]>);
} 