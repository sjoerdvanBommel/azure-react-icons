import { optimize, Config } from 'svgo';

interface OptimizeOptions {
  path?: string;
  [key: string]: unknown;
}

const baseConfig: Config = {
  plugins: [
    {
      name: 'removeViewBox',
    },
    {
      name: 'removeStyleElement',
    },
    {
      name: 'removeScriptElement',
    },
    {
      name: 'convertPathData',
      params: {
        applyTransforms: true
      }
    }
  ]
};

const monochromeConfig: Config = {
  plugins: [
    ...baseConfig.plugins!,
    {
      name: 'removeAttrs',
      params: {
        attrs: '(stroke|fill)'
      }
    }
  ]
};

export default async function optimizeSvg(
  svgString: string, 
  monochrome = false, 
  info: OptimizeOptions = {}
): Promise<string> {
  const result = optimize(svgString, {
    path: info.path,
    ...monochrome ? monochromeConfig : baseConfig
  });

  if ('data' in result) {
    return result.data;
  }
  
  throw new Error('Failed to optimize SVG');
} 