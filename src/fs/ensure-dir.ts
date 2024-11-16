import { mkdirSync } from "fs";

export function ensureDirectory(dir: string): void {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory: ${error}`);
    throw error;
  }
}
