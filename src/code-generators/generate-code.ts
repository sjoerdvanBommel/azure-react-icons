import { rmSync } from 'fs';
import { join } from 'path';
import { downloadAndExtractAzureIcons } from '../download-and-extract-azure-icons';
import { cleanDir } from '../fs/clean-dir';
import { ensureDirectory } from '../fs/ensure-dir';
import { getAllSvgFiles } from '../fs/get-all-svg-files';
import { writeComponent } from '../fs/write-component';
import { writeIndex } from '../fs/write-index';
import { generateIconPathInfosMap } from '../generate-icon-path-info';

const COMPONENTS_DIR_NAME = 'components';
const OUTPUT_DIR = join(process.cwd(), 'src', 'generated');
const TMP_DIR = join(process.cwd(), 'tmp');
const ICONS_DIR = join(TMP_DIR, 'Azure_Public_Service_Icons/Icons');
const AZURE_ICONS_VERSION = 19;

async function main() {
  try {
    // Download and extract icons first
    await downloadAndExtractAzureIcons({ outputDir: TMP_DIR, version: AZURE_ICONS_VERSION });
    
    cleanDir(OUTPUT_DIR);
    ensureDirectory(join(OUTPUT_DIR, COMPONENTS_DIR_NAME));

    const filenames = getAllSvgFiles(ICONS_DIR);
    const { uniqueMap, duplicatesMap } = generateIconPathInfosMap(filenames)

    const allIconPathInfos = [...uniqueMap.values(), ...[...duplicatesMap.values()].flat()];
    // map over uniqueMap and return promises for each writeTsxComponent
    for (const iconPathInfo of allIconPathInfos) {
      await writeComponent(iconPathInfo, OUTPUT_DIR)
    }

    writeIndex(allIconPathInfos, OUTPUT_DIR);
    
    // Clean up tmp directory after processing
    rmSync(TMP_DIR, { recursive: true, force: true });

    console.log('Successfully processed icons');
  } catch (error) {
    console.error('Error processing icons:', error);
    process.exit(1);
  }
}

main();
