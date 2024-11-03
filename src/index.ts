import { rmSync } from 'fs';
import { join } from 'path';
import { buildIcons } from './build-icons.ts';
import { downloadAndExtractAzureIcons } from './download-icons.ts';
import { parseParams } from './lib/parse-params.ts';

async function main() {
  try {
    const params = parseParams();
    // Download and extract icons first
    await downloadAndExtractAzureIcons();
    
    // Build icons from the extracted files
    await buildIcons({
      ...params,
      inputDir: join(process.cwd(), 'tmp/Azure_Public_Service_Icons/Icons') // Point to extracted files
    });
    
    // Clean up tmp directory after processing
    rmSync(join(process.cwd(), 'tmp'), { recursive: true, force: true });
  } catch (error) {
    console.error('Error processing icons:', error);
    process.exit(1);
  }
}

main();
