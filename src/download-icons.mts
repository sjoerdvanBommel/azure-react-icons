import { createReadStream, createWriteStream, mkdirSync, rmSync } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { Extract } from 'unzipper';

const AZURE_ICONS_URL = 'https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V19.zip';
const TMP_DIR = join(process.cwd(), 'src/generated/tmp');
const ZIP_PATH = join(TMP_DIR, 'azure_icons.zip');

export async function downloadAndExtractAzureIcons(): Promise<void> {
  try {
    // Create tmp directory
    mkdirSync(TMP_DIR, { recursive: true });

    // Download zip file
    const response = await fetch(AZURE_ICONS_URL);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download icons: ${response.statusText}`);
    }

    // Save zip file
    await pipeline(
      response.body,
      createWriteStream(ZIP_PATH)
    );

    // Extract zip file
    await pipeline(
      createReadStream(ZIP_PATH),
      Extract({ path: TMP_DIR })
    );

    console.log('Successfully downloaded and extracted Azure icons');
  } catch (error) {
    console.error('Error downloading/extracting icons:', error);
    throw error;
  } finally {
    // Cleanup
    try {
      rmSync(ZIP_PATH, { force: true });
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
} 