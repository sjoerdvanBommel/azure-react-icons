import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import optimizeSvg from './lib/svg-optimizer';
import svgToComponent from './lib/svg2component';

const componentsDirName = 'components';

interface BuildOptions {
  inputDir: string;
  outputDir: string;
  monochrome?: boolean;
}

interface ProcessOptions {
  monochrome?: boolean;
  inputDir: string;
}

function getAllSvgFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    const entries = readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile() && entry.endsWith('.svg')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

export const buildIcons = ({inputDir, outputDir, monochrome}: BuildOptions): Promise<void> => {
  if (!inputDir || !outputDir) {
    throw new Error('Input and output dirs not specified');
  }
  const icons = getAllSvgFiles(inputDir);
  return processIcons(icons, outputDir, {monochrome, inputDir});
};

async function processIcons(filenames: string[], outputDir: string, options: ProcessOptions): Promise<void> {
  // Remove directory if it exists
  try {
    rmSync(outputDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }

  // Create directories
  try {
    mkdirSync(path.join(outputDir, componentsDirName), { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory: ${error}`);
    throw error;
  }

  const components = await Promise.all(
    filenames.map(icon => processIcon(icon, outputDir, { ...options, inputDir: options.inputDir }))
  ).then(icons => icons.filter(icon => !!icon));

  createIndexFile(components, outputDir);
  createTypesFile(outputDir);
}

async function processIcon(svgPath: string, outputDir: string, options: ProcessOptions) {
  const name = path.basename(svgPath, '.svg');
  const filename = name + '.tsx';
  
  // Get the subfolder structure from the input path
  const relativeDirFromInput = path.relative(options.inputDir, path.dirname(svgPath));
  const componentSubDir = path.join(componentsDirName, relativeDirFromInput);
  const relativePath = path.join(componentSubDir, filename);
  const absolutePath = path.join(outputDir, relativePath);

  try {
    // Create subfolder if it doesn't exist
    mkdirSync(path.join(outputDir, componentSubDir), { recursive: true });
    
    const svg = readFileSync(svgPath, 'utf-8');
    const optimizedSvg = await optimizeSvg(svg, options.monochrome);
    const { code: componentCode, name: componentName } = svgToComponent(name, optimizedSvg);
    writeFileSync(absolutePath, componentCode, 'utf-8');

    // Extract category from path (e.g., 'web' from 'components/web/...')
    const category = path.relative(options.inputDir, path.dirname(svgPath))
      .split(path.sep)[0] // Get first folder name
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter

    return { 
      name: componentName, 
      path: relativePath,
      category 
    };
  } catch (err) {
    console.error(`Failed to generate component ${name}. Error: ${err}`);
  }
}

interface ComponentInfo {
  name: string;
  path: string;
  category: string; // derived from subfolder
}

function groupByCategory(components: ComponentInfo[]): Record<string, ComponentInfo[]> {
  return components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentInfo[]>);
}

function sanitizeCategoryName(category: string): string {
  return category
    // Remove leading numbers and special characters
    .replace(/^\d+/, '')
    // Split on spaces, +, and other special characters
    .split(/[\s+]+/)
    // Capitalize first letter of each word, lowercase the rest
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // Join without spaces
    .join('')
    // Remove any remaining special characters
    .replace(/[^a-zA-Z0-9]/g, '');
}

function sanitizeComponentName(name: string): string {
  return name
    .replace(/[+]/g, 'Plus')      // Replace + with Plus
    .replace(/[^a-zA-Z0-9]/g, ''); // Remove other special characters
}

function generateIndexContent(components: ComponentInfo[]): string {
  // Track both global and category-specific duplicates
  const globalDuplicates = new Map<string, number>();
  const categoryDuplicates = new Map<string, Map<string, string[]>>();

  // First pass - identify all duplicates
  components.forEach(component => {
    const name = sanitizeComponentName(component.name);
    const category = component.category;
    const numericId = component.path.match(/\d{5}/)?.[0] || '';

    // Track global duplicates
    globalDuplicates.set(name, (globalDuplicates.get(name) || 0) + 1);

    // Track category-specific duplicates
    if (!categoryDuplicates.has(category)) {
      categoryDuplicates.set(category, new Map());
    }
    const categoryMap = categoryDuplicates.get(category)!;
    if (!categoryMap.has(name)) {
      categoryMap.set(name, []);
    }
    categoryMap.get(name)!.push(numericId);
  });

  // Helper to get the correct alias for a component
  function getComponentAlias(name: string, category: string, path: string) {
    const isGlobalDuplicate = globalDuplicates.get(name)! > 1;
    const duplicatesInCategory = categoryDuplicates.get(category)!.get(name)!;
    const isCategoryDuplicate = duplicatesInCategory.length > 1;
    const numericId = path.match(/\d{5}/)?.[0] || '';
    
    const exactDuplicates = components.filter(c => name === sanitizeCategoryName(c.category));

    // Check for components that would have the same name+number alias
    const exactNumberDuplicates = components.filter(c => 
      sanitizeComponentName(c.name) + (c.path.match(/\d{5}/)?.[0] || '') === 
      name + numericId
    );
    
    if (exactNumberDuplicates.length > 1) {
      // Add category between name and number for disambiguation
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

  // Generate imports and exports for individual components
  const imports = components.map(component => {
    const name = sanitizeComponentName(component.name);
    const path = './' + component.path.replace(/\.tsx$/, '');
    const alias = getComponentAlias(name, component.category, component.path);
    
    return alias !== name
      ? `import { ${name} as ${alias} } from '${path}';`
      : `import { ${name} } from '${path}';`;
  }).join('\n');

  // Generate re-exports for all components
  const individualExports = components.map(component => {
    const name = sanitizeComponentName(component.name);
    const alias = getComponentAlias(name, component.category, component.path);
    
    return alias !== name
      ? `export { ${alias} };`
      : `export { ${name} };`;
  }).join('\n');

  // Generate category exports with components property
  const categoryExports = Object.entries(groupByCategory(components)).map(([category, comps]) => {
    const pascalCase = sanitizeCategoryName(category);
    const exportedNames = new Set<string>();
    const label = category
      .replace(/^\d+[-\s]*/, '')
      .split(/\s*\+\s*/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' + ');

    const exports = comps.map(comp => {
      const baseName = sanitizeComponentName(comp.name);
      const alias = getComponentAlias(baseName, comp.category, comp.path);
      
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

  // Generate default export (Categories) using the same structure
  const defaultExport = `export default {
    ${Object.keys(groupByCategory(components))
      .map(category => {
        const pascalCase = sanitizeCategoryName(category);
        return `${pascalCase}: ${pascalCase}`;
      })
      .join(',\n    ')}
  } as const;`;

  // Return the complete file content
  return `${imports}\n\n${individualExports}\n\n${categoryExports}\n\n${defaultExport}\n`;
}

function createIndexFile(components: ComponentInfo[], outputDir: string): void {
  const code = generateIndexContent(components);

  writeFileSync(path.join(outputDir, 'index.ts'), code, 'utf-8');
}

function createTypesFile(outputDir: string): void {
  const code = `import { SVGAttributes } from 'react';
    
    export interface AzureIconProps extends SVGAttributes<SVGElement> {
      size?: string;
    }`;

  writeFileSync(path.join(outputDir, 'types.ts'), code, 'utf-8');
}