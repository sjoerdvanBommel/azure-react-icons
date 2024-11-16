import { SVGAttributes } from 'react';

export interface IconPathInfo {
  basename: string;
  pathName: string;
  componentName: string;
  originalSvgPath: string;
  categoryDisplayName: string;
  categoryName: string;
  pathCategory: string;
  relativeSvgPath: string;
  exportAlias: string;
  id: string;
  categoryExportAlias: string;
}
    
export interface AzureIconProps extends SVGAttributes<SVGElement> {
  size?: string;
}