import { rmSync } from 'fs';
import { join } from 'path';
import { buildIcons } from './build-icons';
import { downloadAndExtractAzureIcons } from './download-icons';

const OUTPUT_DIR = join(process.cwd(), 'src', 'generated');
const TMP_DIR = join(process.cwd(), 'tmp');
const ICONS_DIR = join(TMP_DIR, 'Azure_Public_Service_Icons/Icons');

async function main() {
  try {
    // Download and extract icons first
    await downloadAndExtractAzureIcons();
    
    // Build icons from the extracted files
    await buildIcons({
      inputDir: ICONS_DIR,
      outputDir: OUTPUT_DIR
    });
    
    // Clean up tmp directory after processing
    rmSync(TMP_DIR, { recursive: true, force: true });

    console.log('Successfully processed icons');
  } catch (error) {
    console.error('Error processing icons:', error);
    process.exit(1);
  }
}

main();
