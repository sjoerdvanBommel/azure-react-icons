import { optimize, Config } from 'svgo';

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

export default async function optimizeSvg(svgString: string): Promise<string> {
  const result = optimize(svgString, baseConfig);

  if ('data' in result) {
    return result.data;
  }
  
  throw new Error('Failed to optimize SVG');
} 