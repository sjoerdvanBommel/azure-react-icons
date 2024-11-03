import { rmSync } from 'fs';
import { join } from 'path';
import { buildIcons } from './build-icons.mjs';
import { downloadAndExtractAzureIcons } from './download-icons.mjs';
import { parseParams } from './lib/parse-params.mjs';

async function main() {
  try {
    const params = parseParams();
    
    // Download and extract icons first
    await downloadAndExtractAzureIcons();
    
    // Build icons from the extracted files
    await buildIcons({
      ...params,
      inputDir: join(process.cwd(), 'app/generated/tmp/Azure_Public_Service_Icons/Icons') // Point to extracted files
    });
    
    // Clean up tmp directory after processing
    rmSync(join(process.cwd(), 'app/generated/tmp'), { recursive: true, force: true });
  } catch (error) {
    console.error('Error processing icons:', error);
    process.exit(1);
  }
}

main();
