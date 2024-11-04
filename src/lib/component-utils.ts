export interface ComponentInfo {
  name: string;
  path: string;
  category: string;
}

export function sanitizeCategoryName(category: string): string {
  return category
    .replace(/^\d+/, '')
    .split(/[\s+]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

export function sanitizeComponentName(name: string): string {
  return name
    .replace(/[+]/g, 'Plus')
    .replace(/[^a-zA-Z0-9]/g, '');
}

export function groupByCategory(components: ComponentInfo[]): Record<string, ComponentInfo[]> {
  return components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentInfo[]>);
} 