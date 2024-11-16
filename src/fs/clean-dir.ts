import { rmSync } from "fs";


export function cleanDir(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }
}
