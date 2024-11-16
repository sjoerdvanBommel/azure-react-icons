import { IconPathInfo } from "../types";

export function generateIconImports(iconPathInfos: IconPathInfo[]): string {
return iconPathInfos.map(({ pathName, componentName, exportAlias }) => {
    const path = './components/' + pathName;
    
    const importName = `${componentName}${exportAlias !== componentName ? ` as ${exportAlias}` : ''}`
    return `import { ${importName} } from '${path}';`
    }).join('\n');
}