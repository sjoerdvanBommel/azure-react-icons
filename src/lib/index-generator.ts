import { ComponentInfo, sanitizeCategoryName, sanitizeComponentName, groupByCategory } from './component-utils';

function getComponentAlias(
  name: string, 
  category: string, 
  path: string, 
  components: ComponentInfo[],
  globalDuplicates: Map<string, number>,
  categoryDuplicates: Map<string, Map<string, string[]>>
): string {
  const isGlobalDuplicate = globalDuplicates.get(name)! > 1;
  const duplicatesInCategory = categoryDuplicates.get(category)!.get(name)!;
  const isCategoryDuplicate = duplicatesInCategory.length > 1;
  const numericId = path.match(/\d{5}/)?.[0] || '';
  
  const exactDuplicates = components.filter(c => name === sanitizeCategoryName(c.category));
  const exactNumberDuplicates = components.filter(c => 
    sanitizeComponentName(c.name) + (c.path.match(/\d{5}/)?.[0] || '') === name + numericId
  );
  
  if (exactNumberDuplicates.length > 1) {
    return `${name}${sanitizeCategoryName(category)}`;
  } else if (exactDuplicates.length > 1) {
    return `${name}${numericId}`;
  } else if (isCategoryDuplicate) {
    return `${name}${sanitizeCategoryName(category)}${numericId}`;
  } else if (isGlobalDuplicate) {
    return `${name}${sanitizeCategoryName(category)}`;
  }
  return name;
}

function buildDuplicatesMap(components: ComponentInfo[]): {
  globalDuplicates: Map<string, number>;
  categoryDuplicates: Map<string, Map<string, string[]>>;
} {
  const globalDuplicates = new Map<string, number>();
  const categoryDuplicates = new Map<string, Map<string, string[]>>();

  components.forEach(component => {
    const name = sanitizeComponentName(component.name);
    const category = component.category;
    const numericId = component.path.match(/\d{5}/)?.[0] || '';

    globalDuplicates.set(name, (globalDuplicates.get(name) || 0) + 1);

    if (!categoryDuplicates.has(category)) {
      categoryDuplicates.set(category, new Map());
    }
    const categoryMap = categoryDuplicates.get(category)!;
    if (!categoryMap.has(name)) {
      categoryMap.set(name, []);
    }
    categoryMap.get(name)!.push(numericId);
  });

  return { globalDuplicates, categoryDuplicates };
}

export function generateIndexContent(components: ComponentInfo[]): string {
  const { globalDuplicates, categoryDuplicates } = buildDuplicatesMap(components);

  const imports = components.map(component => {
    const name = sanitizeComponentName(component.name);
    const path = './' + component.path.replace(/\.tsx$/, '');
    const alias = getComponentAlias(name, component.category, component.path, components, globalDuplicates, categoryDuplicates);
    
    return alias !== name
      ? `import { ${name} as ${alias} } from '${path}';`
      : `import { ${name} } from '${path}';`;
  }).join('\n');

  const individualExports = components.map(component => {
    const name = sanitizeComponentName(component.name);
    const alias = getComponentAlias(name, component.category, component.path, components, globalDuplicates, categoryDuplicates);
    
    return alias !== name
      ? `export { ${alias} };`
      : `export { ${name} };`;
  }).join('\n');

  const categoryExports = generateCategoryExports(components, globalDuplicates, categoryDuplicates);
  const defaultExport = generateDefaultExport(components);

  return `${imports}\n\n${individualExports}\n\n${categoryExports}\n\n${defaultExport}\n`;
}

function generateCategoryExports(
  components: ComponentInfo[],
  globalDuplicates: Map<string, number>,
  categoryDuplicates: Map<string, Map<string, string[]>>
): string {
  return Object.entries(groupByCategory(components)).map(([category, comps]) => {
    const pascalCase = sanitizeCategoryName(category);
    const exportedNames = new Set<string>();
    const label = category
      .replace(/^\d+[-\s]*/, '')
      .split(/\s*\+\s*/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' + ');

    const exports = comps.map(comp => {
      const baseName = sanitizeComponentName(comp.name);
      const alias = getComponentAlias(baseName, comp.category, comp.path, components, globalDuplicates, categoryDuplicates);
      
      if (exportedNames.has(baseName)) {
        return null;
      }
      exportedNames.add(baseName);
      
      return `${baseName}: ${alias}`;
    }).filter(Boolean);
    
    return `export const ${pascalCase} = {
      label: '${label}',
      components: {
        ${exports.join(',\n    ')}
      }
    } as const;`;
  }).join('\n\n');
}

function generateDefaultExport(components: ComponentInfo[]): string {
  return `export default {
    ${Object.keys(groupByCategory(components))
      .map(category => {
        const pascalCase = sanitizeCategoryName(category);
        return `${pascalCase}: ${pascalCase}`;
      })
      .join(',\n    ')}
  } as const;`;
} 