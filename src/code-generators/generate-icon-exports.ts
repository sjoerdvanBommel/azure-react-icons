import { IconPathInfo } from "../types";

export function generateIconExports(iconPathInfos: IconPathInfo[]) {
    const allExportNames = iconPathInfos.map(({ componentName, exportAlias }) => exportAlias !== componentName ? exportAlias : componentName);
    return `export {
  ${allExportNames.join(',\n  ')}
}`;
}