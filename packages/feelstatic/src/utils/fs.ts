import { existsSync, readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

export function* readDirectory(directories: string | string[]): Generator<string> {
  const allDirectories = Array.isArray(directories) ? directories : [directories];
  for (const directory of allDirectories) {
    if (!existsSync(directory)) {
      console.log('-- Directory does not exist', directory);
      continue;
    }

    const files = readdirSync(directory, { withFileTypes: true });
    for (const file of files) {
      if (file.name.includes('node_modules')) {
        continue;
      }

      if (file.isDirectory()) {
        yield* readDirectory(join(directory, file.name));
      } else {
        yield join(directory, file.name);
      }
    }
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T & { lastModified: Date }> {
  const fileJson = await readFile(filePath, 'utf8');
  const fileData = JSON.parse(fileJson);
  return fileData;
}
