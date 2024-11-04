import { createReadStream, createWriteStream, mkdirSync, rmSync } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { Extract } from 'unzipper';

export async function downloadAndExtractAzureIcons({ outputDir, version }: { outputDir: string, version: number }): Promise<void> {
  const zipDownloadUrl = `https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V${version}.zip`;
  const zipTargetPath = join(outputDir, 'azure_icons.zip');

  try {
    // Create tmp directory
    mkdirSync(outputDir, { recursive: true });

    // Download zip file
    const response = await fetch(zipDownloadUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download icons: ${response.statusText}`);
    }

    // Save zip file
    await pipeline(
      response.body,
      createWriteStream(zipTargetPath)
    );

    // Extract zip file
    await pipeline(
      createReadStream(zipTargetPath),
      Extract({ path: outputDir })
    );

    console.log('Successfully downloaded and extracted Azure icons');
  } catch (error) {
    console.error('Error downloading/extracting icons:', error);
    throw error;
  } finally {
    try {
      rmSync(zipTargetPath, { force: true });
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
} 