import { JSDOM } from 'jsdom';
const dom = new JSDOM();
global.DOMParser = dom.window.DOMParser;

interface AttributeMap {
  [key: string]: string;
}

const attributesToRename: AttributeMap = {
  'xlink:href': 'xlinkHref',
  'class': 'className'
};

// Convert kebab-case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function toReactAttributes(element: Element) {
  Array.from(element.attributes || []).forEach((attr) => {
    const name = attr.name;
    const value = attr.value;
    
    // Skip data- attributes
    if (name.startsWith('data-') || (name.indexOf('-') === -1 && !attributesToRename[name])) {
      return;
    }

    const newName = attributesToRename[name] || toCamelCase(name);
    element.setAttribute(newName, value);
    element.removeAttribute(name);
  });

  if (element.children.length === 0) {
    return false;
  }

  Array.from(element.children).forEach((child) => {
    toReactAttributes(child);
  });
}

function formatCode(code: string): string {
  // Basic indentation and formatting
  return code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

export default function svg2component(filepath: string, svgString: string) {
  // Extract name from filepath, starting after "icon-service-"
  const nameMatch = filepath.match(/icon-service-(.*?)$/);
  
  // Convert the name to PascalCase and remove brackets
  const name = nameMatch![1]
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .replace(/[+]/g, 'Plus')      // Replace + with Plus
    .replace(/[^a-zA-Z0-9]/g, '') // Remove other special characters
    .replace(/[[\]()]/g, '');

  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) {
    throw new Error('No SVG element found');
  }

  // Process attributes
  toReactAttributes(svg);

  // Get SVG properties
  const viewBox = svg.getAttribute('viewBox') ? `viewBox="${svg.getAttribute('viewBox')}"` : '';
  const widthFromSvg = svg.getAttribute('width') || '1em';
  const heightFromSvg = svg.getAttribute('height') || '1em';
  
  // Get inner HTML (children)
  const children = svg.innerHTML
    .replace(/ xmlns="[^"]*"/g, '')
    .replace(/ style="isolation: isolate"/g, ' style={{ isolation: "isolate" }}')
    .replace(/ isolation="isolate"/g, ' style={{ isolation: "isolate" }}');
  
  const code = formatCode(`
import { AzureIconProps } from '../../types';
import { FC } from 'react';

export const ${name}: FC<AzureIconProps> = ({size, ...props}) => (
  <svg
    ${viewBox}
    fill="currentColor"
    width={size || "${widthFromSvg}"}
    height={size || "${heightFromSvg}"}
    {...props}
  >
    ${children}
  </svg>
);

${name}.displayName = '${name}';
  `);

  return { code, name };
} 