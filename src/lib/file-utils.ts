import { mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import path from 'path';

export function getAllSvgFiles(dir: string): string[] {
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

export function ensureDirectory(dir: string): void {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory: ${error}`);
    throw error;
  }
}

export function cleanDirectory(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }
} 